import { AttendanceRecord, LeaveRequest, ScheduleChangeRequest, OvertimeRecord, Employee } from '@/types/attendance';

export const mockEmployee: Employee = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  department: 'Engineering',
  position: 'Software Developer',
  workingHours: {
    start: '09:00',
    end: '17:00'
  },
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    date: '2025-01-15',
    clockIn: {
      time: '08:55',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    clockOut: {
      time: '19:30',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    status: 'present',
    totalHours: 10.5,
    overtimeHours: 2.5
  },
  {
    id: '2',
    date: '2025-01-14',
    clockIn: {
      time: '09:15',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    clockOut: {
      time: '18:00',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    status: 'late',
    totalHours: 8.75,
    overtimeHours: 1
  },
  {
    id: '3',
    date: '2025-01-13',
    status: 'absent'
  },
  {
    id: '4',
    date: '2025-01-12',
    clockIn: {
      time: '09:00',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    clockOut: {
      time: '20:00',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    status: 'present',
    totalHours: 11,
    overtimeHours: 3
  },
  {
    id: '5',
    date: '2025-01-11',
    clockIn: {
      time: '08:45',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    clockOut: {
      time: '18:30',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia'
      },
      selfieUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    status: 'present',
    totalHours: 9.75,
    overtimeHours: 1.5
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'sick',
    startDate: '2025-01-16',
    endDate: '2025-01-16',
    reason: 'Flu symptoms',
    status: 'approved',
    submittedAt: '2025-01-15T10:30:00Z',
    approvedBy: 'Manager',
    approvedAt: '2025-01-15T14:00:00Z'
  },
  {
    id: '2',
    type: 'annual',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    reason: 'Family vacation',
    status: 'pending',
    submittedAt: '2025-01-14T09:00:00Z'
  }
];

export const mockScheduleChangeRequests: ScheduleChangeRequest[] = [
  {
    id: '1',
    type: 'shift',
    requestDate: '2025-01-18',
    currentSchedule: 'Shift Pagi (08:00-17:00)',
    newSchedule: 'Shift Siang (13:00-22:00)',
    reason: 'Ada keperluan keluarga di pagi hari',
    status: 'approved',
    submittedAt: '2025-01-15T08:30:00Z',
    approvedBy: 'Supervisor',
    approvedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'overtime',
    requestDate: '2025-01-19',
    currentSchedule: 'Regular (09:00-17:00)',
    newSchedule: 'Overtime (09:00-21:00)',
    reason: 'Menyelesaikan project deadline',
    status: 'pending',
    submittedAt: '2025-01-16T14:00:00Z'
  },
  {
    id: '3',
    type: 'day',
    requestDate: '2025-01-20',
    currentSchedule: 'Sabtu (09:00-17:00)',
    newSchedule: 'Minggu (09:00-17:00)',
    reason: 'Tukar dengan rekan kerja untuk acara keluarga',
    status: 'rejected',
    submittedAt: '2025-01-14T16:00:00Z',
    approvedBy: 'Manager',
    approvedAt: '2025-01-15T09:00:00Z'
  }
];

export const mockOvertimeRecords: OvertimeRecord[] = [
  {
    id: '1',
    date: '2025-01-15',
    startTime: '17:00',
    endTime: '19:30',
    totalHours: 2.5,
    reason: 'Menyelesaikan laporan bulanan',
    status: 'approved',
    submittedAt: '2025-01-15T17:00:00Z',
    approvedBy: 'Manager',
    approvedAt: '2025-01-15T17:30:00Z'
  },
  {
    id: '2',
    date: '2025-01-14',
    startTime: '17:00',
    endTime: '18:00',
    totalHours: 1,
    reason: 'Meeting dengan klien',
    status: 'approved',
    submittedAt: '2025-01-14T17:00:00Z',
    approvedBy: 'Supervisor',
    approvedAt: '2025-01-14T17:15:00Z'
  },
  {
    id: '3',
    date: '2025-01-12',
    startTime: '17:00',
    endTime: '20:00',
    totalHours: 3,
    reason: 'Deadline project development',
    status: 'approved',
    submittedAt: '2025-01-12T17:00:00Z',
    approvedBy: 'Manager',
    approvedAt: '2025-01-12T17:45:00Z'
  },
  {
    id: '4',
    date: '2025-01-11',
    startTime: '17:00',
    endTime: '18:30',
    totalHours: 1.5,
    reason: 'Training tim baru',
    status: 'approved',
    submittedAt: '2025-01-11T17:00:00Z',
    approvedBy: 'Supervisor',
    approvedAt: '2025-01-11T17:20:00Z'
  },
  {
    id: '5',
    date: '2025-01-10',
    startTime: '17:00',
    endTime: '19:00',
    totalHours: 2,
    reason: 'Maintenance server',
    status: 'pending',
    submittedAt: '2025-01-10T17:00:00Z'
  },
  {
    id: '6',
    date: '2024-12-28',
    startTime: '17:00',
    endTime: '21:00',
    totalHours: 4,
    reason: 'Persiapan presentasi akhir tahun',
    status: 'approved',
    submittedAt: '2024-12-28T17:00:00Z',
    approvedBy: 'Manager',
    approvedAt: '2024-12-28T17:30:00Z'
  },
  {
    id: '7',
    date: '2024-12-27',
    startTime: '17:00',
    endTime: '18:30',
    totalHours: 1.5,
    reason: 'Bug fixing urgent',
    status: 'approved',
    submittedAt: '2024-12-27T17:00:00Z',
    approvedBy: 'Supervisor',
    approvedAt: '2024-12-27T17:15:00Z'
  }
];