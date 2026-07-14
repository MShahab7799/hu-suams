// ============================================================
//  RBAC — Role-Based Access Control Configuration
// ============================================================

import type { UserRole, RoleConfig } from '@/types';

// ── Role Configuration ───────────────────────────────────────
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  Admin: {
    role: 'Admin',
    label: 'System Administrator',
    description: 'Full system access and management',
    dashboardPath: '/admin',
    color: '#EF4444',
    icon: '🛡️',
  },
  ViceChancellor: {
    role: 'ViceChancellor',
    label: 'Vice Chancellor',
    description: 'Head of the university',
    dashboardPath: '/official',
    color: '#8B5CF6',
    icon: '🎓',
  },
  Registrar: {
    role: 'Registrar',
    label: 'Registrar',
    description: 'Academic records and administration',
    dashboardPath: '/official',
    color: '#3B82F6',
    icon: '📋',
  },
  Dean: {
    role: 'Dean',
    label: 'Dean',
    description: 'Faculty head',
    dashboardPath: '/official',
    color: '#10B981',
    icon: '🏛️',
  },
  Chairman: {
    role: 'Chairman',
    label: 'Chairman',
    description: 'Department chairman',
    dashboardPath: '/official',
    color: '#F59E0B',
    icon: '📌',
  },
  HOD: {
    role: 'HOD',
    label: 'Head of Department',
    description: 'Departmental head',
    dashboardPath: '/official',
    color: '#06B6D4',
    icon: '👨‍🏫',
  },
  Director: {
    role: 'Director',
    label: 'Director',
    description: 'Directorate head',
    dashboardPath: '/official',
    color: '#84CC16',
    icon: '🏢',
  },
  Assistant: {
    role: 'Assistant',
    label: 'Assistant',
    description: 'Official assistant / secretary',
    dashboardPath: '/assistant',
    color: '#A855F7',
    icon: '📁',
  },
  AdmissionOfficer: {
    role: 'AdmissionOfficer',
    label: 'Admission Officer',
    description: 'Admissions office',
    dashboardPath: '/official',
    color: '#EC4899',
    icon: '📝',
  },
  ExaminationOfficer: {
    role: 'ExaminationOfficer',
    label: 'Examination Officer',
    description: 'Examinations office',
    dashboardPath: '/official',
    color: '#F97316',
    icon: '📊',
  },
  Student: {
    role: 'Student',
    label: 'Student',
    description: 'Enrolled university student',
    dashboardPath: '/student',
    color: '#1B4D3E',
    icon: '👨‍🎓',
  },
  Teacher: {
    role: 'Teacher',
    label: 'Teacher / Faculty',
    description: 'Teaching faculty member',
    dashboardPath: '/student',
    color: '#0EA5E9',
    icon: '👩‍🏫',
  },
  Parent: {
    role: 'Parent',
    label: 'Parent / Guardian',
    description: 'Student parent or guardian',
    dashboardPath: '/student',
    color: '#14B8A6',
    icon: '👨‍👩‍👧',
  },
  Visitor: {
    role: 'Visitor',
    label: 'Visitor',
    description: 'External visitor',
    dashboardPath: '/student',
    color: '#6B7280',
    icon: '🚶',
  },
  Alumni: {
    role: 'Alumni',
    label: 'Alumni',
    description: 'University graduate',
    dashboardPath: '/student',
    color: '#C5A028',
    icon: '🎖️',
  },
};

// ── Official Roles (can manage appointments) ─────────────────
export const OFFICIAL_ROLES: UserRole[] = [
  'ViceChancellor',
  'Registrar',
  'Dean',
  'Chairman',
  'HOD',
  'Director',
  'AdmissionOfficer',
  'ExaminationOfficer',
];

// ── Roles that get the "official" dashboard ──────────────────
export const OFFICIAL_DASHBOARD_ROLES: UserRole[] = [
  ...OFFICIAL_ROLES,
  'Assistant',
];

// ── Roles that can book appointments ────────────────────────
export const CAN_BOOK_ROLES: UserRole[] = [
  'Student',
  'Teacher',
  'Parent',
  'Visitor',
  'Alumni',
];

// ── Public Routes (no auth required) ────────────────────────
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
];

// ── Protected Route Map ──────────────────────────────────────
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/admin': ['Admin'],
  '/admin/users': ['Admin'],
  '/admin/appointments': ['Admin'],
  '/admin/settings': ['Admin'],
  '/assistant': ['Assistant', 'Admin'],
  '/official': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/official/appointments': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/official/timeslots': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/official/calendar': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/official/reports': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/official/profile': [
    'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
  ],
  '/student': ['Student', 'Teacher', 'Parent', 'Visitor', 'Alumni'],
  '/student/appointments': ['Student', 'Teacher', 'Parent', 'Visitor', 'Alumni'],
  '/student/profile': ['Student', 'Teacher', 'Parent', 'Visitor', 'Alumni'],
};

// ── Permission Helpers ───────────────────────────────────────

export function getDashboardPath(role: UserRole): string {
  return ROLE_CONFIG[role]?.dashboardPath ?? '/student';
}

export function isOfficialRole(role: UserRole): boolean {
  return OFFICIAL_ROLES.includes(role);
}

export function canBookAppointment(role: UserRole): boolean {
  return CAN_BOOK_ROLES.includes(role);
}

export function canManageAppointments(role: UserRole): boolean {
  return OFFICIAL_DASHBOARD_ROLES.includes(role);
}

export function isAdminRole(role: UserRole): boolean {
  return role === 'Admin';
}

export function hasRouteAccess(role: UserRole, pathname: string): boolean {
  // Admin has access to everything
  if (role === 'Admin') return true;

  // Find the matching route config
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return true; // public route

  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
  return allowedRoles.includes(role);
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_CONFIG[role]?.label ?? role;
}

export function getRoleIcon(role: UserRole): string {
  return ROLE_CONFIG[role]?.icon ?? '👤';
}

export function getRoleColor(role: UserRole): string {
  return ROLE_CONFIG[role]?.color ?? '#6B7280';
}
