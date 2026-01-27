"""URL 유틸리티 테스트."""
import pytest
from linkedin_intel.utils import canonicalize_url, url_hash, clean_title


class TestCanonicalizeUrl:
    def test_removes_utm(self):
        url = "https://linkedin.com/posts/abc?utm_source=google&utm_medium=cpc"
        assert "utm_source" not in canonicalize_url(url)

    def test_removes_trailing_slash(self):
        assert canonicalize_url("https://linkedin.com/posts/abc/") == "https://linkedin.com/posts/abc"

    def test_normalizes_http(self):
        assert canonicalize_url("http://linkedin.com/posts/abc").startswith("https://")

    def test_empty_url(self):
        assert canonicalize_url("") == ""


class TestUrlHash:
    def test_same_url_same_hash(self):
        url1 = "https://linkedin.com/posts/abc"
        url2 = "http://linkedin.com/posts/abc/"
        assert url_hash(url1) == url_hash(url2)


class TestCleanTitle:
    def test_removes_linkedin_suffix(self):
        assert clean_title("Some Post | LinkedIn") == "Some Post"
        assert clean_title("Some Post - LinkedIn") == "Some Post"

    def test_none_input(self):
        assert clean_title(None) is None
