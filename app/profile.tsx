import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { 
  ArrowLeft,
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Clock, 
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { useAttendance } from '@/context/AttendanceContext';
import { mockEmployee } from '@/utils/mockData';
import StatusCard from '@/components/StatusCard';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { attendanceRecords } = useAttendance();

  const thisMonthRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const presentDays = thisMonthRecords.filter(record => record.status === 'present').length;
  const totalHours = thisMonthRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  const averageHours = totalHours / Math.max(presentDays, 1);

  const menuItems = [
    { icon: Settings, title: 'Pengaturan', subtitle: 'Preferensi aplikasi dan notifikasi' },
    { icon: LogOut, title: 'Keluar', subtitle: 'Keluar dari akun Anda', color: '#EF4444' },
  ];

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
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: mockEmployee.avatar }} 
            style={styles.avatar}
          />
          <Text style={styles.name}>{mockEmployee.name}</Text>
          <Text style={styles.position}>{mockEmployee.position}</Text>
          <Text style={styles.department}>{mockEmployee.department}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Kontak</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Mail size={20} color="#64748B" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{mockEmployee.email}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Building size={20} color="#64748B" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Departemen</Text>
                <Text style={styles.infoValue}>{mockEmployee.department}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Briefcase size={20} color="#64748B" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Posisi</Text>
                <Text style={styles.infoValue}>{mockEmployee.position}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jadwal Kerja</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Clock size={20} color="#14B8A6" />
              <Text style={styles.scheduleText}>
                {mockEmployee.workingHours.start} - {mockEmployee.workingHours.end}
              </Text>
            </View>
            <Text style={styles.scheduleNote}>Senin - Jumat</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performa Bulan Ini</Text>
          <View style={styles.statsGrid}>
            <StatusCard
              title="Hari Hadir"
              value={presentDays}
              icon={<Calendar size={20} color="#10B981" />}
              color="#10B981"
              backgroundColor="#F0FDF4"
            />
            <StatusCard
              title="Total Jam"
              value={`${totalHours.toFixed(1)}j`}
              icon={<Clock size={20} color="#14B8A6" />}
              color="#14B8A6"
              backgroundColor="#F0FDFA"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatusCard
              title="Rata-rata Jam/Hari"
              value={`${averageHours.toFixed(1)}j`}
              icon={<TrendingUp size={20} color="#8B5CF6" />}
              color="#8B5CF6"
              backgroundColor="#F5F3FF"
            />
            <StatusCard
              title="Tingkat Kehadiran"
              value={`${Math.round((presentDays / Math.max(thisMonthRecords.length, 1)) * 100)}%`}
              icon={<User size={20} color="#F59E0B" />}
              color="#F59E0B"
              backgroundColor="#FFFBEB"
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder
                ]}
              >
                <View style={styles.menuItemLeft}>
                  <item.icon size={20} color={item.color || '#64748B'} />
                  <View style={styles.menuItemText}>
                    <Text style={[
                      styles.menuItemTitle,
                      item.color && { color: item.color }
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#14B8A6',
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
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#14B8A6',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
    opacity: 0.9,
  },
  department: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  scheduleNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});