"""CSV 임포트 커넥터."""
import csv
import logging
from pathlib import Path
from typing import Any
from linkedin_intel.connectors.base import BaseConnector

logger = logging.getLogger(__name__)


class CSVConnector(BaseConnector):
    channel = "manual"

    def fetch(self, csv_path: Path, **kwargs) -> list[dict[str, Any]]:
        items = []
        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                url = row.get("url", "").strip()
                if not url:
                    continue
                if row.get("channel"):
                    self.channel = row["channel"].strip()
                items.append({"url": url, "title": row.get("title", "").strip(), "snippet": row.get("snippet", "").strip(),
                    "published_at": row.get("published_at", "").strip() or None, "author": row.get("author", "").strip() or None,
                    "raw": {"source_file": csv_path.name}})
        logger.info(f"CSV loaded {len(items)} items from {csv_path}")
        return items
