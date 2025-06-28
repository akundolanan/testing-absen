import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  FlatList 
} from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import { useAttendance } from '@/context/AttendanceContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'info' | 'warning';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Siap-siap Absen Masuk.',
    message: 'Mau mengingatkan santri masuk jam 8 pagi loh. Sudah siap bekerja? Jangan sampai terlambat ya.',
    time: '15-11-2024, 07:30',
    read: false,
    type: 'reminder'
  },
  {
    id: '2',
    title: 'Siap-siap Absen Masuk.',
    message: 'Selamat pagi kak, siap-siap kerja ya kak, hari ini masuk kerja jam 8 loh. Jangan sampai terlambat ya!',
    time: '15-11-2024, 07:30',
    read: false,
    type: 'reminder'
  },
  {
    id: '3',
    title: 'Siap-siap Absen Masuk.',
    message: 'Eh kak, udah siap belum? sebentar lagi jam 8 loh, masuk kerja jam hari ini.',
    time: '15-11-2024, 07:30',
    read: false,
    type: 'reminder'
  },
  {
    id: '4',
    title: 'Siap-siap Absen Masuk.',
    message: 'Hari ini masuk, jam 8 pagi ya kak! Tetap semangat dalam bekerja! Jangan sampai terlambat ya!',
    time: '14-11-2024, 07:30',
    read: false,
    type: 'reminder'
  },
  {
    id: '5',
    title: 'Siap-siap Absen Masuk.',
    message: 'Hai kak! Jangan lupa masuk kerja jam 8 pagi ya! Semoga lebih produktif hari ini.',
    time: '14-11-2024, 07:30',
    read: false,
    type: 'reminder'
  }
];

export default function NotificationsScreen() {
  const { markNotificationsAsRead } = useAttendance();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'belum-dibaca' | 'telah-dibaca'>('semua');

  useEffect(() => {
    // Mark notifications as read when screen is focused
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      markNotificationsAsRead();
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    markNotificationsAsRead();
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (selectedFilter) {
      case 'belum-dibaca': return !notif.read;
      case 'telah-dibaca': return notif.read;
      default: return true;
    }
  });

  const filters = [
    { key: 'semua', label: 'Semua' },
    { key: 'belum-dibaca', label: 'Belum Dibaca' },
    { key: 'telah-dibaca', label: 'Telah Dibaca' },
  ];

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Clock size={20} color="#14B8A6" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifikasi</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllRead}>Tandai Dibaca Semua</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.activeFilterTab
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
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#14B8A6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  markAllRead: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#14B8A6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#14B8A6',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
    marginTop: 4,
  },
});