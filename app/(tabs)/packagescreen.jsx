import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PackageScreen() {
  const router = useRouter();
  const scrollViewRef = useRef();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userType, setUserType] = useState(null); // State to store userType

  const packages = [
    {
      id: 1,
      title: 'Basic Version',
      price: 14.95,
      features: ['One Company', 'One Login', 'One Department', 'One Set of Workers'],
    },
    {
      id: 2,
      title: 'Premium Version',
      price: 29.95,
      features: ['Many Companies', 'Many Logins', 'Many Departments', 'Multiple Worker Sets'],
    },
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    // Fetch session data to get userType
    const fetchSessionData = async () => {
      try {
        const response = await fetch('http://192.168.1.5:5000/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Ensures session cookie is sent
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session data.');
        }

        const data = await response.json();
        setUserType(data.userType); // Set userType from session
      } catch (error) {
        console.error('Error fetching session data:', error);
        Alert.alert('Error', 'Failed to fetch session data.');
      }
    };

    fetchSessionData();
  }, []);

  const handleSelectPackage = (pkgId) => {
    setSelectedPackage(pkgId);
  };

  const handleNext = () => {
    if (!selectedPackage) {
      Alert.alert('No Package Selected', 'Please select a package before proceeding.');
      return;
    }

    if (userType === 'individual' && selectedPackage === 2) {
      Alert.alert(
        'Restricted Access',
        'This feature is available only with the Premium Version for companies.'
      );
    } else {
      router.push('/agencydash');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/main-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/logonew.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Packages</Text>
          <View style={styles.underline} />
        </View>

        <FlatList
          data={packages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, selectedPackage === item.id && styles.selectedCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPrice}>€{item.price.toFixed(2)}/month</Text>
              </View>
              <View style={styles.cardBody}>
                {item.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="black" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.selectButton, selectedPackage === item.id && styles.selectedButton]}
                  onPress={() => handleSelectPackage(item.id)}
                >
                  <Text style={styles.buttonText}>Select Package</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.carouselContainer}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleNext}>
          <Text style={styles.registerButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40, // Adjusted the paddingTop to reduce excessive gap
    backgroundColor: '#f0f0f0'
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10, // Ensure there's space at the top and bottom
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 5, // Reduced margin to bring logo closer
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  underline: {
    width: 60,
    height: 2,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  carouselContainer: {
    alignItems: 'center',
    paddingVertical: 0, // Reduced vertical padding to close the gap
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 250,
    height: 300,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 0, // Default no border
    borderColor: 'white' // Default border color
  },
  selectedCard: {
    borderWidth: 2, // Add border when selected
    borderColor: 'white', // White border for selected package
    borderRadius: 10,
  },
  cardHeader: {
    backgroundColor: '#d94e04',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  cardBody: {
    padding: 15,
    alignItems: 'start'
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: 'black'
  },
  selectButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '100%'
  },
  selectedButton: {
    backgroundColor: 'gray', // Change button color when selected
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  noteText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  noteBold: {
    fontWeight: 'bold'
  },
  registerButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '90%',
    marginBottom: 20
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
