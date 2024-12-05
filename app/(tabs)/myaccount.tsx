import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyAccount() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user details on component load
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://192.168.1.5:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
    
        const data = await response.json();
        
        if (response.ok) {
          setUserDetails(data.user);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching user data');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await fetch('http://192.168.1.5:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
              });
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'There was an issue logging out.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('@/assets/images/main-bg.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Fixed Navbar - No longer part of ScrollView */}
        <LinearGradient
          colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
          style={styles.navbar}
        >
          <TouchableOpacity onPress={() => router.push('/agencydash')}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>My Account</Text>
          <Ionicons name="person" size={24} color="white" />
        </LinearGradient>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#f3ae0a" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                  <LinearGradient
                    colors={['#f3ae0a', '#f3830a']}
                    style={styles.profileImageGradient}
                  >
                    <Ionicons name="person" size={70} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.greeting}>Hi, {userDetails.username || 'User '}</Text>
                <Text style={styles.welcome}>Welcome to your profile</Text>
              </View>

              <View style={styles.detailsSection}>
                <DetailCard label="Name" value={userDetails.username || 'N/A'} icon="person" />
                <DetailCard label="Email" value={userDetails.email || 'N/A'} icon="mail" />
                <DetailCard label="Phone" value={userDetails.phone || 'N/A'} icon="call" />
                <DetailCard label="Address" value={userDetails.address || 'N/A'} icon="location" />
                <DetailCard label="Postcode" value={userDetails.postcode || 'N/A'} icon="home" />
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const DetailCard = ({ label, value, icon }) => (
  <View style={styles.detailCard}>
    <Ionicons name={icon} size={24} color="#f3ae0a" style={styles.icon} />
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 30,

  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 0,
    backgroundColor: 'transparent',
    padding: 20,
  },
  profileImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  welcome: {
    fontSize: 18,
    color: '#555',
  },
  detailsSection: {
    width: '100%',
    marginVertical: 0,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 0,
    marginBottom:20
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});