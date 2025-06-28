import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Calendar, Clock, MapPin, Briefcase, Users, ChevronLeft, ChevronRight, X, Chrome as Home, Video } from 'lucide-react-native';

interface ScheduleItem {
  id: string;
  date: string;
  type: 'office' | 'remote' | 'dayoff' | 'meeting' | 'training' | 'client';
  title: string;
  time: string;
  location?: string;
  description?: string;
  tasks?: string[];
}

// Generate dynamic dates for current week
const generateWeekDates = (weekOffset: number = 0) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const currentWeekDates = generateWeekDates(0);
const nextWeekDates = generateWeekDates(1);
const lastWeekDates = generateWeekDates(-1);

const mockSchedule: ScheduleItem[] = [
  // Current Week (Week 0)
  {
    id: '1',
    date: currentWeekDates[1], // Monday
    type: 'office',
    title: 'Kerja Kantor',
    time: '08:00 - 17:00',
    location: 'Jakarta Office, Lantai 5',
    description: 'Hari kerja reguler di kantor dengan fokus pada pengembangan fitur baru',
    tasks: [
      'Stand-up meeting tim pagi (09:00)',
      'Review dan testing fitur login',
      'Diskusi dengan UI/UX designer',
      'Code review pull request',
      'Dokumentasi API endpoint'
    ]
  },
  {
    id: '2',
    date: currentWeekDates[2], // Tuesday
    type: 'remote',
    title: 'Kerja Remote',
    time: '08:00 - 17:00',
    location: 'Work from Home',
    description: 'Hari kerja dari rumah dengan fokus pada development dan testing',
    tasks: [
      'Daily standup via video call (09:00)',
      'Development fitur dashboard',
      'Unit testing dan integration testing',
      'Bug fixing dari feedback QA',
      'Update progress di project management tool'
    ]
  },
  {
    id: '3',
    date: currentWeekDates[3], // Wednesday
    type: 'meeting',
    title: 'Meeting Klien & Training',
    time: '09:00 - 16:00',
    location: 'Conference Room A & Online',
    description: 'Presentasi progress project ke klien dan training internal',
    tasks: [
      'Persiapan materi presentasi (09:00-09:30)',
      'Meeting dengan klien PT ABC (10:00-12:00)',
      'Lunch break (12:00-13:00)',
      'Training React Native terbaru (13:00-15:00)',
      'Follow up action items (15:00-16:00)'
    ]
  },
  {
    id: '4',
    date: currentWeekDates[4], // Thursday
    type: 'office',
    title: 'Kerja Kantor',
    time: '08:00 - 17:00',
    location: 'Jakarta Office, Lantai 5',
    description: 'Implementasi feedback dari klien dan persiapan deployment',
    tasks: [
      'Review feedback klien dari meeting kemarin',
      'Implementasi perubahan UI/UX',
      'Testing fitur baru di staging environment',
      'Koordinasi dengan tim DevOps untuk deployment',
      'Dokumentasi user manual'
    ]
  },
  {
    id: '5',
    date: currentWeekDates[5], // Friday
    type: 'client',
    title: 'Kunjungan Klien',
    time: '09:00 - 15:00',
    location: 'PT Inspirasi Digital, Sudirman',
    description: 'Kunjungan ke kantor klien untuk demo dan training pengguna',
    tasks: [
      'Perjalanan ke kantor klien (09:00-10:00)',
      'Setup environment untuk demo (10:00-10:30)',
      'Demo aplikasi ke stakeholder (10:30-12:00)',
      'Training pengguna akhir (13:00-14:30)',
      'Diskusi next phase project (14:30-15:00)'
    ]
  },
  {
    id: '6',
    date: currentWeekDates[6], // Saturday
    type: 'dayoff',
    title: 'Hari Libur',
    time: 'Sepanjang Hari',
    description: 'Hari istirahat akhir pekan',
    tasks: []
  },
  {
    id: '7',
    date: currentWeekDates[0], // Sunday
    type: 'dayoff',
    title: 'Hari Libur',
    time: 'Sepanjang Hari',
    description: 'Hari istirahat akhir pekan',
    tasks: []
  },

  // Next Week (Week +1)
  {
    id: '8',
    date: nextWeekDates[1], // Next Monday
    type: 'training',
    title: 'Training & Workshop',
    time: '08:00 - 17:00',
    location: 'Training Center, Lantai 3',
    description: 'Workshop pengembangan skill dan knowledge sharing',
    tasks: [
      'Workshop Advanced React Patterns (09:00-12:00)',
      'Knowledge sharing session (13:00-15:00)',
      'Team building activity (15:00-17:00)'
    ]
  },
  {
    id: '9',
    date: nextWeekDates[2], // Next Tuesday
    type: 'remote',
    title: 'Kerja Remote',
    time: '08:00 - 17:00',
    location: 'Work from Home',
    description: 'Development sprint untuk fitur baru',
    tasks: [
      'Sprint planning meeting (09:00-10:00)',
      'Development fitur notification system',
      'Code review dan pair programming',
      'Testing dan debugging'
    ]
  },
  {
    id: '10',
    date: nextWeekDates[3], // Next Wednesday
    type: 'office',
    title: 'Kerja Kantor',
    time: '08:00 - 17:00',
    location: 'Jakarta Office, Lantai 5',
    description: 'Kolaborasi tim dan review progress',
    tasks: [
      'Team sync meeting',
      'Code review session',
      'Architecture discussion',
      'Performance optimization'
    ]
  },

  // Last Week (Week -1)
  {
    id: '11',
    date: lastWeekDates[1], // Last Monday
    type: 'office',
    title: 'Kerja Kantor',
    time: '08:00 - 17:00',
    location: 'Jakarta Office, Lantai 5',
    description: 'Kick-off project baru dan planning',
    tasks: [
      'Project kick-off meeting',
      'Requirement analysis',
      'Technical architecture planning',
      'Resource allocation discussion'
    ]
  },
  {
    id: '12',
    date: lastWeekDates[2], // Last Tuesday
    type: 'remote',
    title: 'Kerja Remote',
    time: '08:00 - 17:00',
    location: 'Work from Home',
    description: 'Setup development environment dan initial development',
    tasks: [
      'Setup project repository',
      'Environment configuration',
      'Initial component development',
      'Database schema design'
    ]
  }
];

