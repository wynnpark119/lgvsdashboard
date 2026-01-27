"""RSS 커넥터."""
import json
import logging
from datetime import datetime
from email.utils import parsedate_to_datetime
from typing import Any
import feedparser
import httpx
from bs4 import BeautifulSoup
from linkedin_intel.connectors.base import BaseConnector
from linkedin_intel.models import get_session, Source

logger = logging.getLogger(__name__)


class RSSConnector(BaseConnector):
    channel = "rss"

    def fetch(self, feed_url: str = None, max_items: int = 50, **kwargs) -> list[dict[str, Any]]:
        # source_id가 있으면 DB에서 URL 조회
        if not feed_url and self.source_id:
            with get_session() as session:
                source = session.query(Source).filter(Source.id == self.source_id).first()
                if source and source.config_json:
                    config = json.loads(source.config_json)
                    feed_url = config.get("feed_url")
        if not feed_url:
            raise ValueError("RSS feed URL not provided")
        
        headers = {"User-Agent": "GEO-LinkedIn-Intel/1.0"}
        with httpx.Client(timeout=30, follow_redirects=True) as client:
            response = client.get(feed_url, headers=headers)
            response.raise_for_status()
        feed = feedparser.parse(response.text)
        items = []
        for entry in feed.entries[:max_items]:
            if entry.get("link"):
                items.append(self._parse_entry(entry))
        logger.info(f"RSS fetched {len(items)} items from {feed_url}")
        return items

    def _parse_entry(self, entry: dict[str, Any]) -> dict[str, Any]:
        published_at = None
        date_str = entry.get("published") or entry.get("updated")
        if date_str:
            try:
                published_at = parsedate_to_datetime(date_str).isoformat()
            except (ValueError, TypeError):
                try:
                    published_at = datetime.fromisoformat(date_str.replace("Z", "+00:00")).isoformat()
                except (ValueError, TypeError):
                    pass
        summary = entry.get("summary", "")
        if summary:
            soup = BeautifulSoup(summary, "lxml")
            summary = soup.get_text(separator=" ", strip=True)[:500]
        return {"url": entry.get("link", ""), "title": entry.get("title", ""), "snippet": summary,
            "published_at": published_at, "author": entry.get("author"), "raw": {"feed_id": entry.get("id")}}
