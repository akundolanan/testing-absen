import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AttendanceRecord, LeaveRequest, ScheduleChangeRequest, OvertimeRecord } from '@/types/attendance';
import { mockAttendanceRecords, mockLeaveRequests, mockScheduleChangeRequests, mockOvertimeRecords } from '@/utils/mockData';

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  scheduleChangeRequests: ScheduleChangeRequest[];
  overtimeRecords: OvertimeRecord[];
  currentStatus: 'clocked-out' | 'clocked-in';
  lastClockIn?: string;
  unreadNotifications: number;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  addScheduleChangeRequest: (request: ScheduleChangeRequest) => void;
  addOvertimeRecord: (record: OvertimeRecord) => void;
  clockIn: (time: string, location: any, selfieUrl: string) => void;
  clockOut: (time: string, location: any, selfieUrl: string) => void;
  markNotificationsAsRead: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [scheduleChangeRequests, setScheduleChangeRequests] = useState<ScheduleChangeRequest[]>(mockScheduleChangeRequests);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>(mockOvertimeRecords);
  const [currentStatus, setCurrentStatus] = useState<'clocked-out' | 'clocked-in'>('clocked-out');
  const [lastClockIn, setLastClockIn] = useState<string>();
  const [unreadNotifications, setUnreadNotifications] = useState<number>(5); // Mock unread notifications

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => [record, ...prev]);
  };

  const updateAttendanceRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, ...updates } : record
      )
    );
  };

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests(prev => [request, ...prev]);
  };

  const addScheduleChangeRequest = (request: ScheduleChangeRequest) => {
    setScheduleChangeRequests(prev => [request, ...prev]);
  };

  const addOvertimeRecord = (record: OvertimeRecord) => {
    setOvertimeRecords(prev => [record, ...prev]);
  };

  const clockIn = (time: string, location: any, selfieUrl: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendanceRecords.find(record => record.date === today);
    
    if (existingRecord) {
      updateAttendanceRecord(existingRecord.id, {
        clockIn: { time, location, selfieUrl },
        status: 'present'
      });
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        date: today,
        clockIn: { time, location, selfieUrl },
        status: 'present'
      };
      addAttendanceRecord(newRecord);
    }
    
    setCurrentStatus('clocked-in');
    setLastClockIn(time);
  };

  const clockOut = (time: string, location: any, selfieUrl: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendanceRecords.find(record => record.date === today);
    
    if (existingRecord && existingRecord.clockIn) {
      const clockInTime = new Date(`${today}T${existingRecord.clockIn.time}`);
      const clockOutTime = new Date(`${today}T${time}`);
      const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      
      // Calculate overtime hours (assuming standard work is 8 hours)
      const standardHours = 8;
      const overtimeHours = Math.max(0, totalHours - standardHours);
      
      updateAttendanceRecord(existingRecord.id, {
        clockOut: { time, location, selfieUrl },
        totalHours: Math.round(totalHours * 100) / 100,
        overtimeHours: Math.round(overtimeHours * 100) / 100
      });
    }
    
    setCurrentStatus('clocked-out');
    setLastClockIn(undefined);
  };

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      leaveRequests,
      scheduleChangeRequests,
      overtimeRecords,
      currentStatus,
      lastClockIn,
      unreadNotifications,
      addAttendanceRecord,
      updateAttendanceRecord,
      addLeaveRequest,
      addScheduleChangeRequest,
      addOvertimeRecord,
      clockIn,
      clockOut,
      markNotificationsAsRead
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}