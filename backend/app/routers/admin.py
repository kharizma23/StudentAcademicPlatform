from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
import random
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from typing import List, Optional
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

# --- Helper: AI Insight Generator ---
import json
def _generate_ai_insights(student, db: Session):
    # Deterministic randomness based on student ID
    seed = int(student.id.encode().hex(), 16) % 10000
    random.seed(seed)
    
    # 1. Career Compass Logic
    dept_careers = {
        "CSE": ["Software Architect", "Data Scientist", "Full Stack Developer", "AI Engineer", "Cybersecurity Analyst"],
        "ECE": ["Embedded Systems Engineer", "VLSI Design Engineer", "IoT Specialist", "Network Engineer"],
        "MECH": ["Robotics Engineer", "Automotive Designer", "Supply Chain Analyst", "Thermal Engineer"],
        "EEE": ["Power Systems Engineer", "Control Systems Lead", "Renewable Energy Consultant"],
        "CIVIL": ["Structural Engineer", "Urban Planner", "Construction Manager"]
    }
    
    possible_roles = dept_careers.get(student.department, dept_careers.get("CSE")) or []
    if not possible_roles: possible_roles = ["Software Engineer"] # Fallback
    selected_roles = random.sample(possible_roles, min(3, len(possible_roles)))
    
    career_compass = []
    base_match = int(student.current_cgpa * 8) + 10 # Base match % based on CGPA
    
    for role in selected_roles:
        match = min(98, base_match + random.randint(-5, 10))
        career_compass.append({
            "role": role,
            "fit": f"{match}% Match",
            "icon": random.choice(["🚀", "📊", "🧠", "🔧", "⚡", "🏗️"])
        })
        
    # 2. Learning Analytics Logic
    dept_subjects = {
        "CSE": ["Data Structures", "Algorithms", "OS", "DBMS", "Networks", "AI", "Compiler Design"],
        "ECE": ["Circuits", "Digital Electronics", "Signals & Systems", "Microprocessors", "Communication"],
        "MECH": ["Thermodynamics", "Fluid Mechanics", "Kinematics", "Manufacturing", "CAD/CAM"],
        "EEE": ["Circuit Theory", "Machines", "Power Systems", "Control Systems", "Analog Electronics"],
        "CIVIL": ["Mechanics", "Structures", "Surveying", "Geotech", "Hydraulics"]
    }
    
    subjects = dept_subjects.get(student.department, dept_subjects.get("CSE")) or []
    random.shuffle(subjects)
    
    strong = subjects[:3]
    weak = subjects[3:5]
    
    ai_data = {
        "career_suggestions": json.dumps(career_compass),
        "recommended_courses": json.dumps({"strong": strong, "weak": weak})
    }

    if not student.ai_scores:
        student.ai_scores = models.AIScore(
            student_id=student.id,
            consistency_index=round(float(random.uniform(0.6, 0.95)), 2),
            skill_gap_score=round(float(random.uniform(10, 40)), 1),
            career_suggestions=ai_data["career_suggestions"],
            recommended_courses=ai_data["recommended_courses"]
        )
        db.add(student.ai_scores)
    else:
        # Populate missing data for existing records
        if not student.ai_scores.career_suggestions:
            student.ai_scores.career_suggestions = ai_data["career_suggestions"]
        if not student.ai_scores.recommended_courses:
            student.ai_scores.recommended_courses = ai_data["recommended_courses"]
    
    db.commit()
    
    return student

