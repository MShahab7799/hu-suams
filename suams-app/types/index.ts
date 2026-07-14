// ============================================================
//  Global Type Definitions — SUAMS
// ============================================================

export type UserRole =
  | 'Admin'
  | 'ViceChancellor'
  | 'Registrar'
  | 'Dean'
  | 'Chairman'
  | 'HOD'
  | 'Director'
  | 'Assistant'
  | 'AdmissionOfficer'
  | 'ExaminationOfficer'
  | 'Student'
  | 'Teacher'
  | 'Parent'
  | 'Visitor'
  | 'Alumni';

export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay';

export type AppointmentStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed'
  | 'Rescheduled'
  | 'NoShow';

// ── Serializable User (safe for client) ─────────────────────
export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  universityId?: string | null;
  mobileNumber?: string | null;
  gender?: Gender | null;
  profilePicture?: string | null;
  role: UserRole;
  facultyId?: string | null;
  departmentId?: string | null;
  programId?: string | null;
  semester?: number | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
}

// ── Session ─────────────────────────────────────────────────
export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profilePicture?: string | null;
}

// ── Appointment ──────────────────────────────────────────────
export interface AppointmentWithDetails {
  id: string;
  appointmentNo: string;
  officialId: string;
  bookedById: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  notes?: string | null;
  status: AppointmentStatus;
  rejectionReason?: string | null;
  isUrgent: boolean;
  createdAt: Date;
  official: {
    id: string;
    title: string;
    officeLocation?: string | null;
    user: {
      fullName: string;
      profilePicture?: string | null;
    };
    faculty?: { name: string } | null;
    department?: { name: string } | null;
  };
  bookedBy: {
    id: string;
    fullName: string;
    email: string;
    universityId?: string | null;
  };
}

// ── Official ─────────────────────────────────────────────────
export interface OfficialWithUser {
  id: string;
  userId: string;
  title: string;
  officeLocation?: string | null;
  officeHours?: string | null;
  bio?: string | null;
  appointmentDurationMins: number;
  isAvailable: boolean;
  maxDailyAppointments: number;
  user: {
    fullName: string;
    email: string;
    mobileNumber?: string | null;
    profilePicture?: string | null;
    role: UserRole;
  };
  faculty?: { id: string; name: string; shortName: string } | null;
  department?: { id: string; name: string; shortName: string } | null;
}

// ── Faculty / Department / Program ─────────────────────────
export interface FacultyWithDepts {
  id: string;
  name: string;
  shortName: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  departments: Array<{
    id: string;
    name: string;
    shortName: string;
    programs: Array<{
      id: string;
      name: string;
      degree: string;
      duration: number;
    }>;
  }>;
}

// ── API Response Wrappers ────────────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── RBAC ─────────────────────────────────────────────────────
export interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  dashboardPath: string;
  color: string;
  icon: string;
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Notification ─────────────────────────────────────────────
export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  appointmentId?: string | null;
}

// ── Dashboard Stats ──────────────────────────────────────────
export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
  thisWeekAppointments: number;
  upcomingAppointments: number;
}
