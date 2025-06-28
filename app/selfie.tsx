import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image,
  Modal,
  Platform
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  X,
  MapPin,
  Clock,
  Loader
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/context/AttendanceContext';

export default function SelfieScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const { currentStatus, clockIn, clockOut } = useAttendance();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      if (!locationPermission?.granted) {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') {
          setCurrentLocation({
            latitude: -6.2088,
            longitude: 106.8456,
            address: 'Jakarta Office, Indonesia (Default)'
          });
          setLocationLoading(false);
          return;
        }
      }

      if (Platform.OS === 'web') {
        // For web platform, use default location
        setCurrentLocation({
          latitude: -6.2088,
          longitude: 106.8456,
          address: 'Jakarta Office, Indonesia'
        });
      } else {
        // For mobile platforms
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const address = reverseGeocode[0] 
          ? `${reverseGeocode[0].street || ''} ${reverseGeocode[0].city || ''}, ${reverseGeocode[0].country || ''}`.trim()
          : 'Unknown Location';

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address
        });
      }
    } catch (error) {
      console.log('Location error:', error);
      setCurrentLocation({
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jakarta Office, Indonesia (Default)'
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Camera size={48} color="#14B8A6" />
          </View>
          <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
          <Text style={styles.permissionMessage}>
            Aplikasi memerlukan akses kamera untuk mengambil foto presensi Anda
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Berikan Izin Kamera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && isCameraReady) {
      try {
        setIsCapturing(true);
        
        // Add a small delay to ensure camera is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          setShowConfirmModal(true);
        } else {
          Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
        }
      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleConfirmAttendance = async () => {
    if (!capturedImage || !currentLocation || isProcessing) return;

    try {
      setIsProcessing(true);
      
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Close modal first
      setShowConfirmModal(false);
      setCapturedImage(null);

      // Process attendance
      if (currentStatus === 'clocked-out') {
        clockIn(currentTime, currentLocation, capturedImage);
      } else {
        clockOut(currentTime, currentLocation, capturedImage);
      }

      // Navigate to success screen with proper parameters
      router.replace({
        pathname: '/attendance-success',
        params: {
          type: currentStatus === 'clocked-out' ? 'in' : 'out',
          time: currentTime,
          date: currentDate,
          location: currentLocation.address,
          selfieUrl: capturedImage
        }
      });

    } catch (error) {
      console.error('Attendance error:', error);
      Alert.alert('Error', 'Gagal menyimpan presensi. Silakan coba lagi.');
      setShowConfirmModal(false);
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowConfirmModal(false);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getActionColor = () => {
    return currentStatus === 'clocked-out' ? '#10B981' : '#EF4444';
  };

  const getActionText = () => {
    return currentStatus === 'clocked-out' ? 'Absen Masuk' : 'Absen Keluar';
  };

  return (
    <View style={styles.container}>
      {/* Compact Header with Info */}
      <View style={[styles.header, { backgroundColor: getActionColor() }]}>
        {/* Control Buttons Row with Time/Date in Center */}
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Time and Date in Center */}
          <View style={styles.centerTimeContainer}>
            <View style={styles.timeRow}>
              <Clock size={16} color="#FFFFFF" />
              <Text style={styles.timeText}>{getCurrentTime()}</Text>
            </View>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>
          
          {/* Empty space to balance layout */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Status Badge Only */}
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {getActionText()}
            </Text>
          </View>
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
          onCameraReady={handleCameraReady}
        >
          {/* Camera Overlay */}
          <View style={styles.cameraOverlay}>
            {/* Face Guide - Positioned Higher */}
            <View style={styles.faceGuideContainer}>
              <View style={[styles.faceFrame, { borderColor: getActionColor() }]} />
              <View style={styles.guideWidget}>
                <Text style={styles.guideText}>
                  Posisikan wajah Anda di dalam frame
                </Text>
                <Text style={styles.guideSubtext}>
                  Wajah harus terlihat jelas dan cukup cahaya
                </Text>
              </View>
            </View>

            {/* Capture Button */}
            <View style={styles.captureContainer}>
              <TouchableOpacity 
                style={[
                  styles.captureButton, 
                  { 
                    borderColor: getActionColor(),
                    opacity: (isCapturing || locationLoading || !isCameraReady) ? 0.7 : 1 
                  }
                ]}
                onPress={takePicture}
                disabled={locationLoading || isCapturing || !isCameraReady}
              >
                <View style={[styles.captureButtonInner, { backgroundColor: getActionColor() }]}>
                  {isCapturing ? (
                    <Loader size={32} color="#FFFFFF" />
                  ) : (
                    <Camera size={32} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
              
              {/* Capture Status Text */}
              {isCapturing && (
                <Text style={styles.capturingText}>Mengambil foto...</Text>
              )}
              {!isCameraReady && !isCapturing && (
                <Text style={styles.capturingText}>Mempersiapkan kamera...</Text>
              )}
            </View>
          </View>
        </CameraView>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { backgroundColor: getActionColor() }]}>
            <Text style={styles.modalTitle}>Konfirmasi {getActionText()}</Text>
          </View>

          <View style={styles.modalContent}>
            {capturedImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageLabel}>Foto Presensi</Text>
                </View>
              </View>
            )}
            
            <View style={styles.confirmInfo}>
              <Text style={[styles.confirmTitle, { color: getActionColor() }]}>
                {getActionText()}
              </Text>
              <View style={styles.confirmDetails}>
                <View style={styles.confirmRow}>
                  <View style={[styles.confirmIcon, { backgroundColor: `${getActionColor()}20` }]}>
                    <Clock size={16} color={getActionColor()} />
                  </View>
                  <View style={styles.confirmTextContainer}>
                    <Text style={styles.confirmLabel}>Waktu</Text>
                    <Text style={styles.confirmValue}>{getCurrentTime()}</Text>
                  </View>
                </View>
                
                <View style={styles.confirmRow}>
                  <View style={styles.confirmIcon}>
                    <MapPin size={16} color="#64748B" />
                  </View>
                  <View style={styles.confirmTextContainer}>
                    <Text style={styles.confirmLabel}>Lokasi</Text>
                    <Text style={styles.confirmValue} numberOfLines={2}>
                      {currentLocation?.address || 'Lokasi tidak tersedia'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={handleRetake}
                disabled={isProcessing}
              >
                <X size={20} color="#EF4444" />
                <Text style={styles.retakeButtonText}>Ambil Ulang</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton, 
                  { 
                    backgroundColor: getActionColor(),
                    opacity: isProcessing ? 0.7 : 1
                  }
                ]}
                onPress={handleConfirmAttendance}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader size={20} color="#FFFFFF" />
                ) : (
                  <Check size={20} color="#FFFFFF" />
                )}
                <Text style={styles.confirmButtonText}>
                  {isProcessing ? 'Memproses...' : 'Konfirmasi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxWidth: 320,
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Compact Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 36,
    height: 36,
  },
  centerTimeContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  faceGuideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  faceFrame: {
    width: 200,
    height: 260,
    borderRadius: 100,
    borderWidth: 4,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  guideWidget: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: 260,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  guideSubtext: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 12,
  },
  captureContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  imageLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  confirmInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmDetails: {
    gap: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  confirmIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTextContainer: {
    flex: 1,
  },
  confirmLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  confirmValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});