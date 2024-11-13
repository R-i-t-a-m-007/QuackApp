import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PackageScreen() {
  const router = useRouter(); // Initialize router for navigation
  const scrollViewRef = useRef(); // Reference to the ScrollView

  const packages = [
    {
      title: 'Basic Version',
      price: '€14.95/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    },
    {
      title: 'Premium Version',
      price: '€29.95/month',
      features: ['Feature A', 'Feature B', 'Feature C', 'Feature D']
    }
  ];

  // Function to handle navigation to the Register screen
  const handleRegisterNow = () => {
    router.push('/register'); // Navigates to the Register screen
  };

  useEffect(() => {
    // Scroll to the top when the page is loaded
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/main-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
        {/* Logo and Heading */}
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/logonew.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Packages</Text>
          <View style={styles.underline} />
        </View>

        {/* Slidable Cards */}
        <FlatList
          data={packages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
              {/* Card Body */}
              <View style={styles.cardBody}>
                {item.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="black" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.buttonText}>Select Package</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.carouselContainer} // Center first card on the screen
        />

        {/* Note Section */}
        <Text style={styles.noteText}>
          <Text style={styles.noteBold}>Note:</Text> This is a three-line paragraph that serves as a note below the cards. You can customize this text as needed.
        </Text>

        {/* Register Now Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterNow}>
          <Text style={styles.registerButtonText}>Register Now</Text>
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
    elevation: 5
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
    color: 'white'
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5
  },
  cardBody: {
    padding: 15,
    alignItems: 'center'
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
