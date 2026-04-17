from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from config import Config

bp = Blueprint('auth', __name__)

def normalize_private_key(key):
    if not key:
        return ""
    # Remove quotes and whitespace
    key = key.strip().strip('"').strip("'")
    
    # If it's already a full PEM key, just handle newlines
    if "-----BEGIN PRIVATE KEY-----" in key:
        return key.replace("\\n", "\n")
        
    # If it's just the base64 part, wrap it
    # First, handle any internal escaped newlines
    key = key.replace("\\n", "\n")
    
    # Wrap in PEM headers
    return f"-----BEGIN PRIVATE KEY-----\n{key}\n-----END PRIVATE KEY-----"

# 🔥 Initialize Firebase only once
def init_firebase():
    if not firebase_admin._apps:
        try:
            private_key = normalize_private_key(Config.FIREBASE_PRIVATE_KEY)
            
            if not Config.FIREBASE_PROJECT_ID or not private_key or not Config.FIREBASE_CLIENT_EMAIL:
                raise ValueError("Missing required Firebase configuration in environment variables.")

            cred_dict = {
                "type": "service_account",
                "project_id": Config.FIREBASE_PROJECT_ID,
                "private_key": private_key,
                "client_email": Config.FIREBASE_CLIENT_EMAIL,
                "client_id": "", # Optional for firebase-admin
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{Config.FIREBASE_CLIENT_EMAIL or ''}"
            }
            
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("[auth] Firebase initialized successfully")
        except Exception as e:
            print(f"[auth] Firebase initialization failed: {e}")
            # Fallback to default initialization (may fail if no GOOGLE_APPLICATION_CREDENTIALS)
            try:
                firebase_admin.initialize_app()
                print("[auth] Firebase initialized with default credentials")
            except Exception as e2:
                print(f"[auth] Critical: Firebase could not be initialized: {e2}")

# Call initialization
init_firebase()


# ✅ Test route (no auth required)
@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        "message": "Auth route working",
        "firebase_status": "Ready" if firebase_admin._apps else "Not Initialized"
    })

# ✅ Protected route example
@bp.route('/me', methods=['GET'])
def get_current_user():
    if not hasattr(request, 'user'):
        return jsonify({"error": "User not authenticated"}), 401
        
    return jsonify({
        "message": "User authenticated",
        "uid": request.user.get("uid"),
        "email": request.user.get("email")
    })