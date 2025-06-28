import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin, Check, X, CircleAlert as AlertCircle } from 'lucide-react-native';
import { AttendanceRecord } from '@/types/attendance';
import { useAttendance } from '@/context/AttendanceContext';

export default function AttendanceHistory() {
  const { attendanceRecords } = useAttendance();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');

  const filteredRecords = attendanceRecords.filter(record => 
    selectedFilter === 'all' || record.status === selectedFilter
  );

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
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#64748B" />
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
    { key: 'all', label: 'All' },
    { key: 'present', label: 'Present' },
    { key: 'late', label: 'Late' },
    { key: 'absent', label: 'Absent' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
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
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    color: '#3B82F6',
  },
});