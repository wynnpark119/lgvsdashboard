"""SQLAlchemy ORM 모델."""
from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Index, Integer, String, Table, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class SourceType(str, Enum):
    GOOGLE_CSE = "google_cse"
    RSS = "rss"
    EMAIL = "email"
    MANUAL = "manual"
    AI_CITATION = "ai_citation"
    SALESNAV = "salesnav"


class RunStatus(str, Enum):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


item_tags = Table("item_tags", Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True))


class Query(Base):
    __tablename__ = "queries"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    query_string: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    runs: Mapped[list["Run"]] = relationship(back_populates="query", cascade="all, delete-orphan")
    items: Mapped[list["Item"]] = relationship(back_populates="query")


class Source(Base):
    __tablename__ = "sources"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[SourceType] = mapped_column(SQLEnum(SourceType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    config_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    runs: Mapped[list["Run"]] = relationship(back_populates="source", cascade="all, delete-orphan")
    items: Mapped[list["Item"]] = relationship(back_populates="source")
    __table_args__ = (UniqueConstraint("name", "type", name="uq_source_name_type"),)


class Run(Base):
    __tablename__ = "runs"
    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[Optional[int]] = mapped_column(ForeignKey("sources.id", ondelete="SET NULL"), nullable=True)
    query_id: Mapped[Optional[int]] = mapped_column(ForeignKey("queries.id", ondelete="SET NULL"), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[RunStatus] = mapped_column(SQLEnum(RunStatus, values_callable=lambda x: [e.value for e in x]), default=RunStatus.RUNNING)
    records_fetched: Mapped[int] = mapped_column(Integer, default=0)
    error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional["Source"]] = relationship(back_populates="runs")
    query: Mapped[Optional["Query"]] = relationship(back_populates="runs")
    __table_args__ = (Index("idx_runs_started_at", "started_at"),)


class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    canonical_url: Mapped[str] = mapped_column(String(2048), nullable=False, unique=True)
    title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    author: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    collected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    source_id: Mapped[Optional[int]] = mapped_column(ForeignKey("sources.id", ondelete="SET NULL"), nullable=True)
    query_id: Mapped[Optional[int]] = mapped_column(ForeignKey("queries.id", ondelete="SET NULL"), nullable=True)
    channel: Mapped[str] = mapped_column(String(50), nullable=False)
    raw_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional["Source"]] = relationship(back_populates="items")
    query: Mapped[Optional["Query"]] = relationship(back_populates="items")
    tags: Mapped[list["Tag"]] = relationship(secondary=item_tags, back_populates="items")
    __table_args__ = (Index("idx_items_channel", "channel"), Index("idx_items_collected_at", "collected_at"))


class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    items: Mapped[list["Item"]] = relationship(secondary=item_tags, back_populates="tags")


SEED_QUERIES = [
    {"name": "ADAS", "query_string": 'site:linkedin.com/posts "Advanced Driver Assistance" OR ADAS', "language": "en"},
    {"name": "SDV", "query_string": 'site:linkedin.com/posts "Software Defined Vehicle" OR SDV', "language": "en"},
    {"name": "IVI", "query_string": 'site:linkedin.com/posts "In-Vehicle Infotainment" OR IVI', "language": "en"},
    {"name": "Digital Cockpit", "query_string": 'site:linkedin.com/posts "Digital Cockpit"', "language": "en"},
    {"name": "Automotive HMI", "query_string": 'site:linkedin.com/posts "Automotive HMI"', "language": "en"},
]

SEED_TAGS = [{"name": "important"}, {"name": "competitor"}, {"name": "technology"}, {"name": "market"}, {"name": "partnership"}]
