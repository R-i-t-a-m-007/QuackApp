import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    password: '',
    userType: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameExistsModal, setUsernameExistsModal] = useState(false);
  const [emailExistsModal, setEmailExistsModal] = useState(false);

  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      password: '',
      userType: ''
    });
    setErrors({});
  }, []);

  const handleUserTypeSelection = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      userType: type
    }));
    setErrors((prevData) => ({
      ...prevData,
      userType: '' // Clear the error when a user type is selected
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevState) => ({ ...prevState, [field]: '' }));
  };

  const validateFields = () => {
    const newErrors = {};

    // Validate required fields
    Object.keys(formData).forEach((field) => {
      if (field !== 'userType' && !formData[field]) {
        newErrors[field] = 'Please enter this field';
      }
    });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate phone to allow only numbers
    const phoneRegex = /^[0-9]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate password length
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate userType
    if (!formData.userType) {
      newErrors.userType = 'Please select a user type';
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.5:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
  
      if (response.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/login');
        }, 2000);
      } else {
        if (data.message === 'Username already exists.') {
          setUsernameExistsModal(true);
          // Hide the modal after 2 seconds
          setTimeout(() => {
            setUsernameExistsModal(false);
          }, 2000);
        } else if (data.message === 'Email already exists.') {
          setEmailExistsModal(true);
          // Hide the modal after 2 seconds
          setTimeout(() => {
            setEmailExistsModal(false);
          }, 2000);
        } else {
          setErrorMessage(data.message || 'Registration failed. Please check your details.');
          setErrorModalVisible(true);
        }
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      setErrorModalVisible(true);
    }
  };
  

  return (
    <ImageBackground 
      source={require('@/assets/images/main-bg.jpg')} 
      style={styles.container} 
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={require('@/assets/images/logo-with-glow-new.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        
        <Text style={styles.registerText}>REGISTRATION</Text>
        <View style={styles.underline} />
        <Text style={styles.signUpText}>I want to sign up</Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            onPress={() => handleUserTypeSelection('company')}
            style={[
              styles.cardWrapper,
              formData.userType === 'company' && styles.selectedCard
            ]}
          >
            <LinearGradient 
              colors={['#f3ae0a', '#f3ae0a', '#f3830a']} 
              style={styles.card}
            >
              <Image 
                source={require('@/assets/images/company-icon.png')} 
                style={styles.cardImage} 
              />
              <Text style={styles.cardText}>AS A COMPANY</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleUserTypeSelection('individual')}
            style={[
              styles.cardWrapper,
              formData.userType === 'individual' && styles.selectedCard
            ]}
          >
            <LinearGradient 
              colors={['#f3ae0a', '#f3ae0a', '#f3830a']} 
              style={styles.card}
            >
              <Image 
                source={require('@/assets/images/individual-icon.png')} 
                style={styles.cardImage} 
              />
              <Text style={styles.cardText}>AS AN INDIVIDUAL</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {errors.userType && (
          <Text style={styles.errorText}>{errors.userType}</Text>
        )}

        {['username', 'email', 'phone', 'address', 'postcode'].map((field, index) => (
          <View style={styles.inputContainer} key={index}>
            <Ionicons 
              name={field === 'username' ? 'person' : 
                    field === 'email' ? 'mail' : 
                    field === 'phone' ? 'call' : 
                    field === 'address' ? 'location' : 'home'} 
              size={20} 
              color="white" 
              style={styles.icon} 
            />
            <TextInput
              style={[styles.input, errors[field] && styles.inputError]}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholderTextColor="white"
              value={formData[field]}
              onChangeText={(text) => handleInputChange(field, text)}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Ionicons 
            name="lock-closed" 
            size={20} 
            color="white" 
            style={styles.icon} 
          />
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="white"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Modal 
          transparent={true} 
          visible={showSuccessModal} 
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Registration Successful!</Text>
            </View>
          </View>
        </Modal>

        <Modal 
          transparent={true} 
          visible={errorModalVisible} 
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{errorMessage}</Text>
            </View>
          </View>
        </Modal>

        <Modal transparent={true} visible={usernameExistsModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Username already exists!</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={emailExistsModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Email already exists!</Text>
          </View>
        </View>
      </Modal>

      </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  scrollViewContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
     paddingTop: 40, 
    paddingBottom: 40, 
    alignItems: 'center' 
  },
  logo: { 
    width: 140, 
    height: 120, 
    marginBottom: 20 
  },
  registerText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 5 
  },
  underline: { 
    width: 30, 
    height: 2, 
    backgroundColor: '#fff', 
    marginBottom: 20 
  },
  signUpText: { 
    fontSize: 18, 
    fontWeight: 'normal', 
    color: '#fff', 
    marginBottom: 20 
  },
  cardsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 20, 
    width: '90%', 
    marginBottom: 20,
  },
  cardWrapper: { 
    flex: 1, 
    margin: 5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10, 
  },
  selectedCard: { 
    borderWidth: 2, 
    borderColor: 'white',
    borderRadius: 10 
  },
  card: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
    height: 140,

    borderRadius: 10, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5 
  },
  cardImage: { 
    width: 100, 
    height: 100, 
    marginBottom: 10 
  },
  cardText: { 
    fontSize: 12, 
    color: 'black', 
    fontWeight: 'bold' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginVertical: 5, 
    width: '90%', 
    height: 50 
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: 'white' 
  },
  inputError: { 
    borderColor: 'red', 
    borderWidth: 1 
  },
  errorText: { 
    color: 'red', 
    fontSize: 12, 
    marginTop: 5,
    marginBottom:5, 
    marginLeft: 15 
  },
  button: { 
    backgroundColor: '#000', 
    borderRadius: 25, 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    alignItems: 'center', 
    marginTop: 20, 
    width: '90%' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  signInContainer: { 
    flexDirection: 'row', 
    marginTop: 20 
  },
  signInText: { 
    color: '#000' 
  },
  signInLink: { 
    color: '#000', 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'green' 
  },
  modalButton: { 
    backgroundColor: 'red', 
    padding: 10, 
    marginTop: 10, 
    borderRadius: 5 
  },
  modalButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});