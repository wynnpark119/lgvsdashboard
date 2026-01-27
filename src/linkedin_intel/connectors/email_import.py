"""Email (.eml) 커넥터."""
import email
import logging
import re
from email import policy
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse
from bs4 import BeautifulSoup
from linkedin_intel.connectors.base import BaseConnector

logger = logging.getLogger(__name__)
GOOGLE_REDIRECT = re.compile(r"https?://www\.google\.com/url\?.*?url=([^&]+)")


class EmailConnector(BaseConnector):
    channel = "email"

    def fetch(self, eml_path: Path, **kwargs) -> list[dict[str, Any]]:
        eml_files = [eml_path] if eml_path.is_file() else list(eml_path.glob("*.eml"))
        all_items = []
        for f in eml_files:
            try:
                all_items.extend(self._parse_eml(f))
            except Exception as e:
                logger.warning(f"Failed to parse {f.name}: {e}")
        logger.info(f"Email parsed {len(all_items)} items from {len(eml_files)} files")
        return all_items

    def _parse_eml(self, eml_path: Path) -> list[dict[str, Any]]:
        with open(eml_path, "rb") as f:
            msg = email.message_from_binary_file(f, policy=policy.default)
        email_date = None
        if msg.get("Date"):
            try:
                email_date = parsedate_to_datetime(msg.get("Date")).isoformat()
            except (ValueError, TypeError):
                pass
        html = self._get_html(msg)
        if not html:
            return []
        soup = BeautifulSoup(html, "lxml")
        items = []
        seen = set()
        for a in soup.find_all("a", href=True):
            url = a["href"]
            if not url or url.startswith("#") or url.startswith("mailto:"):
                continue
            url = self._unwrap_redirect(url)
            if url in seen:
                continue
            seen.add(url)
            items.append({"url": url, "title": a.get_text(strip=True), "snippet": "", "published_at": email_date,
                "raw": {"email_file": eml_path.name}})
        return items

    def _get_html(self, msg) -> str | None:
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    payload = part.get_payload(decode=True)
                    return payload.decode(part.get_content_charset() or "utf-8", errors="replace") if payload else None
        elif msg.get_content_type() == "text/html":
            payload = msg.get_payload(decode=True)
            return payload.decode(msg.get_content_charset() or "utf-8", errors="replace") if payload else None
        return None

    def _unwrap_redirect(self, url: str) -> str:
        m = GOOGLE_REDIRECT.search(url)
        return unquote(m.group(1)) if m else url
