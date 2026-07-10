from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# DNS Record Schemas
class DnsRecordBase(BaseModel):
    name: str
    record_type: str
    value: str
    ttl: int = 300

class DnsRecordCreate(DnsRecordBase):
    pass

class DnsRecordResponse(DnsRecordBase):
    id: int
    zone_id: int
    class Config:
        from_attributes = True

# Hosted Zone Schemas
class HostedZoneBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "Public"

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZoneResponse(HostedZoneBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True