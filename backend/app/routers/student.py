from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/student",
    tags=["student"]
)

@router.get("/profile", response_model=schemas.StudentDetail)
def get_my_profile(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can access this")
    
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.get("/feedback", response_model=List[schemas.Feedback])
def get_my_feedback(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can access this")
    
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    return db.query(models.Feedback).filter(models.Feedback.student_id == student.id).all()

# Todo CRUD
@router.get("/todos", response_model=List[schemas.Todo])
def get_todos(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    return db.query(models.Todo).filter(models.Todo.student_id == student.id).all()

@router.post("/todos", response_model=schemas.Todo)
def add_todo(
    todo_in: schemas.TodoCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    new_todo = models.Todo(
        student_id=student.id,
        task_name=todo_in.task_name,
        priority=todo_in.priority,
        due_date=datetime.strptime(todo_in.due_date, "%Y-%m-%d") if todo_in.due_date else None
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.patch("/todos/{todo_id}")
def toggle_todo(
    todo_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.is_completed = not todo.is_completed
    db.commit()
    return {"message": "Toggled", "is_completed": todo.is_completed}

# Study Plan
@router.get("/study-plan", response_model=List[schemas.StudyPlan])
def get_study_plan(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    plan = db.query(models.StudyPlan).filter(models.StudyPlan.student_id == student.id).all()
    if not plan:
        # Generate a default 60-day plan if empty (Mock topics)
        topics = ["Data Structures", "Algorithms", "System Design", "Database Management", "Networking", "OS Fundamentals"]
        for i in range(1, 61):
            new_task = models.StudyPlan(
                student_id=student.id,
                day_number=i,
                topic=f"Study: {topics[(i-1)//10]}"
            )
            db.add(new_task)
        db.commit()
        plan = db.query(models.StudyPlan).filter(models.StudyPlan.student_id == student.id).all()
    return plan
