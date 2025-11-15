# firebase_config.py
import os
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore


def _service_account_path() -> Optional[Path]:
    # Prefer explicit env var, else fall back to the bundled JSON in this folder
    env_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if env_path:
        return Path(env_path)

    local = Path(__file__).parent / "collabothon2025-f1484-firebase-adminsdk-fbsvc-58f38799f0.json"
    if local.exists():
        return local

    return None


def get_firestore_client():
    """
    Initialize firebase_admin using a service-account JSON (preferred) or
    fallback to Application Default Credentials if available.
    Returns a Firestore client (firebase_admin.firestore.client()).
    """
    sa_path = _service_account_path()

    if sa_path:
        cred = credentials.Certificate(str(sa_path))
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
    else:
        # Try ADC / default credentials
        if not firebase_admin._apps:
            # will raise a clear error if ADC are not configured
            firebase_admin.initialize_app()

    return firestore.client()
