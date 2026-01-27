"""커넥터 기본 클래스."""
import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from linkedin_intel.models import get_session, Item, Run, RunStatus
from linkedin_intel.utils import canonicalize_url, clean_title


@dataclass
class IngestResult:
    total_fetched: int = 0
    new_items: int = 0
    duplicates: int = 0
    errors: int = 0
    error_messages: list[str] = field(default_factory=list)


class BaseConnector(ABC):
    channel: str = "unknown"

    def __init__(self, query_id: int | None = None, source_id: int | None = None):
        self.query_id = query_id
        self.source_id = source_id

    @abstractmethod
    def fetch(self, **kwargs) -> list[dict[str, Any]]:
        pass

    def ingest(self, **kwargs) -> IngestResult:
        result = IngestResult()
        with get_session() as session:
            run = Run(source_id=self.source_id, query_id=self.query_id, status=RunStatus.RUNNING)
            session.add(run)
            session.flush()
            run_id = run.id
            try:
                items = self.fetch(**kwargs)
                result.total_fetched = len(items)
                for item_data in items:
                    try:
                        if self._save_item(session, item_data):
                            result.new_items += 1
                        else:
                            result.duplicates += 1
                    except Exception as e:
                        result.errors += 1
                        result.error_messages.append(str(e))
                run.status = RunStatus.COMPLETED
                run.ended_at = datetime.utcnow()
                run.records_fetched = result.new_items
            except Exception as e:
                result.errors += 1
                result.error_messages.append(str(e))
                run.status = RunStatus.FAILED
                run.ended_at = datetime.utcnow()
                run.error = str(e)[:1000]
        return result

    def _save_item(self, session, item_data: dict[str, Any]) -> bool:
        url = item_data.get("url", "")
        if not url:
            return False
        canonical = canonicalize_url(url)
        existing = session.query(Item).filter(Item.canonical_url == canonical).first()
        if existing:
            existing.last_seen_at = datetime.utcnow()
            return False
        published_at = item_data.get("published_at")
        if published_at and isinstance(published_at, str):
            try:
                published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                published_at = None
        item = Item(
            url=url, canonical_url=canonical, title=clean_title(item_data.get("title")),
            snippet=item_data.get("snippet"), author=item_data.get("author"), published_at=published_at,
            source_id=self.source_id, query_id=self.query_id, channel=self.channel,
            raw_json=json.dumps(item_data.get("raw", {})) if item_data.get("raw") else None)
        session.add(item)
        return True
