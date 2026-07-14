// ============================================================
//  Zod Validation Schemas — SUAMS
// ============================================================

import { z } from 'zod';

// ── Shared Validators ────────────────────────────────────────
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const phoneSchema = z
  .string()
  .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani mobile number (e.g. +923001234567)')
  .optional()
  .or(z.literal(''));

const cnicSchema = z
  .string()
  .regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/, 'CNIC format: 12345-1234567-1')
  .optional()
  .or(z.literal(''));

// ── Auth Schemas ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name must be at most 100 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Full name can only contain letters, spaces, dots, apostrophes, hyphens'),
    universityId: z
      .string()
      .max(50, 'University ID too long')
      .optional()
      .or(z.literal('')),
    cnic: cnicSchema,
    email: z.string().email('Enter a valid email address').max(255),
    mobileNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    gender: z.enum(['Male', 'Female', 'Other', 'PreferNotToSay']),
    role: z.enum([
      'Admin', 'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
      'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
      'Student', 'Teacher', 'Parent', 'Visitor', 'Alumni',
    ]),
    facultyId: z.string().optional().or(z.literal('')),
    departmentId: z.string().optional().or(z.literal('')),
    programId: z.string().optional().or(z.literal('')),
    semester: z
      .number()
      .min(1)
      .max(16)
      .optional()
      .or(z.nan().transform(() => undefined)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ── Profile Schemas ──────────────────────────────────────────

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100)
    .optional(),
  mobileNumber: phoneSchema,
  gender: z.enum(['Male', 'Female', 'Other', 'PreferNotToSay']).optional(),
  semester: z.number().min(1).max(16).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ── Appointment Schemas ──────────────────────────────────────

export const createAppointmentSchema = z.object({
  officialId: z.string().min(1, 'Official is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  purpose: z
    .string()
    .min(10, 'Purpose must be at least 10 characters')
    .max(500, 'Purpose too long'),
  notes: z.string().max(1000, 'Notes too long').optional().or(z.literal('')),
  isUrgent: z.boolean().optional().default(false),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected', 'Cancelled', 'Completed', 'Rescheduled', 'NoShow']),
  rejectionReason: z.string().max(500).optional(),
  rescheduleReason: z.string().max(500).optional(),
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

// ── Official Schemas ─────────────────────────────────────────

export const updateOfficialSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  officeLocation: z.string().max(300).optional(),
  officeHours: z.string().max(500).optional(),
  bio: z.string().max(2000).optional(),
  appointmentDurationMins: z.number().min(5).max(120).optional(),
  isAvailable: z.boolean().optional(),
  maxDailyAppointments: z.number().min(1).max(50).optional(),
});

export type UpdateOfficialInput = z.infer<typeof updateOfficialSchema>;

// ── Admin Schemas ────────────────────────────────────────────

export const createUserSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email().max(255),
  password: passwordSchema,
  role: z.enum([
    'Admin', 'ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
    'Director', 'Assistant', 'AdmissionOfficer', 'ExaminationOfficer',
    'Student', 'Teacher', 'Parent', 'Visitor', 'Alumni',
  ]),
  universityId: z.string().max(50).optional(),
  facultyId: z.string().optional(),
  departmentId: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ── Pagination ───────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
