from sqlalchemy.orm import Session
from app.db import models
from app.schemas import schemas

# Hosted Zones
def get_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.HostedZone).offset(skip).limit(limit).all()

def create_zone(db: Session, zone: schemas.HostedZoneCreate):
    db_zone = models.HostedZone(**zone.model_dump())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

# DNS Records
def get_records_by_zone(db: Session, zone_id: int):
    return db.query(models.DnsRecord).filter(models.DnsRecord.zone_id == zone_id).all()

def create_record(db: Session, record: schemas.DnsRecordCreate, zone_id: int):
    db_record = models.DnsRecord(**record.model_dump(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record
def delete_zone(db: Session, zone_id: int):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if db_zone:
        db.delete(db_zone)
        db.commit()
        return True
    return False

def delete_record(db: Session, record_id: int):
    db_record = db.query(models.DnsRecord).filter(models.DnsRecord.id == record_id).first()
    if db_record:
        db.delete(db_record)
        db.commit()
        return True
    return False