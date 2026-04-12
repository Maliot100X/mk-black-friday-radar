import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  Dimensions,
  Modal,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

// North Macedonia Real Deals
const HOT_DEALS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    store: 'Анатолија',
    originalPrice: 84990,
    discountPrice: 72990,
    discount: 14,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select',
    hot: true,
    endsIn: '02:45:30',
    rating: 4.9,
    reviews: 2847
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    store: 'Нептун',
    originalPrice: 74990,
    discountPrice: 64990,
    discount: 13,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/mk/2401/gallery/mk-galaxy-s24-ultra-sm-s928bztdgeo',
    hot: true,
    endsIn: '05:20:15',
    rating: 4.7,
    reviews: 1523
  },
  {
    id: 3,
    title: 'LG OLED TV 55" 4K',
    store: 'Сетек',
    originalPrice: 69990,
    discountPrice: 54990,
    discount: 21,
    image: 'https://www.lg.com/mk/images/tvs/md07565051/gallery/medium01.jpg',
    hot: true,
    endsIn: '12:00:00',
    rating: 4.8,
    reviews: 892
  },
  {
    id: 4,
    title: 'Nike Air Force 1',
    store: 'Спорт Визион',
    originalPrice: 6490,
    discountPrice: 4990,
    discount: 23,
    image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07',
    hot: true,
    endsIn: '03:15:00',
    rating: 4.9,
    reviews: 567
  },
  {
    id: 5,
    title: 'PlayStation 5 Console',
    store: 'Анатолија',
    originalPrice: 34990,
    discountPrice: 29990,
    discount: 14,
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
    hot: true,
    endsIn: '01:30:00',
    rating: 4.9,
    reviews: 3421
  }
];

const CATEGORIES = [
  { name: 'Сите', icon: '🔥' },
  { name: 'Електроника', icon: '📱' },
  { name: 'Мода', icon: '👕' },
  { name: 'Домаќинство', icon: '🏠' },
  { name: 'Спорт', icon: '⚽' },
];

