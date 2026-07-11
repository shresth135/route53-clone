from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.db.database import get_db
from app.schemas import schemas
from app.crud import crud

router = APIRouter()

# Mock Authentication
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/auth/login")
async def login(request: Request, credentials: LoginRequest):
    print("DEBUG - Raw request body:", await request.body())
    print("DEBUG - Parsed credentials:", credentials.username, credentials.password)
    
    return {"access_token": "mock-token", "user": credentials.username}

# Zones

@router.post("/zones/", response_model=schemas.HostedZoneResponse)
def create_zone(zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    return crud.create_zone(db=db, zone=zone)

@router.get("/zones/", response_model=List[schemas.HostedZoneResponse])
def read_zones(db: Session = Depends(get_db)):
    return crud.get_zones(db)

@router.put("/zones/{zone_id}", response_model=schemas.HostedZoneResponse)
def update_zone_endpoint(zone_id: int, zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    updated_zone = crud.update_zone(db=db, zone_id=zone_id, zone_data=zone)
    if not updated_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return updated_zone

@router.delete("/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zone_endpoint(zone_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_zone(db, zone_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Zone not found")
    return None


# Records

@router.post("/zones/{zone_id}/records/", response_model=schemas.DnsRecordResponse)
def create_record(zone_id: int, record: schemas.DnsRecordCreate, db: Session = Depends(get_db)):
    return crud.create_record(db=db, record=record, zone_id=zone_id)

@router.get("/zones/{zone_id}/records/", response_model=List[schemas.DnsRecordResponse])
def read_records(zone_id: int, db: Session = Depends(get_db)):
    return crud.get_records_by_zone(db, zone_id=zone_id)

@router.put("/records/{record_id}", response_model=schemas.DnsRecordResponse)
def update_record_endpoint(record_id: int, record: schemas.DnsRecordCreate, db: Session = Depends(get_db)):
    updated_record = crud.update_record(db=db, record_id=record_id, record_data=record)
    if not updated_record:
        raise HTTPException(status_code=404, detail="Record not found")
    return updated_record

@router.delete("/records/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record_endpoint(record_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_record(db, record_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    return None