def _generate_dynamic_action_plan(stats: schemas.InstitutionalStats, df: pd.DataFrame):
    # Logic to vary the plan based on stats
    high_risk_ratio = stats.risk_ratio > 15
    low_dna = stats.dna_score < 75
    
    strategies = []
    if high_risk_ratio:
        strategies.append(schemas.ActionPlanStrategy(label="Intensive Care Unit (ICU)", detail="Daily 1:1 check-ins for students in the 'Critical Zone' cluster."))
    else:
        strategies.append(schemas.ActionPlanStrategy(label="Proactive Mentorship", detail="Bi-weekly peer-led workshops for underperforming students."))
        
    if low_dna:
        strategies.append(schemas.ActionPlanStrategy(label="Skill DNA Reconstruction", detail="Revised curriculum focus on fundamental engineering principles."))
    else:
        strategies.append(schemas.ActionPlanStrategy(label="Advanced Honors Track", detail="Integrate industry-level certifications for 'High Achiever' clusters."))

    strategies.append(schemas.ActionPlanStrategy(label="Digital Lab Expansion", detail="Upgrade 30% of existing labs with specialized AI/ML server nodes."))

    # Roadmap
    roadmap = [
        schemas.ActionPlanStep(title="Phase 1: Target", detail=f"Identify the top {min(50, stats.total_students)} at-risk students for immediate counseling."),
        schemas.ActionPlanStep(title="Phase 2: Deploy", detail="Launch the new dynamic learning portal for autonomous progress tracking."),
        schemas.ActionPlanStep(title="Phase 3: Verify", detail="Assess improvement index after the mid-semester evaluation cycle.")
    ]

    # Quote depends on something
    quote = f"With a Growth Index of {stats.avg_growth_index}, we have a strong foundation to increase institutional ROI by targeting the current {stats.risk_ratio}% risk gap."

    return schemas.DynamicActionPlan(
        executive_summary="Closing the Skill Gap & Improving DNA Score",
        roi_efficiency=f"+{int(25 - stats.risk_ratio/2)}%",
        strategies=strategies,
        resource_label="Digital Infrastructure",
        resource_value=f"₹ {round(float(stats.total_students * 0.15), 1)}L",
        roadmap=roadmap,
        insight_quote=quote
    )

