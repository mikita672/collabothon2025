import json
from firebase_config import init_firebase

db = init_firebase()

with open("company_confidences.json", "r") as f:
    data = json.load(f)

for ticker, confidence in data.items():
    db.collection("comp").document(ticker).set({"confidence": confidence})
