from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from models.user import User, RoleEnum
from models.job import Job
from models.external import ExternalJob
from schemas.user import UserResponse
from auth.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_jobseekers = db.query(func.count(User.id)).filter(User.role == RoleEnum.jobseeker).scalar() or 0
    total_employers = db.query(func.count(User.id)).filter(User.role == RoleEnum.employer).scalar() or 0
    
    total_internal_jobs = db.query(func.count(Job.id)).scalar() or 0
    total_external_jobs = db.query(func.count(ExternalJob.id)).scalar() or 0
    
    return {
        "users": {
            "total": total_users,
            "jobseekers": total_jobseekers,
            "employers": total_employers,
        },
        "jobs": {
            "internal": total_internal_jobs,
            "external": total_external_jobs,
        }
    }

@router.get("/users", response_model=List[UserResponse])
def get_recent_users(limit: int = 50, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
    return users

@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
    if user_to_delete.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    db.delete(user_to_delete)
    db.commit()
    return {"message": f"User {user_to_delete.name} deleted successfully"}

@router.delete("/jobs/{job_id}", status_code=status.HTTP_200_OK)
def delete_admin_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    job_to_delete = db.query(Job).filter(Job.id == job_id).first()
    if not job_to_delete:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job_to_delete)
    db.commit()
    return {"message": f"Job {job_to_delete.title} deleted successfully"}

from pydantic import BaseModel
class JobStatusUpdate(BaseModel):
    is_active: bool

@router.patch("/jobs/{job_id}/status", status_code=status.HTTP_200_OK)
def update_admin_job_status(job_id: int, payload: JobStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    job_to_update = db.query(Job).filter(Job.id == job_id).first()
    if not job_to_update:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_to_update.is_active = payload.is_active
    db.commit()
    db.refresh(job_to_update)
    return job_to_update