@router.get("/overview", response_model=schemas.DashboardOverview)
def get_dashboard_overview(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    # 1. Fetch Basic Data
    students = db.query(models.Student).all()
    total_students = len(students)
    if total_students == 0:
        return {} # Handle empty DB
        
    df = pd.DataFrame([
        {
            "id": s.id,
            "cgpa": s.current_cgpa,
            "growth": s.growth_index,
            "skill": s.academic_dna_score, # Using dna score as skill depth for formula
            "readiness": s.career_readiness_score,
            "risk": 1 if s.risk_level == "High" else (0.5 if s.risk_level == "Medium" else 0.1),
            "dept": s.department
        } for s in students
    ])

    # 2. Institutional Stats & DNA Score
    avg_cgpa = df['cgpa'].mean()
    avg_growth = df['growth'].mean()
    avg_skill = df['skill'].mean()
    avg_readiness = df['readiness'].mean()
    avg_risk_stability = 1 - df['risk'].mean()

    # Formula: (0.30 * CGPA/10 * 100) + (0.20 * Growth/5 * 100) + (0.20 * Skill) + (0.15 * Readiness) + (0.15 * Risk Stability * 100)
    # Mapping to 0-100 scale
    dna_score = (
        (0.30 * (avg_cgpa / 10) * 100) +
        (0.20 * (avg_growth / 5) * 100) +
        (0.20 * avg_skill) +
        (0.15 * avg_readiness) +
        (0.15 * avg_risk_stability * 100)
    )

    inst_stats = schemas.InstitutionalStats(
        total_students=total_students,
        active_students=total_students, # Logic for "active" can be refined later
        placement_readiness_avg=round(float(avg_readiness), 2),
        dna_score=round(float(dna_score), 2),
        risk_ratio=round(float(df['risk'].mean() * 100), 2),
        avg_growth_index=round(float(avg_growth), 2)
    )

    # 3. Early Warning Stats
    high_risk = len(df[df['risk'] == 1])
    med_risk = len(df[df['risk'] == 0.5])
    
    early_warning = schemas.EarlyWarningStats(
        high_risk_count=high_risk,
        medium_risk_count=med_risk,
        low_risk_percent=round(float((total_students - high_risk - med_risk) / total_students * 100), 2),
        dropout_probability_next_6m=round(float((high_risk / total_students * 0.8 + med_risk / total_students * 0.3) * 100), 2)
    )

    # 4. KMeans Clustering
    X = df[['cgpa', 'growth', 'skill']].values
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10).fit(X)
    df['cluster'] = kmeans.labels_
    
    cluster_names = ["High Achievers", "Stable Performers", "Improving Students", "Critical Zone"]
    # Sort cluster names based on avg CGPA of cluster to ensure mapping is somewhat consistent
    cluster_centers = kmeans.cluster_centers_
    # Simple heuristic: Higher sum of centers = better cluster
    rank_idx = np.argsort(np.sum(cluster_centers, axis=1))[::-1]
    
    perf_clusters = []
    for i, real_idx in enumerate(rank_idx):
        count = len(df[df['cluster'] == real_idx])
        perf_clusters.append(schemas.PerformanceCluster(
            name=cluster_names[i],
            count=count,
            percentage=round(float(count / total_students * 100), 2),
            description=f"Group with average CGPA of {round(float(cluster_centers[real_idx][0]),2)}"
        ))

    # 5. Department Ranking
    dept_stats = df.groupby('dept').agg({
        'cgpa': 'mean',
        'growth': 'mean',
        'readiness': 'mean',
        'skill': 'mean',
        'risk': lambda x: (x == 1).astype(int).sum() / len(x) * 100
    }).reset_index()
    
    # Calculate a composite score for ranking
    dept_stats['composite'] = (dept_stats['cgpa'] * 2 + dept_stats['growth'] * 10 + dept_stats['readiness']).rank(ascending=False)
    
    dept_ranking = [
        schemas.DeptPerformanceRank(
            department=row['dept'],
            avg_cgpa=round(float(row['cgpa']), 2),
            avg_growth=round(float(row['growth']), 2),
            placement_readiness=round(float(row['readiness']), 2),
            skill_score=round(float(row['skill']), 2),
            risk_percent=round(float(row['risk']), 2),
            overall_rank=int(row['composite'])
        ) for _, row in dept_stats.sort_values('composite').iterrows()
    ]

    # 6. Placement Forecast
    forecast = schemas.PlacementForecast(
        forecast_placement_percent=round(float(avg_readiness * 0.9 + 5), 2), # Simple heuristic
        core_vs_it_ratio="45:55",
        avg_career_readiness=round(float(avg_readiness), 2),
        skill_gap_avg=round(float(100 - avg_skill), 2)
    )

    # 7. Faculty Impact & Resource Opt
    staff = db.query(models.Staff).limit(5).all()
    faculty_impact = [
        schemas.FacultyImpactRank(
            name=s.user.full_name if s.user else "Faculty",
            dept=s.department,
            feedback_consistency=round(float(s.consistency_score * 100), 2),
            improvement_impact=round(float(random.uniform(70, 95)), 2),
            impact_score=round(float(s.consistency_score * 40 + s.student_feedback_rating * 12), 2)
        ) for s in staff
    ]

    resource_opt = schemas.ResourceOptimization(
        faculty_load_percent=round(float(random.uniform(65, 85)), 2),
        lab_utilization_percent=round(float(random.uniform(70, 90)), 2),
        remedial_need_percent=round(float(early_warning.dropout_probability_next_6m * 1.5), 2),
        coaching_demand="High for Mathematics and ML"
    )

    # 8. Weekly Insight
    best_dept = dept_ranking[0].department if dept_ranking else "N/A"
    worst_dept = dept_ranking[-1].department if dept_ranking else "N/A"
    weekly_insight = f"{best_dept} department shows strong placement readiness but {worst_dept} requires focused remedial intervention in Core Engineering subjects."

    # 9. Dynamic Action Plan
    action_plan = _generate_dynamic_action_plan(inst_stats, df)

    return schemas.DashboardOverview(
        institutional=inst_stats,
        early_warning=early_warning,
        performance_clusters=perf_clusters,
        department_ranking=dept_ranking,
        placement_forecast=forecast,
        faculty_impact=faculty_impact,
        resource_opt=resource_opt,
        weekly_insight=weekly_insight,
        action_plan=action_plan
    )

@router.get("/stats")
def get_admin_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    total_students = db.query(models.Student).count()
    # Assuming total strength is the same or some fixed number for now, or just total users
    total_strength = db.query(models.User).count()
    
    return {
        "total_strength": total_strength,
        "total_students": total_students
    }

@router.get("/students", response_model=List[schemas.Student])
def get_students(
    department: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    query = db.query(models.Student).join(models.User)
    
    if department:
        query = query.filter(models.Student.department == department)
    if year:
        query = query.filter(models.Student.year == year)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.User.full_name.ilike(search_term)) | 
            (models.Student.roll_number.ilike(search_term)) |
            (models.User.email.ilike(search_term))
        )
        
    return query.all()

