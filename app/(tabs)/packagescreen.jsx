import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  ImageBackground, 
  Image, 
  ScrollView, 
  Alert,
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native'; // Import Stripe SDK

const PackageScreen = () => {
  const router = useRouter();
  const scrollViewRef = useRef();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Initialize Stripe hooks
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for button

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

  // Fetch session data on component mount
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    const fetchSessionData = async () => {
      try {
        const response = await fetch('http://192.168.1.5:5000/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session data.');
        }

        const data = await response.json();
        setUserType(data.userType); // Set user type based on session
      } catch (error) {
        console.error('Error fetching session data:', error);
        Alert.alert('Error', 'Failed to fetch session data.');
      }
    };

    fetchSessionData();
  }, []);

  // Handle selecting a package
  const handleSelectPackage = (pkgId) => {
    setSelectedPackage(pkgId);
  };

  // Create a Payment Intent and initialize PaymentSheet
  // Example: Log clientSecret on frontend for debugging
const initializePaymentSheet = async (priceId) => {
  setLoading(true);
  try {
    const response = await fetch('http://192.168.1.5:5000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const { clientSecret } = await response.json();
    console.log('Received clientSecret:', clientSecret); // Log clientSecret for debugging

    if (!clientSecret) {
      throw new Error('PaymentIntent client secret is missing.');
    }

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      returnURL: Linking.openURL('/agencydash'), // May need to change this URL depending on your setup
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    openPaymentSheet();
  } catch (error) {
    console.error('Error initializing payment sheet:', error);
    Alert.alert('Error', 'Unable to process payment at the moment.');
    setLoading(false);
  }
};


  // Present the Payment Sheet
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Payment successful!');
      router.push('/agencydash'); // Navigate to confirmation page (or other logic)
    }
  };

  // Handle Next button press
  const handleNext = async () => {
    if (!selectedPackage) {
      Alert.alert('No Package Selected', 'Please select a package before proceeding.');
      return;
    }

    if (userType === 'individual' && selectedPackage === 2) {
      Alert.alert(
        'Restricted Access',
        'Premium Version is available only for companies. Please choose the Basic Version.'
      );
      return;
    }

    const priceId =
      selectedPackage === 1
        ? 'price_1QU1Mq02CrK5yqCqx9csNo64' // Replace with Stripe Price ID for Basic
        : 'price_1QU1Nt02CrK5yqCqi9yehdop'; // Replace with Stripe Price ID for Premium

    initializePaymentSheet(priceId); // Initialize and show the payment sheet
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

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'Processing...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default PackageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40, 
    backgroundColor: '#f0f0f0'
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10, 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 5, 
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
    paddingVertical: 0, 
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
    borderWidth: 0, 
    borderColor: 'white' 
  },
  selectedCard: {
    borderWidth: 2, 
    borderColor: 'white',
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
    backgroundColor: 'gray', 
  },
  buttonText: {
    color: 'white',
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