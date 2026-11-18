export type UserRole = 'student' | 'tutor' | 'admin';
export type PlanType = 'free' | 'pro';
export type TuitionMode = 'Online' | 'Offline';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  plan: PlanType;
  createdAt: string;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
  tutorProfile?: {
    name: string;
    email: string;
    image?: string;
    bio?: string;
    plan: PlanType;
  } | null;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface PaymentRecord {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: 'paid';
  paidAt: string;
}