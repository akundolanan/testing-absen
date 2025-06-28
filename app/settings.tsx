import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { ArrowLeft, Bell, Shield, Globe, Moon, Smartphone, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, User, Lock, Eye, Download } from 'lucide-react-native';
import { router } from 'expo-router';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            router.replace('/login');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: 'Akun',
      items: [
        {
          id: 'profile',
          title: 'Profil Saya',
          subtitle: 'Kelola informasi pribadi',
          icon: User,
          type: 'navigation',
          onPress: () => router.push('/profile')
        },
        {
          id: 'privacy',
          title: 'Privasi & Keamanan',
          subtitle: 'Pengaturan keamanan akun',
          icon: Shield,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        },
        {
          id: 'password',
          title: 'Ubah Password',
          subtitle: 'Perbarui kata sandi Anda',
          icon: Lock,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        }
      ]
    },
    {
      title: 'Notifikasi',
      items: [
        {
          id: 'notifications',
          title: 'Notifikasi Push',
          subtitle: 'Terima pemberitahuan penting',
          icon: Bell,
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
        {
          id: 'reminder',
          title: 'Pengingat Presensi',
          subtitle: 'Notifikasi jam masuk dan keluar',
          icon: Bell,
          type: 'toggle',
          value: true,
          onToggle: (value) => Alert.alert('Info', 'Pengaturan disimpan')
        }
      ]
    },
    {
      title: 'Tampilan',
      items: [
        {
          id: 'theme',
          title: 'Mode Gelap',
          subtitle: 'Aktifkan tema gelap',
          icon: Moon,
          type: 'toggle',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled
        },
        {
          id: 'language',
          title: 'Bahasa',
          subtitle: 'Indonesia',
          icon: Globe,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        }
      ]
    },
    {
      title: 'Keamanan',
      items: [
        {
          id: 'biometric',
          title: 'Autentikasi Biometrik',
          subtitle: 'Login dengan sidik jari/wajah',
          icon: Eye,
          type: 'toggle',
          value: biometricEnabled,
          onToggle: setBiometricEnabled
        },
        {
          id: 'auto-lock',
          title: 'Kunci Otomatis',
          subtitle: 'Kunci aplikasi saat tidak aktif',
          icon: Smartphone,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        }
      ]
    },
    {
      title: 'Data',
      items: [
        {
          id: 'backup',
          title: 'Backup Otomatis',
          subtitle: 'Cadangkan data secara otomatis',
          icon: Download,
          type: 'toggle',
          value: autoBackupEnabled,
          onToggle: setAutoBackupEnabled
        },
        {
          id: 'export',
          title: 'Ekspor Data',
          subtitle: 'Unduh data presensi Anda',
          icon: Download,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        }
      ]
    },
    {
      title: 'Bantuan',
      items: [
        {
          id: 'help',
          title: 'Pusat Bantuan',
          subtitle: 'FAQ dan panduan penggunaan',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fitur akan segera tersedia')
        },
        {
          id: 'about',
          title: 'Tentang Aplikasi',
          subtitle: 'Versi 1.0.0',
          icon: Info,
          type: 'navigation',
          onPress: () => Alert.alert('Kenoo', 'Aplikasi Presensi Digital\nVersi 1.0.0\n\n© 2025 PT Inspirasi Aksara Digital')
        }
      ]
    },
    {
      title: 'Aksi',
      items: [
        {
          id: 'logout',
          title: 'Keluar',
          subtitle: 'Keluar dari akun Anda',
          icon: LogOut,
          type: 'action',
          color: '#EF4444',
          onPress: handleLogout
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingItemLeft}>
          <View style={[
            styles.settingIcon,
            { backgroundColor: `${item.color || '#14B8A6'}20` }
          ]}>
            <IconComponent size={20} color={item.color || '#14B8A6'} />
          </View>
          <View style={styles.settingText}>
            <Text style={[
              styles.settingTitle,
              item.color && { color: item.color }
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E5E7EB', true: '#14B8A6' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          ) : (
            <ChevronRight size={20} color="#CBD5E1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Settings Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.itemSeparator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Kenoo</Text>
          <Text style={styles.appVersion}>Versi 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 PT Inspirasi Aksara Digital</Text>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  settingRight: {
    marginLeft: 12,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  appCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});