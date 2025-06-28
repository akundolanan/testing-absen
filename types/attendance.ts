export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn?: {
    time: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    selfieUrl: string;
  };
  clockOut?: {
    time: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    selfieUrl: string;
  };
  status: 'present' | 'late' | 'absent' | 'half-day';
  totalHours?: number;
  overtimeHours?: number;
}

export interface LeaveRequest {
  id: string;
  type: 'sick' | 'annual' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ScheduleChangeRequest {
  id: string;
  type: 'shift' | 'time' | 'day' | 'overtime';
  requestDate: string;
  currentSchedule: string;
  newSchedule: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface OvertimeRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  workingHours: {
    start: string;
    end: string;
  };
  avatar?: string;
}