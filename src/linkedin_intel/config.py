"""환경변수 및 설정 관리."""
from functools import lru_cache
from pathlib import Path
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    google_cse_api_key: str = Field(default="")
    google_cse_cx: str = Field(default="")
    database_path: str = Field(default="./data/geo.db")
    request_delay: float = Field(default=1.0)
    streamlit_port: int = Field(default=8501)
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(default="INFO")

    @property
    def db_path(self) -> Path:
        return Path(self.database_path)

    def has_cse_credentials(self) -> bool:
        return bool(self.google_cse_api_key and self.google_cse_cx)


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
