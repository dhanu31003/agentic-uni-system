# modules/result_processor/main.py
import os
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from dotenv import load_dotenv
import pandas as pd
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "agentic-uni-system")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="Result Processor")

@app.post("/process/")
async def process_results(subject: str = Form(...), file: UploadFile = File(...)):
    # save upload to temp
    suffix = os.path.splitext(file.filename)[1]
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(await file.read())
    tmp.close()

    try:
        df = pd.read_excel(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Excel parse error: {e}")

    # Expect columns: studentId, marks
    if 'studentId' not in df.columns or 'marks' not in df.columns:
        raise HTTPException(
          status_code=400,
          detail="Excel must contain 'studentId' and 'marks' columns"
        )

    count = 0
    for _, row in df.iterrows():
        sid   = str(row['studentId']).strip()
        marks = float(row['marks'])
        db.subject_results.update_one(
            {"studentId": sid, "subject": subject},
            {"$set": {"marks": marks}},
            upsert=True
        )
        count += 1

    return {"processed": count, "subject": subject}

@app.get("/aggregate/all")
def aggregate_all():
    sids = db.subject_results.distinct("studentId")
    output = []
    for sid in sids:
        try:
            rec = aggregate_student(sid)
            output.append(rec)
        except HTTPException:
            continue
    return output


@app.get("/aggregate/{studentId}")
def aggregate_student(studentId: str):
    pipeline = [
        {"$match": {"studentId": studentId}},
        {"$group": {
            "_id": "$studentId",
            "subjects": {"$push": {"subject": "$subject", "marks": "$marks"}},
            "total": {"$sum": "$marks"}
        }}
    ]
    data = list(db.subject_results.aggregate(pipeline))
    if not data:
        raise HTTPException(status_code=404, detail="No results for student")
    rec = data[0]
    rec["average"] = rec["total"] / len(rec["subjects"])
    return rec



