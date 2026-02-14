from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum

class UserRole(str, Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class User(UserBase):
    full_name: Optional[str] = None
    institutional_email: Optional[str] = None
    plain_password: Optional[str] = None

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    department: Optional[str] = None
    year: Optional[int] = None
    previous_school: Optional[str] = None

class StudentCreate(StudentBase):
    full_name: str
    personal_email: EmailStr
    dob: str
    blood_group: str
    parent_phone: str
    personal_phone: str
    password: str
    current_cgpa: Optional[float] = 0.0 # Added to support immediate AI generation

class Student(StudentBase):
    id: str
    user_id: str
    name: Optional[str] = None
    roll_number: Optional[str] = None
    dob: Optional[str] = None
    blood_group: Optional[str] = None
    parent_phone: Optional[str] = None
    personal_phone: Optional[str] = None
    personal_email: Optional[str] = None
    previous_school: Optional[str] = None
    current_cgpa: float
    academic_dna_score: float
    growth_index: float
    risk_level: str
    career_readiness_score: float

    class Config:
        from_attributes = True

class AcademicRecordBase(BaseModel):
    semester: int
    subject: str
    internal_marks: float
    external_marks: float
    attendance_percentage: float

class AcademicRecordCreate(AcademicRecordBase):
    pass

class AcademicRecord(AcademicRecordBase):
    id: str
    student_id: str
    grade: Optional[str] = None

    class Config:
        from_attributes = True

class AIScoreBase(BaseModel):
    consistency_index: float
    performance_volatility: float
    cgpa_prediction: float
    risk_probability: float
    skill_gap_score: float
    career_suggestions: Optional[str] = None
    recommended_courses: Optional[str] = None

class AIScore(AIScoreBase):
    student_id: str

    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    student_id: str
    q1_technical_clarity: float = 0.0
    q2_problem_solving: float = 0.0
    q3_code_efficiency: float = 0.0
    q4_algorithm_knowledge: float = 0.0
    q5_debugging_skills: float = 0.0
    q6_concept_application: float = 0.0
    q7_mathematical_aptitude: float = 0.0
    q8_system_design: float = 0.0
    q9_documentation_quality: float = 0.0
    q10_test_coverage_awareness: float = 0.0
    q11_presentation_skills: float = 0.0
    q12_collaborative_spirit: float = 0.0
    q13_adaptability: float = 0.0
    q14_curiosity_level: float = 0.0
    q15_deadline_discipline: float = 0.0
    q16_resourcefulness: float = 0.0
    q17_critical_thinking: float = 0.0
    q18_puncuality: float = 0.0
    q19_peer_mentoring: float = 0.0
    q20_leadership_potential: float = 0.0
    q21_ethical_awareness: float = 0.0
    q22_feedback_receptivity: float = 0.0
    q23_passion_for_field: float = 0.0
    q24_originality_of_ideas: float = 0.0
    q25_consistency_index: float = 0.0
    detailed_remarks: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: str
    faculty_id: str
    overall_rating: float
    created_at: str # will be converted from datetime

    class Config:
        from_attributes = True

class TodoBase(BaseModel):
    task_name: str
    priority: str = "Medium"
    due_date: Optional[str] = None # YYYY-MM-DD

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: str
    is_completed: bool
    created_at: str

    class Config:
        from_attributes = True

class StudyPlanBase(BaseModel):
    day_number: int
    topic: str
    sub_tasks: Optional[str] = None

class StudyPlan(StudyPlanBase):
    id: str
    is_completed: bool
    actual_date: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class StudentDetail(Student):
    user: User
    academic_records: List[AcademicRecord] = []
    ai_scores: Optional[AIScore] = None
    feedback: List[Feedback] = []

class StaffBase(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    be_degree: Optional[str] = None
    be_college: Optional[str] = None
    me_degree: Optional[str] = None
    me_college: Optional[str] = None
    primary_skill: Optional[str] = None
    projects_completed: int = 0
    publications_count: int = 0
    consistency_score: float = 0.0
    student_feedback_rating: float = 0.0
    personal_email: Optional[str] = None
    personal_phone: Optional[str] = None

class StaffCreate(StaffBase):
    full_name: str
    personal_email: EmailStr
    password: str
    staff_id: Optional[str] = None # Allow manual override

class Staff(StaffBase):
    id: str
    user_id: str
    staff_id: Optional[str] = None
    name: Optional[str] = None

    class Config:
        from_attributes = True


class StaffDetail(Staff):
    user: User

# --- Advanced Dashboard Analytics ---

class InstitutionalStats(BaseModel):
    total_students: int
    active_students: int
    placement_readiness_avg: float
    dna_score: float
    risk_ratio: float
    avg_growth_index: float

class EarlyWarningStats(BaseModel):
    high_risk_count: int
    medium_risk_count: int
    low_risk_percent: float
    dropout_probability_next_6m: float

class PerformanceCluster(BaseModel):
    name: str # High Achievers, Stable Performers, etc.
    count: int
    percentage: float
    description: str

class DeptPerformanceRank(BaseModel):
    department: str
    avg_cgpa: float
    avg_growth: float
    placement_readiness: float
    skill_score: float
    risk_percent: float
    overall_rank: int

class PlacementForecast(BaseModel):
    forecast_placement_percent: float
    core_vs_it_ratio: str
    avg_career_readiness: float
    skill_gap_avg: float

class FacultyImpactRank(BaseModel):
    name: str
    dept: str
    feedback_consistency: float
    improvement_impact: float
    impact_score: float

class ResourceOptimization(BaseModel):
    faculty_load_percent: float
    lab_utilization_percent: float
    remedial_need_percent: float
    coaching_demand: str

class ActionPlanStrategy(BaseModel):
    label: str
    detail: str

class ActionPlanStep(BaseModel):
    title: str
    detail: str

class DynamicActionPlan(BaseModel):
    executive_summary: str
    roi_efficiency: str
    strategies: List[ActionPlanStrategy]
    resource_label: str
    resource_value: str
    roadmap: List[ActionPlanStep]
    insight_quote: str

class DashboardOverview(BaseModel):
    institutional: InstitutionalStats
    early_warning: EarlyWarningStats
    performance_clusters: List[PerformanceCluster]
    department_ranking: List[DeptPerformanceRank]
    placement_forecast: PlacementForecast
    faculty_impact: List[FacultyImpactRank]
    resource_opt: ResourceOptimization
    weekly_insight: str
    action_plan: DynamicActionPlan
