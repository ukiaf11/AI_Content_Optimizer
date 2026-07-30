import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(String, primary_key=True, default=generate_uuid)
    type = Column(String, nullable=False)  # video, image, carousel
    original_filename = Column(String, nullable=False)
    object_key = Column(String, nullable=False)  # Local file path
    mime_type = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    sha256 = Column(String, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    fps = Column(Float, nullable=True)
    status = Column(String, default="uploaded")  # uploaded, processed, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("Analysis", back_populates="media_asset", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=generate_uuid)
    media_asset_id = Column(String, ForeignKey("media_assets.id"), nullable=False, index=True)
    platform = Column(String, nullable=False)  # instagram, tiktok, youtube, etc.
    objective = Column(String, nullable=False)  # views, follows, saves, shares, comments, leads, sales
    niche = Column(String, nullable=True)
    target_audience = Column(String, nullable=True)
    language = Column(String, default="en")
    current_caption = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    revision_group_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    media_asset = relationship("MediaAsset", back_populates="analyses")
    stages = relationship("AnalysisStage", back_populates="analysis", cascade="all, delete-orphan")
    transcript_segments = relationship("TranscriptSegment", back_populates="analysis", cascade="all, delete-orphan")
    scenes = relationship("Scene", back_populates="analysis", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="analysis", cascade="all, delete-orphan")
    generated_assets = relationship("GeneratedAsset", back_populates="analysis", cascade="all, delete-orphan")
    score = relationship("Score", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class AnalysisStage(Base):
    __tablename__ = "analysis_stages"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False, index=True)
    stage = Column(String, nullable=False)  # media_probe, transcription, scene_detection, ocr, creative_analysis, completed
    status = Column(String, default="pending")  # pending, processing, completed, failed
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

    analysis = relationship("Analysis", back_populates="stages")

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False, index=True)
    start_ms = Column(Integer, nullable=False)
    end_ms = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    speaker = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)

    analysis = relationship("Analysis", back_populates="transcript_segments")

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False, index=True)
    start_ms = Column(Integer, nullable=False)
    end_ms = Column(Integer, nullable=False)
    representative_frame_key = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    analysis = relationship("Analysis", back_populates="scenes")
    ocr_spans = relationship("OCRSpan", back_populates="scene", cascade="all, delete-orphan")

class OCRSpan(Base):
    __tablename__ = "ocr_spans"

    id = Column(String, primary_key=True, default=generate_uuid)
    scene_id = Column(String, ForeignKey("scenes.id"), nullable=False, index=True)
    start_ms = Column(Integer, nullable=False)
    end_ms = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)

    scene = relationship("Scene", back_populates="ocr_spans")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False, index=True)
    category = Column(String, nullable=False)  # hook, clarity, pacing, visual, audio, accessibility, searchability, engagement
    severity = Column(String, nullable=False)  # high, medium, low
    start_ms = Column(Integer, nullable=True)
    end_ms = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    confidence = Column(String, nullable=True)  # high, medium, low

    analysis = relationship("Analysis", back_populates="findings")

class GeneratedAsset(Base):
    __tablename__ = "generated_assets"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False, index=True)
    type = Column(String, nullable=False)  # caption, hashtag_set, cover, cta, keyword, idea
    variant = Column(String, nullable=True)  # Option A, Option B, etc.
    content_json = Column(JSON, nullable=False)

    analysis = relationship("Analysis", back_populates="generated_assets")

class Score(Base):
    __tablename__ = "scores"

    analysis_id = Column(String, ForeignKey("analyses.id"), primary_key=True)
    hook = Column(Integer, nullable=False)
    clarity = Column(Integer, nullable=False)
    pacing = Column(Integer, nullable=False)
    visual = Column(Integer, nullable=False)
    audio = Column(Integer, nullable=False)
    accessibility = Column(Integer, nullable=False)
    searchability = Column(Integer, nullable=False)
    engagement = Column(Integer, nullable=False)
    overall = Column(Integer, nullable=False)

    analysis = relationship("Analysis", back_populates="score")
