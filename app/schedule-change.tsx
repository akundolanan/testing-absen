import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { ArrowLeft, Plus, Calendar, Clock, RefreshCw, User, Check, X, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/context/AttendanceContext';
import { ScheduleChangeRequest } from '@/types/attendance';

export default function ScheduleChangeScreen() {
  const { scheduleChangeRequests, addScheduleChangeRequest } = useAttendance();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Form state
  const [changeType, setChangeType] = useState<'shift' | 'time' | 'day' | 'overtime'>('shift');
  const [requestDate, setRequestDate] = useState('');
  const [currentSchedule, setCurrentSchedule] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [reason, setReason] = useState('');

  const filteredRequests = (scheduleChangeRequests || []).filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'shift': return 'Ganti Shift';
      case 'time': return 'Ubah Jam';
      case 'day': return 'Tukar Hari';
      case 'overtime': return 'Lembur';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'shift': return '#F59E0B';
      case 'time': return '#14B8A6';
      case 'day': return '#8B5CF6';
      case 'overtime': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleSubmitRequest = () => {
    if (!requestDate || !currentSchedule || !newSchedule || !reason.trim()) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const newRequest: ScheduleChangeRequest = {
      id: Date.now().toString(),
      type: changeType,
      requestDate,
      currentSchedule: currentSchedule.trim(),
      newSchedule: newSchedule.trim(),
      reason: reason.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    addScheduleChangeRequest(newRequest);
    
    // Reset form
    setChangeType('shift');
    setRequestDate('');
    setCurrentSchedule('');
    setNewSchedule('');
    setReason('');
    setShowCreateModal(false);
    
    Alert.alert('Berhasil', 'Permintaan ganti jadwal telah dikirim dan menunggu persetujuan');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
  ];

  const changeTypes = [
    { key: 'shift', label: 'Ganti Shift', color: '#F59E0B' },
    { key: 'time', label: 'Ubah Jam Kerja', color: '#14B8A6' },
    { key: 'day', label: 'Tukar Hari', color: '#8B5CF6' },
    { key: 'overtime', label: 'Request Lembur', color: '#EF4444' },
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
        <Text style={styles.headerTitle}>Ganti Jadwal</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
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

      {/* Schedule Change Requests List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <RefreshCw size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Belum Ada Permintaan</Text>
            <Text style={styles.emptySubtitle}>
              Tap tombol + untuk membuat permintaan ganti jadwal baru
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.typeInfo}>
                  <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(request.type)}20` }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(request.type) }]}>
                      {getTypeLabel(request.type)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}20` }]}>
                    {getStatusIcon(request.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.dateInfo}>
                <Calendar size={16} color="#64748B" />
                <Text style={styles.dateText}>
                  {formatDate(request.requestDate)}
                </Text>
              </View>

              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleLabel}>Jadwal Saat Ini:</Text>
                  <Text style={styles.scheduleValue}>{request.currentSchedule}</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleLabel}>Jadwal Baru:</Text>
                  <Text style={[styles.scheduleValue, { color: getTypeColor(request.type) }]}>
                    {request.newSchedule}
                  </Text>
                </View>
              </View>

              <Text style={styles.reasonText}>{request.reason}</Text>

              <View style={styles.requestFooter}>
                <Text style={styles.submittedText}>
                  Diajukan: {new Date(request.submittedAt).toLocaleDateString('id-ID')}
                </Text>
                {request.approvedBy && (
                  <Text style={styles.approvedText}>
                    Oleh: {request.approvedBy}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Schedule Change Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowCreateModal(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Permintaan Ganti Jadwal</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Change Type Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Jenis Permintaan</Text>
              <View style={styles.typeGrid}>
                {changeTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeOption,
                      changeType === type.key && styles.selectedTypeOption,
                      { borderColor: type.color }
                    ]}
                    onPress={() => setChangeType(type.key as any)}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      changeType === type.key && { color: type.color }
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Request Date */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Tanggal yang Diminta</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={requestDate}
                onChangeText={setRequestDate}
              />
            </View>

            {/* Current Schedule */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Jadwal Saat Ini</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Shift Pagi (08:00-17:00)"
                value={currentSchedule}
                onChangeText={setCurrentSchedule}
              />
            </View>

            {/* New Schedule */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Jadwal yang Diinginkan</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Shift Siang (13:00-22:00)"
                value={newSchedule}
                onChangeText={setNewSchedule}
              />
            </View>

            {/* Reason */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Alasan</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Jelaskan alasan permintaan ganti jadwal..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitRequest}
            >
              <Text style={styles.submitButtonText}>Kirim Permintaan</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    backgroundColor: '#F59E0B',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
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
    backgroundColor: '#F59E0B',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  requestCard: {
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
  requestHeader: {
    marginBottom: 12,
  },
  typeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  scheduleInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    flex: 1,
  },
  scheduleValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 2,
    textAlign: 'right',
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestFooter: {
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
    backgroundColor: '#F59E0B',
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: '#F0FDFA',
  },
  typeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});