import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import logging

from database import engine, Base, get_db
from models import MediaAsset, Analysis, AnalysisStage, Score, TranscriptSegment, Scene, OCRSpan, Finding, GeneratedAsset
from ai_service import run_analysis_pipeline
from media_service import probe_media

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create uploads folder
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="AI Content Optimizer API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static media files
app.mount("/static-media", StaticFiles(directory=UPLOAD_DIR), name="static-media")

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/media/upload")
def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Direct upload endpoint. Saves the media file locally, runs ffprobe metadata extraction,
    and registers it in the SQLite database.
    """
    try:
        # Generate safe filename and path
        import uuid
        file_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1]
        safe_filename = f"{file_id}{ext}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info(f"Saved uploaded file to {file_path}")
        
        # Probe file for dimensions, duration, etc.
        media_info = probe_media(file_path)
        
        # Create MediaAsset record
        media_asset = MediaAsset(
            id=file_id,
            type=media_info["type"],
            original_filename=file.filename,
            object_key=safe_filename,
            mime_type=file.content_type or "application/octet-stream",
            size_bytes=media_info["size_bytes"],
            duration_ms=media_info.get("duration_ms"),
            width=media_info.get("width"),
            height=media_info.get("height"),
            fps=media_info.get("fps"),
            status="uploaded"
        )
        
        db.add(media_asset)
        db.commit()
        db.refresh(media_asset)
        
        return {
            "media_id": media_asset.id,
            "filename": media_asset.original_filename,
            "type": media_asset.type,
            "size_bytes": media_asset.size_bytes,
            "duration_ms": media_asset.duration_ms
        }
    except Exception as e:
        logger.error(f"Error uploading media: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload media: {str(e)}")

@app.post("/api/v1/analyses")
def create_analysis(
    background_tasks: BackgroundTasks,
    media_id: str = Form(...),
    platform: str = Form(...),
    objective: str = Form(...),
    niche: Optional[str] = Form(None),
    target_audience: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
    current_caption: Optional[str] = Form(None),
    revision_parent_id: Optional[str] = Form(None),  # For linking revisions
    db: Session = Depends(get_db)
):
    """
    Initiate video analysis. Creates an Analysis database record, initializes progress stages,
    and schedules the background media processing task.
    """
    media_asset = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not media_asset:
        raise HTTPException(status_code=404, detail="Media asset not found")
        
    # Check if a revision group applies
    revision_group_id = None
    if revision_parent_id:
        parent = db.query(Analysis).filter(Analysis.id == revision_parent_id).first()
        if parent:
            # Group ID can simply be the parent ID
            revision_group_id = parent.id

    # Create Analysis record
    analysis = Analysis(
        media_asset_id=media_id,
        platform=platform,
        objective=objective,
        niche=niche,
        target_audience=target_audience,
        language=language,
        current_caption=current_caption,
        status="pending",
        revision_group_id=revision_group_id
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    # Initialize analysis stages
    stages = ["media_probe", "transcription", "scene_detection", "ocr", "creative_analysis", "completed"]
    for stage_name in stages:
        stage = AnalysisStage(
            analysis_id=analysis.id,
            stage=stage_name,
            status="pending"
        )
        db.add(stage)
    db.commit()
    
    # Start background processing pipeline
    file_path = os.path.join(UPLOAD_DIR, media_asset.object_key)
    # We pass the db sessionmaker factory to run inside the background worker safely
    from database import SessionLocal
    background_tasks.add_task(run_analysis_pipeline, SessionLocal, analysis.id, file_path)
    
    return {
        "analysis_id": analysis.id,
        "status": "pending",
        "message": "Analysis started in background"
    }

@app.get("/api/v1/analyses")
def list_analyses(db: Session = Depends(get_db)):
    """
    List all analyses with basic meta and scores.
    """
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    results = []
    for a in analyses:
        score = None
        if a.score:
            score = {
                "overall": a.score.overall,
                "hook": a.score.hook,
                "pacing": a.score.pacing,
                "clarity": a.score.clarity,
                "visual": a.score.visual,
                "audio": a.score.audio,
                "accessibility": a.score.accessibility,
                "searchability": a.score.searchability,
                "engagement": a.score.engagement
            }
            
        results.append({
            "id": a.id,
            "media_id": a.media_asset_id,
            "filename": a.media_asset.original_filename,
            "type": a.media_asset.type,
            "platform": a.platform,
            "objective": a.objective,
            "status": a.status,
            "created_at": a.created_at,
            "completed_at": a.completed_at,
            "score": score,
            "revision_group_id": a.revision_group_id
        })
    return results

@app.get("/api/v1/analyses/{id}")
def get_analysis_status(id: str, db: Session = Depends(get_db)):
    """
    Get progress stages of a running analysis.
    """
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    stages = db.query(AnalysisStage).filter(AnalysisStage.analysis_id == id).all()
    stages_list = []
    for s in stages:
        stages_list.append({
            "stage": s.stage,
            "status": s.status,
            "started_at": s.started_at,
            "completed_at": s.completed_at,
            "error_message": s.error_message
        })
        
    return {
        "id": analysis.id,
        "status": analysis.status,
        "stages": stages_list
    }

@app.get("/api/v1/analyses/{id}/report")
def get_analysis_report(id: str, db: Session = Depends(get_db)):
    """
    Retrieve full parsed creative report containing transcripts, timeline scenes,
    copy suggestions, score breakdown, and findings.
    """
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    if analysis.status != "completed":
        return {
            "id": analysis.id,
            "status": analysis.status,
            "message": "Analysis is not ready yet."
        }

    # Format Score
    score = {
        "overall": analysis.score.overall if analysis.score else 0,
        "hook": analysis.score.hook if analysis.score else 0,
        "clarity": analysis.score.clarity if analysis.score else 0,
        "pacing": analysis.score.pacing if analysis.score else 0,
        "visual": analysis.score.visual if analysis.score else 0,
        "audio": analysis.score.audio if analysis.score else 0,
        "accessibility": analysis.score.accessibility if analysis.score else 0,
        "searchability": analysis.score.searchability if analysis.score else 0,
        "engagement": analysis.score.engagement if analysis.score else 0
    }

    # Format Transcript
    transcript = []
    for t in analysis.transcript_segments:
        transcript.append({
            "start_ms": t.start_ms,
            "end_ms": t.end_ms,
            "text": t.text,
            "speaker": t.speaker
        })

    # Format Scenes
    scenes = []
    for s in analysis.scenes:
        ocr_text = ""
        if s.ocr_spans:
            ocr_text = "\n".join([o.text for o in s.ocr_spans])
            
        scenes.append({
            "start_ms": s.start_ms,
            "end_ms": s.end_ms,
            "description": s.description,
            "ocr_text": ocr_text,
            "representative_frame_url": f"/static-media/{s.representative_frame_key}" if s.representative_frame_key else None
        })

    # Format Findings
    findings = []
    for f in analysis.findings:
        findings.append({
            "id": f.id,
            "category": f.category,
            "severity": f.severity,
            "start_ms": f.start_ms,
            "end_ms": f.end_ms,
            "title": f.title,
            "evidence": f.evidence,
            "explanation": f.explanation,
            "recommendation": f.recommendation,
            "confidence": f.confidence
        })

    # Format Generated Assets
    assets = {}
    for g in analysis.generated_assets:
        if g.type == "caption":
            if "captions" not in assets:
                assets["captions"] = []
            assets["captions"].append({
                "variant": g.variant,
                "text": g.content_json.get("text", ""),
                "explanation": g.content_json.get("explanation", "")
            })
        else:
            assets[g.type] = g.content_json

    # Media Asset details
    media_url = f"/static-media/{analysis.media_asset.object_key}"
    media = {
        "id": analysis.media_asset.id,
        "original_filename": analysis.media_asset.original_filename,
        "type": analysis.media_asset.type,
        "mime_type": analysis.media_asset.mime_type,
        "duration_ms": analysis.media_asset.duration_ms,
        "width": analysis.media_asset.width,
        "height": analysis.media_asset.height,
        "fps": analysis.media_asset.fps,
        "media_url": media_url
    }

    # Check for revision comparison if this belongs to a group
    revisions = []
    # If this analysis has a parent (revision_group_id is not null) or is a parent (has analyses pointing to it)
    search_id = analysis.revision_group_id or analysis.id
    related_analyses = db.query(Analysis).filter(
        (Analysis.id == search_id) | (Analysis.revision_group_id == search_id)
    ).all()
    
    for r in related_analyses:
        if r.id != analysis.id and r.status == "completed" and r.score:
            revisions.append({
                "id": r.id,
                "filename": r.media_asset.original_filename,
                "created_at": r.created_at,
                "score": {
                    "overall": r.score.overall,
                    "hook": r.score.hook,
                    "pacing": r.score.pacing
                }
            })

    return {
        "analysis_id": analysis.id,
        "platform": analysis.platform,
        "objective": analysis.objective,
        "niche": analysis.niche,
        "target_audience": analysis.target_audience,
        "current_caption": analysis.current_caption,
        "status": analysis.status,
        "created_at": analysis.created_at,
        "completed_at": analysis.completed_at,
        "score": score,
        "media": media,
        "transcript": transcript,
        "scenes": scenes,
        "findings": findings,
        "generated_assets": assets,
        "revisions": revisions
    }

@app.delete("/api/v1/analyses/{id}")
def delete_analysis(id: str, db: Session = Depends(get_db)):
    """
    Delete an analysis and its associated media files from storage.
    """
    analysis = db.query(Analysis).filter(Analysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    try:
        # Delete file from storage
        media_asset = analysis.media_asset
        if media_asset:
            file_path = os.path.join(UPLOAD_DIR, media_asset.object_key)
            if os.path.exists(file_path):
                os.remove(file_path)
            # Remove audio copy if exists
            audio_path = file_path + ".wav"
            if os.path.exists(audio_path):
                os.remove(audio_path)
                
        # Delete records (cascades handle children)
        db.delete(analysis)
        db.commit()
        return {"status": "success", "message": "Analysis and associated media deleted."}
    except Exception as e:
        logger.error(f"Error deleting analysis {id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
