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

def update_zone(db: Session, zone_id: int, zone_data: schemas.HostedZoneCreate):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if db_zone:
        db_zone.name = zone_data.name
        db_zone.description = zone_data.description
        db_zone.type = zone_data.type
        db.commit()
        db.refresh(db_zone)
    return db_zone

def delete_zone(db: Session, zone_id: int):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if db_zone:
        db.delete(db_zone)
        db.commit()
        return True
    return False


# DNS Records


def get_records_by_zone(db: Session, zone_id: int):
    return db.query(models.DnsRecord).filter(models.DnsRecord.zone_id == zone_id).all()

def create_record(db: Session, record: schemas.DnsRecordCreate, zone_id: int):
    db_record = models.DnsRecord(**record.model_dump(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_record(db: Session, record_id: int, record_data: schemas.DnsRecordCreate):
    db_record = db.query(models.DnsRecord).filter(models.DnsRecord.id == record_id).first()
    if db_record:
        # Update standard DNS fields
        db_record.name = record_data.name
        
        # FIXED: Using record_type instead of type
        db_record.record_type = record_data.record_type 
        
        db_record.value = record_data.value
        
        if hasattr(record_data, 'ttl'):
            db_record.ttl = record_data.ttl
        
        db.commit()
        db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: int):
    db_record = db.query(models.DnsRecord).filter(models.DnsRecord.id == record_id).first()
    if db_record:
        db.delete(db_record)
        db.commit()
        return True
    return False