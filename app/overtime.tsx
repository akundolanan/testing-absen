import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Modal
} from 'react-native';
import { 
  ArrowLeft, 
  Timer, 
  Clock, 
  Calendar, 
  Check, 
  X, 
  CircleAlert as AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Award
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/context/AttendanceContext';

interface MonthYearFilter {
  month: number;
  year: number;
  label: string;
}

interface OvertimeSummary {
  totalDays: number;
  totalHours: number;
  totalApproved: number;
  totalPending: number;
  averageHoursPerDay: number;
}

export default function OvertimeScreen() {
  const { overtimeRecords, attendanceRecords } = useAttendance();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Default to current month/year
  const currentDate = new Date();
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYearFilter>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    label: currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  });

  // Generate available months/years from overtime data
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

    // Add months from overtime records
    overtimeRecords.forEach(record => {
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
  }, [overtimeRecords]);

  // Filter records by selected month/year
  const filteredByMonthYear = useMemo(() => {
    return overtimeRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonthYear.month && 
             recordDate.getFullYear() === selectedMonthYear.year;
    });
  }, [overtimeRecords, selectedMonthYear]);

  // Filter by status
  const filteredRecords = useMemo(() => {
    return filteredByMonthYear.filter(record => 
      selectedFilter === 'all' || record.status === selectedFilter
    );
  }, [filteredByMonthYear, selectedFilter]);

  // Calculate summary for selected month/year
  const summary = useMemo((): OvertimeSummary => {
    const records = filteredByMonthYear;
    
    const totalDays = records.length;
    const totalHours = records.reduce((sum, record) => sum + record.totalHours, 0);
    const totalApproved = records.filter(r => r.status === 'approved').length;
    const totalPending = records.filter(r => r.status === 'pending').length;
    const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

    return {
      totalDays,
      totalHours: Math.round(totalHours * 10) / 10,
      totalApproved,
      totalPending,
      averageHoursPerDay: Math.round(averageHoursPerDay * 10) / 10
    };
  }, [filteredByMonthYear]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check size={16} color="#10B981" />;
      case 'rejected': return <X size={16} color="#EF4444" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      default: return <AlertCircle size={16} color="#64748B" />;
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

  const renderOvertimeItem = ({ item }: { item: any }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#EF4444" />
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.timeInfo}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Waktu Lembur:</Text>
          <Text style={styles.timeValue}>{item.startTime} - {item.endTime}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Total Jam:</Text>
          <Text style={[styles.timeValue, { color: '#EF4444', fontFamily: 'Inter-Bold' }]}>
            {item.totalHours}j
          </Text>
        </View>
      </View>

      <Text style={styles.reasonText}>{item.reason}</Text>

      <View style={styles.recordFooter}>
        <Text style={styles.submittedText}>
          Diajukan: {new Date(item.submittedAt).toLocaleDateString('id-ID')}
        </Text>
        {item.approvedBy && (
          <Text style={styles.approvedText}>
            Disetujui oleh: {item.approvedBy}
          </Text>
        )}
      </View>
    </View>
  );

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
  ];

  const summaryCards = [
    {
      title: 'Total Hari',
      value: summary.totalDays,
      icon: <Calendar size={16} color="#EF4444" />,
      color: '#EF4444',
      backgroundColor: '#FEF2F2'
    },
    {
      title: 'Total Jam',
      value: `${summary.totalHours}j`,
      icon: <Timer size={16} color="#F59E0B" />,
      color: '#F59E0B',
      backgroundColor: '#FFFBEB'
    },
    {
      title: 'Disetujui',
      value: summary.totalApproved,
      icon: <Check size={16} color="#10B981" />,
      color: '#10B981',
      backgroundColor: '#F0FDF4'
    },
    {
      title: 'Menunggu',
      value: summary.totalPending,
      icon: <Clock size={16} color="#8B5CF6" />,
      color: '#8B5CF6',
      backgroundColor: '#F5F3FF'
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
          <ChevronLeft size={18} color="#EF4444" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {selectedMonthYear.label}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={18} color="#EF4444" />
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

      {/* Performance Card */}
      <View style={styles.performanceCard}>
        <View style={styles.performanceHeader}>
          <TrendingUp size={16} color="#EF4444" />
          <Text style={styles.performanceTitle}>Performa Lembur</Text>
        </View>
        <View style={styles.performanceContent}>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Rata-rata jam per hari:</Text>
            <Text style={styles.performanceValue}>{summary.averageHoursPerDay}j</Text>
          </View>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Total jam bulan ini:</Text>
            <Text style={[styles.performanceValue, { color: '#EF4444' }]}>{summary.totalHours}j</Text>
          </View>
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
        <Text style={styles.sectionTitle}>Riwayat Lembur</Text>
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Lembur</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderOvertimeItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Timer size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Tidak Ada Data Lembur</Text>
            <Text style={styles.emptySubtitle}>
              Belum ada catatan lembur untuk {selectedMonthYear.label}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#EF4444',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
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
    backgroundColor: '#FEF2F2',
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
  performanceCard: {
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
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  performanceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  performanceContent: {
    gap: 8,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  performanceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  filterContainer: {
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
  },
  activeFilter: {
    backgroundColor: '#EF4444',
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
  timeInfo: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  recordFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  submittedText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  approvedText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginTop: 2,
  },
});