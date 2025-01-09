class SupersetAuthError(Exception):
    """Custom exception for Superset authentication errors"""
    def __init__(self, message: str, status_code: int = 401):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

    def __str__(self):
        return f"SupersetAuthError: {self.message}"

class NoAuthCookieError(SupersetAuthError):
    """Raised when no authentication cookie is provided"""
    def __init__(self):
        super().__init__("No authentication cookie provided", 401)

class InvalidAuthCookieError(SupersetAuthError):
    """Raised when the authentication cookie is invalid"""
    def __init__(self):
        super().__init__("Invalid authentication cookie", 401)