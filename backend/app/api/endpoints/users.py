from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.api.deps import get_current_active_user, get_current_active_admin, get_current_active_manager, get_db
from app.models.user import User, RoleEnum
from app.schemas.user import UserResponse
from pydantic import BaseModel

router = APIRouter()

class UserRoleUpdate(BaseModel):
    role: RoleEnum

class UserStatusUpdate(BaseModel):
    is_active: bool
    is_locked: bool

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/admin/data")
def read_admin_data(
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get admin-specific dashboard data and all users.
    """
    users = db.query(User).all()
    
    total_users = len(users)
    active_users = sum(1 for u in users if u.is_active)
    locked_users = sum(1 for u in users if u.is_locked)
    managers = sum(1 for u in users if u.role == RoleEnum.manager)
    employees = sum(1 for u in users if u.role == RoleEnum.employee)
    admins = sum(1 for u in users if u.role == RoleEnum.admin)
    
    return {
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "locked_users": locked_users,
            "admins": admins,
            "managers": managers,
            "employees": employees,
            "db_status": "Healthy",
            "system_load": "12%"
        },
        "users": [
            {
                "id": u.id,
                "full_name": u.full_name,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "is_locked": u.is_locked,
                "failed_login_attempts": u.failed_login_attempts
            } for u in users
        ]
    }

@router.put("/admin/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
) -> Any:
    """
    Admin-only: update user role.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user

@router.put("/admin/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
) -> Any:
    """
    Admin-only: toggle active status and lock/unlock accounts.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = status_update.is_active
    user.is_locked = status_update.is_locked
    if not status_update.is_locked:
        user.failed_login_attempts = 0 # reset if unlocked
    db.commit()
    db.refresh(user)
    return user

@router.get("/manager/data")
def read_manager_data(
    current_user: User = Depends(get_current_active_manager),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get manager-specific dashboard data and teams list.
    """
    employees = db.query(User).filter(User.role == RoleEnum.employee).all()
    
    return {
        "stats": {
            "assigned_tasks": 24,
            "pending_approvals": 5,
            "team_efficiency": "94%",
            "active_projects": 4
        },
        "team": [
            {
                "id": emp.id,
                "full_name": emp.full_name,
                "email": emp.email,
                "is_active": emp.is_active
            } for emp in employees
        ],
        "pending_expenses": [
            {"id": 1, "employee_name": "Alice Smith", "description": "Cloud Servers Subscription", "amount": 120.50, "status": "Pending"},
            {"id": 2, "employee_name": "Bob Johnson", "description": "Client Dinner meeting", "amount": 75.00, "status": "Pending"},
            {"id": 3, "employee_name": "Alice Smith", "description": "Professional training courses", "amount": 350.00, "status": "Pending"}
        ]
    }

@router.get("/employee/data")
def read_employee_data(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get employee-specific dashboard data and tasks.
    """
    return {
        "stats": {
            "pending_tasks": 3,
            "completed_tasks": 17,
            "hours_logged": 120,
            "reimbursements_approved": "$450.00"
        },
        "tasks": [
            {"id": 1, "title": "Upgrade React routing structures", "description": "Re-engineer react-router architecture for RBAC", "priority": "High", "status": "In Progress"},
            {"id": 2, "title": "Add visual canvas CAPTCHA", "description": "Prevent automated logins via beautiful client-side distortion canvas", "priority": "Medium", "status": "To Do"},
            {"id": 3, "title": "Configure SQLite and postgress connections", "description": "Validate migration scripts are compatible", "priority": "Low", "status": "Completed"}
        ],
        "expenses": [
            {"id": 1, "description": "MacBook charger replacement", "amount": 79.00, "status": "Approved"},
            {"id": 2, "description": "AWS Dev environment hosting", "amount": 45.00, "status": "Pending"}
        ]
    }