export default function ScheduleScreen() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'office': return '#14B8A6';
      case 'remote': return '#3B82F6';
      case 'dayoff': return '#EF4444';
      case 'meeting': return '#8B5CF6';
      case 'training': return '#F59E0B';
      case 'client': return '#10B981';
      default: return '#64748B';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'office': return <Briefcase size={20} color="#FFFFFF" />;
      case 'remote': return <Home size={20} color="#FFFFFF" />;
      case 'dayoff': return <Calendar size={20} color="#FFFFFF" />;
      case 'meeting': return <Users size={20} color="#FFFFFF" />;
      case 'training': return <Video size={20} color="#FFFFFF" />;
      case 'client': return <MapPin size={20} color="#FFFFFF" />;
      default: return <Clock size={20} color="#FFFFFF" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'office': return 'Kantor';
      case 'remote': return 'Remote';
      case 'dayoff': return 'Libur';
      case 'meeting': return 'Meeting';
      case 'training': return 'Training';
      case 'client': return 'Klien';
      default: return 'Lainnya';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari Ini';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Besok';
    } else {
      return date.toLocaleDateString('id-ID', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getDayNumber = (dateString: string) => {
    return new Date(dateString).getDate().toString().padStart(2, '0');
  };

  const getDayName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'short' });
  };

  // Generate week view
  const generateWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (selectedWeek * 7));
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day.toISOString().split('T')[0]);
    }
    return weekDays;
  };

  const weekDays = generateWeekDays();

  const handleDatePress = (date: string) => {
    setSelectedDate(date);
    setShowDetailModal(true);
  };

  const getSelectedDateSchedule = () => {
    return mockSchedule.find(item => item.date === selectedDate);
  };

  const renderDetailModal = () => {
    const schedule = getSelectedDateSchedule();
    if (!schedule) return null;

    return (
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detail Jadwal</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowDetailModal(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.dateHeader}>
              <Text style={styles.modalDate}>
                {new Date(selectedDate!).toLocaleDateString('id-ID', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(schedule.type) }]}>
                <Text style={styles.typeBadgeText}>{getTypeLabel(schedule.type)}</Text>
              </View>
            </View>

            <View style={styles.scheduleDetailCard}>
              <View style={styles.scheduleDetailHeader}>
                <View style={[styles.typeIconLarge, { backgroundColor: getTypeColor(schedule.type) }]}>
                  {getTypeIcon(schedule.type)}
                </View>
                <View style={styles.scheduleDetailInfo}>
                  <Text style={styles.scheduleDetailTitle}>{schedule.title}</Text>
                  <View style={styles.timeRow}>
                    <Clock size={16} color="#14B8A6" />
                    <Text style={styles.scheduleDetailTime}>{schedule.time}</Text>
                  </View>
                  {schedule.location && (
                    <View style={styles.locationRow}>
                      <MapPin size={16} color="#64748B" />
                      <Text style={styles.scheduleDetailLocation}>{schedule.location}</Text>
                    </View>
                  )}
                </View>
              </View>

              {schedule.description && (
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Deskripsi</Text>
                  <Text style={styles.descriptionText}>{schedule.description}</Text>
                </View>
              )}

              {schedule.tasks && schedule.tasks.length > 0 && (
                <View style={styles.tasksSection}>
                  <Text style={styles.sectionLabel}>Agenda Hari Ini</Text>
                  {schedule.tasks.map((task, index) => (
                    <View key={index} style={styles.taskItem}>
                      <View style={styles.taskBullet} />
                      <Text style={styles.taskText}>{task}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Jadwal Kerja</Text>
        <Text style={styles.subtitle}>Kelola jadwal kerja fleksibel Anda</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek - 1)}
          >
            <ChevronLeft size={20} color="#14B8A6" />
            <Text style={styles.weekButtonText}>Sebelumnya</Text>
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            {selectedWeek === 0 ? 'Minggu Ini' : 
             selectedWeek === 1 ? 'Minggu Depan' : 
             selectedWeek === -1 ? 'Minggu Lalu' :
             `Minggu ${selectedWeek > 0 ? '+' : ''}${selectedWeek}`}
          </Text>
          
          <TouchableOpacity 
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek + 1)}
          >
            <Text style={styles.weekButtonText}>Selanjutnya</Text>
            <ChevronRight size={20} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        {/* Week Calendar View */}
        <View style={styles.weekCalendar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekDays}>
              {weekDays.map((day, index) => {
                const scheduleItem = mockSchedule.find(item => item.date === day);
                const isToday = day === new Date().toISOString().split('T')[0];
                
                return (
                  <TouchableOpacity 
                    key={day} 
                    style={[
                      styles.dayCard,
                      isToday && styles.todayCard,
                      scheduleItem && { borderTopColor: getTypeColor(scheduleItem.type) }
                    ]}
                    onPress={() => scheduleItem && handleDatePress(day)}
                  >
                    <Text style={[styles.dayName, isToday && styles.todayText]}>
                      {getDayName(day)}
                    </Text>
                    <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                      {getDayNumber(day)}
                    </Text>
                    {scheduleItem && (
                      <View style={[styles.dayIndicator, { backgroundColor: getTypeColor(scheduleItem.type) }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Schedule List */}
        <View style={styles.scheduleList}>
          <Text style={styles.sectionTitle}>Jadwal Minggu Ini</Text>
          
          {mockSchedule
            .filter(item => weekDays.includes(item.date))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.scheduleCard}
                onPress={() => handleDatePress(item.date)}
              >
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleDate}>
                    <Text style={styles.scheduleDateText}>
                      {getDayNumber(item.date)}
                    </Text>
                    <Text style={styles.scheduleDayText}>
                      {getDayName(item.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.scheduleContent}>
                    <View style={styles.scheduleTitle}>
                      <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
                        {getTypeIcon(item.type)}
                      </View>
                      <View style={styles.titleContent}>
                        <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                        <Text style={styles.scheduleTime}>{item.time}</Text>
                      </View>
                    </View>
                    
                    {item.location && (
                      <View style={styles.locationContainer}>
                        <MapPin size={14} color="#64748B" />
                        <Text style={styles.locationText}>{item.location}</Text>
                      </View>
                    )}
                    
                    {item.description && (
                      <Text style={styles.descriptionText} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {renderDetailModal()}
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
  scrollContent: {
    paddingBottom: 100,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  weekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    gap: 4,
  },
  weekButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#14B8A6',
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  weekCalendar: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  weekDays: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  todayCard: {
    backgroundColor: '#F0FDFA',
    borderTopColor: '#14B8A6',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  todayText: {
    color: '#14B8A6',
  },
  dayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scheduleList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  scheduleDate: {
    alignItems: 'center',
    minWidth: 50,
  },
  scheduleDateText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  scheduleDayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContent: {
    flex: 1,
  },
  scheduleItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#14B8A6',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  dateHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDate: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  scheduleDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  typeIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleDetailInfo: {
    flex: 1,
  },
  scheduleDetailTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scheduleDetailTime: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleDetailLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  descriptionSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  tasksSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  taskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14B8A6',
    marginTop: 6,
  },
  taskText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
});