// Format MKD price
const formatMKD = (price) => {
  return price.toLocaleString('mk-MK') + ' ден';
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('Сите');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      HOT_DEALS.forEach(deal => {
        const [hours, minutes, seconds] = deal.endsIn.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        // Decrement
        const currentTotal = totalSeconds - 1;
        if (currentTotal > 0) {
          const h = Math.floor(currentTotal / 3600);
          const m = Math.floor((currentTotal % 3600) / 60);
          const s = currentTotal % 60;
          newTimeLeft[deal.id] = 
            String(h).padStart(2, '0') + ':' + 
            String(m).padStart(2, '0') + ':' + 
            String(s).padStart(2, '0');
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle login
  const handleLogin = () => {
    setUser({ 
      full_name: 'Јован Јовановски', 
      email: 'jovan@example.com', 
      qr_code: 'MKBF-A7B9C2D4E8F1' 
    });
    setShowLogin(false);
    Alert.alert('Успешно!', 'Најавата е успешна!');
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    Alert.alert('Одјавен', 'Успешно се одјавивте!');
  };

  // Filter deals
  const filteredDeals = HOT_DEALS.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.store.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Home Screen
  const renderHome = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🔥</Text>
          </View>
          <View>
            <Text style={styles.logoText}>MK Black Friday</Text>
            <Text style={styles.logoSubtext}>🇲🇰 Северна Македонија</Text>
          </View>
        </View>
        
        {user ? (
          <TouchableOpacity onPress={handleLogout} style={styles.userButton}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowLogin(true)} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Најави се</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Пребарај понуди..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>Активни</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1,200+</Text>
          <Text style={styles.statLabel}>Продавници</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>AI Агенти</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {CATEGORIES.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === cat.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === cat.name && styles.categoryTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hot Deals Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Врели Понуди</Text>
        <Text style={styles.sectionSubtitle}>Завршуваат наскоро!</Text>
      </View>

      {/* Deals */}
      <View style={styles.dealsContainer}>
        {filteredDeals.map((deal) => (
          <View key={deal.id} style={styles.dealCard}>
            <View style={styles.dealImageContainer}>
              <Image source={{ uri: deal.image }} style={styles.dealImage} />
              {deal.hot && (
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>🔥 HOT</Text>
                </View>
              )}
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>⏰ {timeLeft[deal.id] || deal.endsIn}</Text>
              </View>
            </View>

            <View style={styles.dealContent}>
              <Text style={styles.storeText}>{deal.store}</Text>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              
              <View style={styles.ratingRow}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.ratingText}>{deal.rating}</Text>
                <Text style={styles.reviewsText}>({deal.reviews})</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>{formatMKD(deal.discountPrice)}</Text>
                <Text style={styles.originalPrice}>{formatMKD(deal.originalPrice)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{deal.discount}%</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.getDealButton}>
                <Text style={styles.getDealText}>Земи Понуда</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* User QR Code */}
      {user && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Твој Членски QR Код</Text>
          <View style={styles.qrBox}>
            <Text style={styles.qrCodeText}>{user.qr_code}</Text>
          </View>
          <Text style={styles.qrHelp}>Прикажи во продавница за попуст</Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Map Screen
  const renderMap = () => (
    <View style={styles.mapContainer}>
      <Text style={styles.mapEmoji}>🗺️</Text>
      <Text style={styles.mapTitle}>Мапа на Понуди</Text>
      <Text style={styles.mapSubtitle}>Пронајди понуди во твоја близина</Text>
      <Text style={styles.mapComing}>Наскоро достапно!</Text>
    </View>
  );

  // QR Screen
  const renderQR = () => (
    <View style={styles.qrScreenContainer}>
      <View style={styles.qrFrame}>
        <Text style={styles.qrFrameEmoji}>📷</Text>
        <Text style={styles.qrFrameText}>Скенирај QR Код</Text>
        <Text style={styles.qrFrameSubtext}>Прикажи го твојот членски код во продавница</Text>
      </View>
      
      {user ? (
        <View style={styles.memberQR}>
          <Text style={styles.memberQRTitle}>Твој Код:</Text>
          <View style={styles.memberQRBox}>
            <Text style={styles.memberQRCode}>{user.qr_code}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowLogin(true)} style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Најави се за да го видиш твојот QR код</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Profile Screen
  const renderProfile = () => (
    <ScrollView style={styles.scrollView}>
      {user ? (
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={styles.profileName}>{user.full_name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileCity}>📍 Скопје</Text>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>12</Text>
              <Text style={styles.profileStatLabel}>Зачувани</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>5</Text>
              <Text style={styles.profileStatLabel}>Искористени</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>8,450</Text>
              <Text style={styles.profileStatLabel}>Заштеда</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Одјави се</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInEmoji}>👤</Text>
          <Text style={styles.notLoggedInText}>Не си најавен</Text>
          <TouchableOpacity onPress={() => setShowLogin(true)} style={styles.loginButtonLarge}>
            <Text style={styles.loginButtonLargeText}>Најави се</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'map' && renderMap()}
      {currentScreen === 'qr' && renderQR()}
      {currentScreen === 'profile' && renderProfile()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]} 
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.navIcon, currentScreen === 'home' && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, currentScreen === 'home' && styles.navLabelActive]}>Почетна</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'map' && styles.navButtonActive]} 
          onPress={() => setCurrentScreen('map')}
        >
          <Text style={[styles.navIcon, currentScreen === 'map' && styles.navIconActive]}>🗺️</Text>
          <Text style={[styles.navLabel, currentScreen === 'map' && styles.navLabelActive]}>Мапа</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'qr' && styles.navButtonActive]} 
          onPress={() => setCurrentScreen('qr')}
        >
          <Text style={[styles.navIcon, currentScreen === 'qr' && styles.navIconActive]}>📷</Text>
          <Text style={[styles.navLabel, currentScreen === 'qr' && styles.navLabelActive]}>QR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]} 
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.navIcon, currentScreen === 'profile' && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, currentScreen === 'profile' && styles.navLabelActive]}>Профил</Text>
        </TouchableOpacity>
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLogin}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLogin(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isLogin ? 'Најави се' : 'Регистрирај се'}
            </Text>
            
            {!isLogin && (
              <TextInput
                style={styles.modalInput}
                placeholder="Име и презиме"
                placeholderTextColor="#9CA3AF"
              />
            )}
            
            <TextInput
              style={styles.modalInput}
              placeholder="Емаил"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Лозинка"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
            
            <TouchableOpacity onPress={handleLogin} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                {isLogin ? 'Најави се' : 'Регистрирај се'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.modalSwitch}>
                {isLogin ? 'Немаш сметка? Регистрирај се' : 'Веќе имаш сметка? Најави се'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowLogin(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  loginButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: '#DC2626',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  dealsContainer: {
    paddingHorizontal: 16,
  },
  dealCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  dealImageContainer: {
    height: 180,
    position: 'relative',
    backgroundColor: '#111827',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  hotBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 12,
  },
  dealContent: {
    padding: 16,
  },
  storeText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  dealTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  star: {
    color: '#FBBF24',
    fontSize: 14,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
  },
  reviewsText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currentPrice: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
  },
  originalPrice: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  getDealButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  getDealText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  qrSection: {
    margin: 16,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  qrTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  qrCodeText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  qrHelp: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingBottom: 8,
    paddingTop: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    color: '#DC2626',
  },
  navLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  navLabelActive: {
    color: '#DC2626',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapEmoji: {
    fontSize: 48,
  },
  mapTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  mapSubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 8,
  },
  mapComing: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 16,
  },
  qrScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrFrame: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
  },
  qrFrameEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  qrFrameText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
  },
  qrFrameSubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  memberQR: {
    marginTop: 32,
    alignItems: 'center',
  },
  memberQRTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  memberQRBox: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
  },
  memberQRCode: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  loginPrompt: {
    marginTop: 32,
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
  },
  loginPromptText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  profileContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#DC2626',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  profileCity: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  profileStat: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  profileStatNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileStatLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notLoggedIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notLoggedInEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  notLoggedInText: {
    color: '#9CA3AF',
    fontSize: 18,
    marginBottom: 24,
  },
  loginButtonLarge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonLargeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSwitch: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalCloseText: {
    color: '#9CA3AF',
    fontSize: 20,
  },
});
