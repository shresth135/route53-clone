from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    type = Column(String, default="Public")
    created_at = Column(DateTime, default=datetime.utcnow)

    records = relationship("DnsRecord", back_populates="zone", cascade="all, delete-orphan")

class DnsRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("hosted_zones.id"))
    name = Column(String, index=True)
    record_type = Column(String, index=True)
    value = Column(String)
    ttl = Column(Integer, default=300)

    zone = relationship("HostedZone", back_populates="records")