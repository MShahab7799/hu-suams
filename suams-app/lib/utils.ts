// ============================================================
//  Utility Functions — SUAMS
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import type { AppointmentStatus, UserRole } from '@/types';

// ── Tailwind Class Merger ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Appointment Number Generator ─────────────────────────────
export function generateAppointmentNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `APT-${year}-${random}`;
}

// ── Date / Time Formatting ───────────────────────────────────
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy · hh:mm a');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getDateLabel(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEEE, MMM dd');
}

export function isAppointmentPast(date: Date | string, time: string): boolean {
  const [h, m] = time.split(':').map(Number);
  const apptDate = new Date(date);
  apptDate.setHours(h, m, 0, 0);
  return isPast(apptDate);
}

// ── Working Days (next N weekdays) ───────────────────────────
export function getUpcomingWorkingDays(count: number = 10): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1); // start tomorrow
  while (days.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// ── Status Helpers ───────────────────────────────────────────
export function getStatusColor(status: AppointmentStatus): string {
  const map: Record<AppointmentStatus, string> = {
    Pending:      'text-amber-400 bg-amber-400/10 border-amber-400/30',
    Approved:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    Rejected:     'text-red-400 bg-red-400/10 border-red-400/30',
    Cancelled:    'text-zinc-400 bg-zinc-400/10 border-zinc-400/30',
    Completed:    'text-blue-400 bg-blue-400/10 border-blue-400/30',
    Rescheduled:  'text-purple-400 bg-purple-400/10 border-purple-400/30',
    NoShow:       'text-orange-400 bg-orange-400/10 border-orange-400/30',
  };
  return map[status] ?? 'text-zinc-400 bg-zinc-400/10';
}

export function getStatusDot(status: AppointmentStatus): string {
  const map: Record<AppointmentStatus, string> = {
    Pending:      'bg-amber-400',
    Approved:     'bg-emerald-400',
    Rejected:     'bg-red-400',
    Cancelled:    'bg-zinc-400',
    Completed:    'bg-blue-400',
    Rescheduled:  'bg-purple-400',
    NoShow:       'bg-orange-400',
  };
  return map[status] ?? 'bg-zinc-400';
}

// ── Avatar Initials ──────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

// ── Pagination ───────────────────────────────────────────────
export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, total, totalPages };
}

// ── Error Handling ───────────────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

// ── API Response Helpers ─────────────────────────────────────
export function success<T>(data: T, message?: string) {
  return { success: true as const, data, message };
}

export function failure(error: string, details?: Record<string, string[]>) {
  return { success: false as const, error, details };
}

// ── CNIC Formatter ───────────────────────────────────────────
export function formatCNIC(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 5) return cleaned;
  if (cleaned.length <= 12) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
}

// ── Phone Formatter ──────────────────────────────────────────
export function formatPKPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.startsWith('92')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+92${cleaned.slice(1)}`;
  return value;
}

// ── Role Display ─────────────────────────────────────────────
export function getRoleDisplayName(role: UserRole): string {
  const map: Record<UserRole, string> = {
    Admin: 'System Administrator',
    ViceChancellor: 'Vice Chancellor',
    Registrar: 'Registrar',
    Dean: 'Dean',
    Chairman: 'Chairman',
    HOD: 'Head of Department',
    Director: 'Director',
    Assistant: 'Assistant',
    AdmissionOfficer: 'Admission Officer',
    ExaminationOfficer: 'Examination Officer',
    Student: 'Student',
    Teacher: 'Teacher',
    Parent: 'Parent / Guardian',
    Visitor: 'Visitor',
    Alumni: 'Alumni',
  };
  return map[role] ?? role;
}

// ── Debounce ─────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Truncate ─────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
