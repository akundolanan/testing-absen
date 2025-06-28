import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/context/AttendanceContext';

interface ClockInOutButtonProps {
  type: 'in' | 'out';
}

export default function ClockInOutButton({ type }: ClockInOutButtonProps) {
  const { currentStatus } = useAttendance();

  const handlePress = () => {
    router.push('/selfie');
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        type === 'in' ? styles.clockInButton : styles.clockOutButton
      ]}
      onPress={handlePress}
    >
      <Camera size={24} color="#FFFFFF" />
      <Text style={styles.buttonText}>
        Clock {type === 'in' ? 'In' : 'Out'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 140,
    gap: 10,
  },
  clockInButton: {
    backgroundColor: '#10B981',
  },
  clockOutButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});