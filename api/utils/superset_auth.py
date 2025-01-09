from functools import wraps
from flask import request, current_app
from werkzeug.exceptions import Unauthorized
import logging
from flask.sessions import SecureCookieSessionInterface
from flask.json.tag import TaggedJSONSerializer
import base64
import zlib
import json
from utils.error import SupersetAuthError


def decode_session_cookie(cookie_data):
    """
    Decode the session cookie without verifying the signature
    """
    try:
        if cookie_data.startswith('.'):
            cookie_data = cookie_data[1:]
            
        parts = cookie_data.split('.')
        if len(parts) != 3:
            raise SupersetAuthError("Invalid cookie format")
            
        payload = parts[0]
        
        # Add padding if needed
        padding = '=' * (-len(payload) % 4)
        padded_payload = payload + padding
        
        try:
            # First base64 decode
            decoded = base64.urlsafe_b64decode(padded_payload)
            # Then decompress
            decompressed = zlib.decompress(decoded)
            # Finally parse JSON
            session_data = json.loads(decompressed)
            logging.info(f"Successfully decoded session data: {session_data}")
            return session_data
            
        except Exception as e:
            logging.error(f"Failed to decode payload: {str(e)}")
            return None
            
    except Exception as e:
        logging.error(f"Error decoding session: {str(e)}")
        return None

def validate_superset_cookie(cookie):
    try:
        logging.info("Attempting to decode cookie")
        
        decoded_data = decode_session_cookie(cookie)
        if not decoded_data:
            raise SupersetAuthError("Failed to decode session data")
            
        logging.info(f"Successfully decoded session data: {decoded_data}")
        
        # Validate required fields
        required_fields = ['_user_id', 'csrf_token']
        for field in required_fields:
            if field not in decoded_data:
                raise SupersetAuthError(f"Missing required field: {field}")
                
        # Extract user information
        user_data = {
            'user_id': decoded_data.get('_user_id'),
            'csrf_token': decoded_data.get('csrf_token'),
            'locale': decoded_data.get('locale', 'en'),
            'is_fresh': decoded_data.get('_fresh', False)
        }
        
        return user_data
        
    except Exception as e:
        logging.error(f"Authentication error: {str(e)}")
        raise SupersetAuthError(str(e))

def requires_superset_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        cookie = request.cookies.get('session')
        
        if not cookie:
            logging.error("No cookie provided")
            raise Unauthorized("No authentication cookie provided")
        
        logging.info("Received cookie for validation")
        
        try:
            user_data = validate_superset_cookie(cookie)
            request.user = user_data
            return f(*args, **kwargs)
            
        except SupersetAuthError as e:
            logging.error(f"Authentication failed: {str(e)}")
            raise Unauthorized(str(e))
            
    return decorated 