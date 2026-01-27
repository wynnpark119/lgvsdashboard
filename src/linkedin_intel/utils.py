"""URL 정규화 유틸리티."""
import hashlib
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

TRACKING_PARAMS = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "fbclid", "gclid", "li_fat_id", "trk", "trkInfo", "refId", "trackingId", "lipi", "licu"}

LINKEDIN_SUBDOMAIN_MAP = {"www.linkedin.com": "linkedin.com", "kr.linkedin.com": "linkedin.com",
    "de.linkedin.com": "linkedin.com", "uk.linkedin.com": "linkedin.com", "fr.linkedin.com": "linkedin.com"}


def canonicalize_url(url: str) -> str:
    """URL 정규화 (UTM 제거, trailing slash 정규화)."""
    if not url:
        return ""
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return url
    scheme = "https" if parsed.scheme in ("http", "https", "") else parsed.scheme
    netloc = LINKEDIN_SUBDOMAIN_MAP.get(parsed.netloc.lower(), parsed.netloc.lower())
    path = parsed.path.rstrip("/") or "/"
    query_params = parse_qs(parsed.query, keep_blank_values=False)
    filtered = {k: v for k, v in query_params.items() if k.lower() not in TRACKING_PARAMS}
    query = urlencode(sorted(filtered.items()), doseq=True) if filtered else ""
    return urlunparse((scheme, netloc, path, "", query, ""))


def url_hash(url: str) -> str:
    return hashlib.sha256(canonicalize_url(url).encode()).hexdigest()


def clean_title(title: str | None) -> str | None:
    if not title:
        return None
    for suffix in [" | LinkedIn", " - LinkedIn", " on LinkedIn"]:
        if title.endswith(suffix):
            title = title[:-len(suffix)].strip()
    return title or None
