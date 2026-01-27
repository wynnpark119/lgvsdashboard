"""Google CSE 커넥터."""
import logging
import time
from datetime import datetime
from typing import Any
import httpx
from linkedin_intel.config import settings
from linkedin_intel.connectors.base import BaseConnector

logger = logging.getLogger(__name__)
CSE_API_URL = "https://www.googleapis.com/customsearch/v1"


class GoogleCSEConnector(BaseConnector):
    channel = "google_cse"

    def fetch(self, query_string: str, pages: int = 1, **kwargs) -> list[dict[str, Any]]:
        if not settings.has_cse_credentials():
            raise ValueError("Google CSE credentials not configured")
        all_items = []
        for page in range(pages):
            start = page * 10 + 1
            if start > 91:
                break
            items = self._search(query_string, start)
            all_items.extend(items)
            if page < pages - 1:
                time.sleep(settings.request_delay)
        return all_items

    def _search(self, query: str, start: int = 1) -> list[dict[str, Any]]:
        params = {"key": settings.google_cse_api_key, "cx": settings.google_cse_cx, "q": query, "start": start, "num": 10}
        logger.debug(f"CSE search: {query} (start={start})")
        with httpx.Client(timeout=30) as client:
            response = client.get(CSE_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
        return [self._parse_item(item) for item in data.get("items", [])]

    def _parse_item(self, item: dict[str, Any]) -> dict[str, Any]:
        pagemap = item.get("pagemap", {})
        metatags = pagemap.get("metatags", [{}])[0]
        published_at = None
        date_str = metatags.get("article:published_time") or metatags.get("og:updated_time")
        if date_str:
            try:
                published_at = datetime.fromisoformat(date_str.replace("Z", "+00:00")).isoformat()
            except (ValueError, TypeError):
                pass
        return {
            "url": item.get("link", ""), "title": item.get("title", ""), "snippet": item.get("snippet", ""),
            "published_at": published_at, "author": metatags.get("author"),
            "raw": {"displayLink": item.get("displayLink"), "formattedUrl": item.get("formattedUrl"), "pagemap": pagemap}}