@router.get("/students/{student_id}", response_model=schemas.StudentDetail)
def get_student_detail(
    student_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
        
    # --- Dynamic AI Insight Generation (Unique per student) ---
    _generate_ai_insights(student, db)

    return student

@router.delete("/students/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
        
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
        
    # Delete User accounts associated
    db.query(models.User).filter(models.User.id == student.user_id).delete()
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

@router.delete("/staff/{staff_id}")
def delete_staff(
    staff_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
        
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        return {"error": "Staff not found"}
        
    db.query(models.User).filter(models.User.id == staff.user_id).delete()
    db.delete(staff)
    db.commit()
    return {"message": "Staff deleted successfully"}

@router.get("/staff", response_model=List[schemas.Staff])
def get_staff(
    department: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    query = db.query(models.Staff).join(models.User)
    if department:
        query = query.filter(models.Staff.department == department)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.User.full_name.ilike(search_term)) | 
            (models.User.email.ilike(search_term))
        )
        
    return query.all()

@router.get("/staff/{staff_id}", response_model=schemas.StaffDetail)
def get_staff_detail(
    staff_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        return {"error": "Staff not found"}
        
    return staff

@router.post("/students", response_model=schemas.Student)
def create_student(
    student_in: schemas.StudentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    # 1. Generate Institutional Email: firstname.deptbatch@gmail.com
    batch = {1: "25", 2: "24", 3: "23", 4: "22"}.get(student_in.year, "25")
    name_parts = student_in.full_name.strip().split()
    first_name = name_parts[0].lower()
    dept_code = student_in.department.lower()
    
    base_email = f"{first_name}.{dept_code}{batch}@gmail.com"
    
    # Collision check
    existing = db.query(models.User).filter(models.User.institutional_email == base_email).first()
    if existing and len(name_parts) > 1:
        # Try with initial: firstnameinitial.deptbatch@gmail.com
        initial = name_parts[-1][0].lower()
        base_email = f"{first_name}{initial}.{dept_code}{batch}@gmail.com"
    
    # Further collision check (fallback to random if still exists)
    existing_again = db.query(models.User).filter(models.User.institutional_email == base_email).first()
    if existing_again:
        base_email = f"{first_name}{random.randint(10, 99)}.{dept_code}{batch}@gmail.com"

    # 2. Generate Roll Number
    roll_number = f"7376{batch}{student_in.department.upper()}{student_in.year}{random.randint(100, 999)}"

    # 3. Create User
    # Use institutional email as the primary login email as requested
    unique_password = f"{student_in.full_name.split()[0]}@{roll_number[-4:]}#"
    
    new_user = models.User(
        email=base_email, # This is the institutional email
        full_name=student_in.full_name,
        hashed_password=auth.get_password_hash(unique_password),
        plain_password=unique_password,
        role=models.UserRole.STUDENT,
        institutional_email=base_email
    )
    db.add(new_user)
    db.flush()

    # 4. Create Student Profile
    new_student = models.Student(
        user_id=new_user.id,
        roll_number=roll_number,
        department=student_in.department,
        year=student_in.year,
        dob=student_in.dob,
        blood_group=student_in.blood_group,
        parent_phone=student_in.parent_phone,
        personal_phone=student_in.personal_phone,
        personal_email=student_in.personal_email,
        previous_school=student_in.previous_school,
        current_cgpa=student_in.current_cgpa, # Use provided CGPA
        academic_dna_score=0.0,
        growth_index=0.0,
        risk_level="Low",
        career_readiness_score=0.0
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # 5. Generate Initial AI Profile
    _generate_ai_insights(new_student, db)
    
    return new_student

@router.post("/staff", response_model=schemas.Staff)
def create_staff(
    staff_in: schemas.StaffCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != models.UserRole.ADMIN:
        return {"error": "Unauthorized"}
    
    # 1. Generate Institutional Email
    name_parts = staff_in.full_name.strip().split()
    first_name = name_parts[0].lower()
    random_id = random.randint(100, 999)
    inst_email = f"{first_name}{staff_in.department.lower()}{random_id}@gmail.com"

    # 2. Create User
    new_user = models.User(
        email=staff_in.personal_email,
        full_name=staff_in.full_name,
        hashed_password=auth.get_password_hash(staff_in.password),
        role=models.UserRole.FACULTY,
        institutional_email=inst_email
    )
    db.add(new_user)
    db.flush()

    # 3. Create Staff Profile
    new_staff = models.Staff(
        user_id=new_user.id,
        staff_id=staff_in.staff_id if staff_in.staff_id else f"STF{staff_in.department}{random_id}",
        department=staff_in.department,
        designation=staff_in.designation,
        be_degree=staff_in.be_degree,
        be_college=staff_in.be_college,
        me_degree=staff_in.me_degree,
        me_college=staff_in.me_college,
        primary_skill=staff_in.primary_skill,
        personal_email=staff_in.personal_email,
        personal_phone=staff_in.personal_phone
    )
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff
