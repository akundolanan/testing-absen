import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Calendar, Clock, MapPin, Check, X, CircleAlert as AlertCircle, Filter, ChevronDown, TrendingUp, Users, Timer, TriangleAlert as AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AttendanceRecord } from '@/types/attendance';
import { useAttendance } from '@/context/AttendanceContext';

interface MonthYearFilter {
  month: number;
  year: number;
  label: string;
}

interface AttendanceSummary {
  totalDays: number;
  totalPresent: number;
  totalLeave: number;
  totalLate: number;
  totalWorkHours: number;
  totalLateHours: number;
  attendanceRate: number;
}

export default function AttendanceScreen() {
  const { attendanceRecords } = useAttendance();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');
  
  // Default to current month/year
  const currentDate = new Date();
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYearFilter>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    label: currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  });

  // Generate available months/years from attendance data
  const availableMonthYears = useMemo(() => {
    const monthYearSet = new Set<string>();
    const options: MonthYearFilter[] = [];

    // Add current month if not in data
    const currentKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    monthYearSet.add(currentKey);
    options.push({
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      label: currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    });

    // Add months from attendance records
    attendanceRecords.forEach(record => {
      const recordDate = new Date(record.date);
      const key = `${recordDate.getFullYear()}-${recordDate.getMonth()}`;
      
      if (!monthYearSet.has(key)) {
        monthYearSet.add(key);
        options.push({
          month: recordDate.getMonth(),
          year: recordDate.getFullYear(),
          label: recordDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        });
      }
    });

    // Sort by year and month (newest first)
    return options.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [attendanceRecords]);

  // Filter records by selected month/year
  const filteredByMonthYear = useMemo(() => {
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonthYear.month && 
             recordDate.getFullYear() === selectedMonthYear.year;
    });
  }, [attendanceRecords, selectedMonthYear]);

  // Filter by status
  const filteredRecords = useMemo(() => {
    return filteredByMonthYear.filter(record => 
      selectedFilter === 'all' || record.status === selectedFilter
    );
  }, [filteredByMonthYear, selectedFilter]);

  // Calculate summary for selected month/year
  const summary = useMemo((): AttendanceSummary => {
    const records = filteredByMonthYear;
    
    // Calculate working days in the selected month
    const year = selectedMonthYear.year;
    const month = selectedMonthYear.month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      // Count Monday to Friday as working days (1-5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        workingDays++;
      }
    }

    const totalPresent = records.filter(r => r.status === 'present').length;
    const totalLate = records.filter(r => r.status === 'late').length;
    const totalLeave = records.filter(r => r.status === 'absent').length; // Assuming absent = leave for now
    
    const totalWorkHours = records.reduce((sum, record) => {
      return sum + (record.totalHours || 0);
    }, 0);

    // Calculate late hours (assuming late if clock in after 09:00)
    const totalLateHours = records.reduce((sum, record) => {
      if (record.status === 'late' && record.clockIn) {
        const clockInTime = record.clockIn.time;
        const [hours, minutes] = clockInTime.split(':').map(Number);
        const clockInMinutes = hours * 60 + minutes;
        const standardStartMinutes = 9 * 60; // 09:00
        
        if (clockInMinutes > standardStartMinutes) {
          const lateMinutes = clockInMinutes - standardStartMinutes;
          return sum + (lateMinutes / 60);
        }
      }
      return sum;
    }, 0);

    const attendanceRate = workingDays > 0 ? ((totalPresent + totalLate) / workingDays) * 100 : 0;

    return {
      totalDays: workingDays,
      totalPresent,
      totalLeave,
      totalLate,
      totalWorkHours: Math.round(totalWorkHours * 10) / 10,
      totalLateHours: Math.round(totalLateHours * 10) / 10,
      attendanceRate: Math.round(attendanceRate)
    };
  }, [filteredByMonthYear, selectedMonthYear]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10B981';
      case 'late': return '#F59E0B';
      case 'absent': return '#EF4444';
      case 'half-day': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <Check size={16} color="#10B981" />;
      case 'late': return <AlertCircle size={16} color="#F59E0B" />;
      case 'absent': return <X size={16} color="#EF4444" />;
      case 'half-day': return <Clock size={16} color="#8B5CF6" />;
      default: return <Clock size={16} color="#64748B" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = availableMonthYears.findIndex(
      item => item.month === selectedMonthYear.month && item.year === selectedMonthYear.year
    );
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex < availableMonthYears.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : availableMonthYears.length - 1;
    }
    
    setSelectedMonthYear(availableMonthYears[newIndex]);
  };

  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#14B8A6" />
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {item.clockIn && (
        <View style={styles.timeEntry}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Clock In</Text>
            <Text style={styles.timeValue}>{item.clockIn.time}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#64748B" />
              <Text style={styles.locationText}>{item.clockIn.location.address}</Text>
            </View>
          </View>
          <Image source={{ uri: item.clockIn.selfieUrl }} style={styles.selfieImage} />
        </View>
      )}

      {item.clockOut && (
        <View style={styles.timeEntry}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>{item.clockOut.time}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#64748B" />
              <Text style={styles.locationText}>{item.clockOut.location.address}</Text>
            </View>
          </View>
          <Image source={{ uri: item.clockOut.selfieUrl }} style={styles.selfieImage} />
        </View>
      )}

      {item.totalHours && (
        <View style={styles.totalHours}>
          <Text style={styles.totalHoursText}>
            Total Hours: {item.totalHours}h
          </Text>
        </View>
      )}
    </View>
  );

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'present', label: 'Hadir' },
    { key: 'late', label: 'Terlambat' },
    { key: 'absent', label: 'Tidak Hadir' },
  ];

  const summaryCards = [
    {
      title: 'Hari Kerja',
      value: summary.totalDays,
      icon: <Calendar size={16} color="#14B8A6" />,
      color: '#14B8A6',
      backgroundColor: '#F0FDFA'
    },
    {
      title: 'Masuk',
      value: summary.totalPresent,
      icon: <Check size={16} color="#10B981" />,
      color: '#10B981',
      backgroundColor: '#F0FDF4'
    },
    {
      title: 'Izin',
      value: summary.totalLeave,
      icon: <Users size={16} color="#8B5CF6" />,
      color: '#8B5CF6',
      backgroundColor: '#F5F3FF'
    },
    {
      title: 'Terlambat',
      value: summary.totalLate,
      icon: <AlertTriangle size={16} color="#F59E0B" />,
      color: '#F59E0B',
      backgroundColor: '#FFFBEB'
    },
    {
      title: 'Jam Kerja',
      value: `${summary.totalWorkHours}j`,
      icon: <Clock size={16} color="#3B82F6" />,
      color: '#3B82F6',
      backgroundColor: '#EFF6FF'
    },
    {
      title: 'Jam Telat',
      value: `${summary.totalLateHours}j`,
      icon: <Timer size={16} color="#EF4444" />,
      color: '#EF4444',
      backgroundColor: '#FEF2F2'
    }
  ];

  const renderHeader = () => (
    <View>
      {/* Month/Year Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={18} color="#14B8A6" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {selectedMonthYear.label}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={18} color="#14B8A6" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryContainer}
      >
        {summaryCards.map((card, index) => (
          <View key={index} style={[styles.summaryCard, { backgroundColor: card.backgroundColor }]}>
            <View style={styles.summaryHeader}>
              <View style={[styles.summaryIcon, { backgroundColor: `${card.color}20` }]}>
                {card.icon}
              </View>
            </View>
            <Text style={styles.summaryValue}>{card.value}</Text>
            <Text style={styles.summaryTitle}>{card.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Attendance Rate */}
      <View style={styles.attendanceRateCard}>
        <View style={styles.attendanceRateHeader}>
          <TrendingUp size={16} color="#14B8A6" />
          <Text style={styles.attendanceRateTitle}>Tingkat Kehadiran</Text>
        </View>
        <View style={styles.attendanceRateContent}>
          <Text style={styles.attendanceRateValue}>{summary.attendanceRate}%</Text>
          <View style={styles.attendanceRateBar}>
            <View 
              style={[
                styles.attendanceRateProgress, 
                { 
                  width: `${summary.attendanceRate}%`,
                  backgroundColor: summary.attendanceRate >= 90 ? '#10B981' : 
                                 summary.attendanceRate >= 75 ? '#F59E0B' : '#EF4444'
                }
              ]} 
            />
          </View>
          <Text style={styles.attendanceRateDescription}>
            {summary.attendanceRate >= 90 ? 'Sangat Baik' : 
             summary.attendanceRate >= 75 ? 'Baik' : 'Perlu Ditingkatkan'}
          </Text>
        </View>
      </View>

      {/* Filter Container */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilter
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Riwayat Presensi</Text>
        <Text style={styles.sectionSubtitle}>
          {filteredRecords.length} catatan ditemukan
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Presensi</Text>
        <Text style={styles.subtitle}>Lihat catatan kehadiran Anda</Text>
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Tidak Ada Data</Text>
            <Text style={styles.emptySubtitle}>
              Belum ada catatan presensi untuk {selectedMonthYear.label}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#14B8A6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    padding: 8,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  summaryCard: {
    borderRadius: 10,
    padding: 12,
    width: 100,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryHeader: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 12,
  },
  attendanceRateCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  attendanceRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  attendanceRateTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  attendanceRateContent: {
    alignItems: 'center',
  },
  attendanceRateValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    marginBottom: 6,
  },
  attendanceRateBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  attendanceRateProgress: {
    height: '100%',
    borderRadius: 3,
  },
  attendanceRateDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  activeFilter: {
    backgroundColor: '#14B8A6',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timeEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  selfieImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  totalHours: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalHoursText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
});