"""Token schemas for authentication."""
from pydantic import BaseModel


class Token(BaseModel):
    """Access and refresh token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Refresh token request."""
    refresh_token: str


class TokenPayload(BaseModel):
    """JWT token payload."""
    sub: str | None = None
    exp: int | None = None
