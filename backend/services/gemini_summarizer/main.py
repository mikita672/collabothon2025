from firebase_config import get_firestore_client


# Получаем клиент
db = get_firestore_client()

# Пример 1: прочитать текущую уверенность по AAPL
doc_ref = db.collection("comp").document("AAPL")
doc = doc_ref.get()

if doc.exists:
    print("AAPL confidence (до):", doc.to_dict().get("confidence"))
else:
    print("Документ не найден")

# Пример 2: обновить значение
doc_ref.update({"confidence": 0.91})
print("AAPL обновлён → 0.91")

# Ещё раз читаем
doc = doc_ref.get()
print("AAPL confidence (после):", doc.to_dict().get("confidence"))
