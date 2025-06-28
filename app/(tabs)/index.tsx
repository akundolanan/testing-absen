import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Clock, Calendar, TrendingUp, MapPin, User, Camera, FileText, Settings, ChevronRight, RefreshCw, Timer } from 'lucide-react-native';
import { useAttendance } from '@/context/AttendanceContext';
import { mockEmployee } from '@/utils/mockData';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { currentStatus, lastClockIn, attendanceRecords } = useAttendance();
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(record => record.date === today);
  
  const thisMonthRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const presentDays = thisMonthRecords.filter(record => record.status === 'present').length;
  const lateDays = thisMonthRecords.filter(record => record.status === 'late').length;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusInfo = () => {
    if (currentStatus === 'clocked-in') {
      return {
        text: 'Sedang Kerja',
        color: '#F59E0B',
        backgroundColor: '#FEF3C7'
      };
    } else {
      return {
        text: 'Belum Masuk',
        color: '#14B8A6',
        backgroundColor: '#F0FDFA'
      };
    }
  };

  const statusInfo = getStatusInfo();

  const menuItems = [
    { icon: Clock, title: 'Presensi', subtitle: 'Kelola kehadiran', color: '#14B8A6', route: '/selfie' },
    { icon: Calendar, title: 'Kalender', subtitle: 'Jadwal kerja', color: '#3B82F6', route: '/schedule' },
    { icon: RefreshCw, title: 'Ganti Jadwal', subtitle: 'Request ganti shift', color: '#F59E0B', route: '/schedule-change' },
    { icon: FileText, title: 'Izin', subtitle: 'Pengajuan izin', color: '#8B5CF6', route: '/leave' },
    { icon: Timer, title: 'Lembur', subtitle: 'Riwayat lembur', color: '#EF4444', route: '/overtime' },
    { icon: TrendingUp, title: 'Laporan', subtitle: 'Statistik kehadiran', color: '#10B981', route: '/attendance' },
    { icon: User, title: 'Profil', subtitle: 'Data pribadi', color: '#6366F1', route: '/profile' },
    { icon: Settings, title: 'Pengaturan', subtitle: 'Konfigurasi app', color: '#6B7280', route: '/settings' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>kenoo</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileInfo}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.profileName}>Alisha Putri</Text>
              <Image 
                source={{ uri: mockEmployee.avatar }} 
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendance Card */}
        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>PT Inspirasi Aksara Digital</Text>
            <Text style={styles.attendanceSubtitle}>Ayo mulai bekerja dengan semangat!</Text>
          </View>
          
          <View style={styles.timeCard}>
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Jadwal Anda Hari Ini</Text>
              <View style={styles.timeRow}>
                <Clock size={16} color="#14B8A6" />
                <Text style={styles.timeText}>08:00 - 17:00</Text>
              </View>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActions}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.actionItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.actionTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Bulan Ini</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{presentDays}</Text>
              <Text style={styles.statLabel}>Hari Hadir</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{lateDays}</Text>
              <Text style={styles.statLabel}>Hari Terlambat</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Hari Izin</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Hari Alpha</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Presensi Button */}
      <TouchableOpacity 
        style={[styles.floatingButton, { backgroundColor: statusInfo.color }]}
        onPress={() => router.push('/selfie')}
      >
        <Camera size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button and tab bar
  },
  header: {
    backgroundColor: '#14B8A6',
    paddingTop: 50, // Full screen padding
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  attendanceHeader: {
    marginBottom: 16,
  },
  attendanceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  attendanceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  timeCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  quickActions: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionItem: {
    width: '23%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 14,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 85,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});