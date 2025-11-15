# firebase_config.py
import os
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore


def _service_account_path() -> Optional[Path]:
    # 1) explicit env var -> must exist
    env_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if env_path:
        p = Path(env_path)
        if p.exists():
            return p

    # 2) known filenames in this folder
    candidates = [
        "firebase_collabothon_config.json",
        "collabothon2025-f1484-firebase-adminsdk-fbsvc-58f38799f0.json",
        "serviceAccountKey.json",
    ]
    folder = Path(__file__).parent
    for name in candidates:
        p = folder / name
        if p.exists():
            return p

    # 3) last-resort: any single .json in this folder
    json_files = list(folder.glob("*.json"))
    if len(json_files) == 1:
        return json_files[0]

    return None


def get_firestore_client():
    """
    Initialize firebase_admin using a service-account JSON (preferred).
    If not found, raise a clear RuntimeError with instructions.
    Returns a Firestore client (firebase_admin.firestore.client()).
    """
    sa_path = _service_account_path()

    if sa_path:
        cred = credentials.Certificate(str(sa_path))
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        return firestore.client()

    # Helpful error instead of letting google.auth raise DefaultCredentialsError
    raise RuntimeError(
        "Firebase credentials not found. Provide a service-account JSON by either:\n"
        "  - setting the environment variable GOOGLE_APPLICATION_CREDENTIALS to the JSON path, or\n"
        "  - placing the service account JSON into services/gemini_summarizer/ with one of these names:\n"
        "    firebase_collabothon_config.json, collabothon2025-...json, or serviceAccountKey.json\n"
        "Then rerun the command. Example (PowerShell):\n"
        r"  $env:GOOGLE_APPLICATION_CREDENTIALS='C:\\path\\to\\service-account.json'\n"
    )


# Backwards-compatible alias used in some scripts
def init_firebase():
    return get_firestore_client()
