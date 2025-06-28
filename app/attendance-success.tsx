import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Animated
} from 'react-native';
import { Check, Clock, MapPin, Chrome as Home, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function AttendanceSuccessScreen() {
  const params = useLocalSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [scaleAnim] = useState(new Animated.Value(0));
  
  const attendanceType = params.type as string; // 'in' or 'out'
  const time = params.time as string;
  const date = params.date as string;
  const location = params.location as string;
  const selfieUrl = params.selfieUrl as string;

  useEffect(() => {
    // Start success animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Defer navigation to next event loop cycle to avoid React state update conflict
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBackToHome = () => {
    router.replace('/(tabs)');
  };

  const getSuccessColor = () => {
    return attendanceType === 'in' ? '#10B981' : '#EF4444';
  };

  const getSuccessTitle = () => {
    return attendanceType === 'in' ? 'Absen Masuk Berhasil!' : 'Absen Keluar Berhasil!';
  };

  const getSuccessMessage = () => {
    return attendanceType === 'in' 
      ? 'Selamat bekerja! Semoga hari ini produktif dan menyenangkan.' 
      : 'Terima kasih atas kerja keras Anda hari ini. Selamat beristirahat!';
  };

  const getSuccessIcon = () => {
    return attendanceType === 'in' ? '🎉' : '👏';
  };

  const getDisplayDate = () => {
    if (date) return date;
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: getSuccessColor() }]}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View 
          style={[
            styles.successIconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.successIcon}>
            <Check size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.successEmoji}>{getSuccessIcon()}</Text>
        </Animated.View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.successTitle}>{getSuccessTitle()}</Text>
          <Text style={styles.successMessage}>{getSuccessMessage()}</Text>
        </View>

        {/* Attendance Details */}
        <View style={styles.detailsCard}>
          {/* Selfie Preview */}
          {selfieUrl && (
            <View style={styles.selfieContainer}>
              <Image source={{ uri: selfieUrl }} style={styles.selfieImage} />
              <View style={styles.selfieOverlay}>
                <Text style={styles.selfieLabel}>Foto Presensi</Text>
              </View>
            </View>
          )}

          {/* Time and Location */}
          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${getSuccessColor()}20` }]}>
                <Clock size={20} color={getSuccessColor()} />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Waktu</Text>
                <Text style={styles.detailValue}>{time || 'Tidak tersedia'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MapPin size={20} color="#64748B" />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Lokasi</Text>
                <Text style={styles.detailValue} numberOfLines={2}>
                  {location || 'Lokasi tidak tersedia'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color="#64748B" />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Tanggal</Text>
                <Text style={styles.detailValue}>
                  {getDisplayDate()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timer and Action */}
        <View style={styles.actionContainer}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Kembali ke menu utama dalam {countdown} detik
            </Text>
            <View style={styles.timerProgress}>
              <View 
                style={[
                  styles.timerProgressBar, 
                  { width: `${(countdown / 10) * 100}%` }
                ]} 
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleBackToHome}
          >
            <Home size={20} color={getSuccessColor()} />
            <Text style={[styles.homeButtonText, { color: getSuccessColor() }]}>
              Kembali ke Menu Utama
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selfieContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  selfieImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F1F5F9',
  },
  selfieOverlay: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selfieLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  detailsContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  actionContainer: {
    gap: 20,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  timerProgress: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});