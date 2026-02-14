from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import users, auth_router, ai, admin, staff, student
from app import models, auth as auth_utils
import random
import string
import logging

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Academic Development Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Seeding is now handled by standalone seed_db.py
    logging.info("Backend started successfully.")

app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(ai.router)
app.include_router(staff.router)
app.include_router(student.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Student Academic Development Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
