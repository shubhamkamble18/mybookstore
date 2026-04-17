from flask import request, jsonify
from firebase_admin import auth as firebase_auth
import firebase_admin
import os
from config import Config

def verify_firebase_token():
    # Public routes that don't need authentication
    public_paths = [
        '/api/products/', 
        '/api/auth/ping',
        '/api/products'
    ]
    
    # Check if the current request path matches a public path
    if any(request.path.startswith(path) for path in public_paths):
        return None

    # Handle OPTIONS requests for CORS
    if request.method == 'OPTIONS':
        return None

    # 🧪 DEVELOPMENT BYPASS: If Firebase keys are missing in .env, allow requests for testing
    # This allows the UI to work even without a full Service Account setup during dev.
    is_missing = not Config.FIREBASE_PRIVATE_KEY.strip() or not Config.FIREBASE_CLIENT_EMAIL.strip()
    
    if is_missing:
        # print("⚠️  [middleware] AUTH BYPASS ACTIVE")
        # In development bypass, we treat the dev user as an admin
        request.user = {"uid": "dev_user_123", "email": "dev@example.com", "admin": True}
        return None
    
    # List of Admin UIDs (In a real app, use custom claims)
    ADMIN_UIDS = os.getenv("ADMIN_UIDS", "").split(",")

    # print(f"DEBUG: Auth bypass skipped. Key length: {len(Config.FIREBASE_PRIVATE_KEY.strip())}")

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({
            "error": "Missing or invalid Authorization header",
            "debug_hint": "If you see this, the [DEVELOPMENT BYPASS] is currently OFF. Please restart your server if you expected it to be ON."
        }), 401

    id_token = auth_header.split(' ')[1]
    try:
        # Verify the token
        decoded_token = firebase_auth.verify_id_token(id_token)
        
        # [DEVELOPMENT MODE] Grant admin access automatically if enabled
        if Config.DEVELOPMENT_MODE:
            # print("🔓 [Admin Bypass] Granted privileges via DEVELOPMENT_MODE")
            decoded_token["admin"] = True
        else:
            # Check if the user is an admin via UID list
            decoded_token["admin"] = decoded_token.get("uid") in ADMIN_UIDS
        
        request.user = decoded_token
        return None
    except Exception as e:
        return jsonify({"error": "Invalid or expired token", "details": str(e)}), 401
