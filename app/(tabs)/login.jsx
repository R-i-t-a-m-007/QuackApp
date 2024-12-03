import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert, Modal, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const { height, width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null); // For user type selection
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleLogin = async () => {
    if (!userType) {
      Alert.alert('Error', 'Please select a user type.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.5:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, userType }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login Successful', `Welcome back, ${username}!`);
        router.push('/packagescreen');
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/main-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/logo-with-glow-new.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.loginText}>LOGIN</Text>
          <View style={styles.underline} />

          {/* User Type Selection */}
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={[
                styles.cardWrapper,
                userType === 'company' ? styles.cardSelected : null,
              ]}
              onPress={() => setUserType('company')}
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
              style={[
                styles.cardWrapper,
                userType === 'individual' ? styles.cardSelected : null,
              ]}
              onPress={() => setUserType('individual')}
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

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="white"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal for Login Failure */}
      <Modal
        transparent={true}
        visible={showErrorModal}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Invalid Username or Password</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  keyboardContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
    alignSelf: 'center',
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'center',
  },
  underline: {
    width: 30,
    height: 2,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  cardContainer: {
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
  cardSelected: {
    borderWidth: 2, 
    borderColor: 'white',
    borderRadius: 10 
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
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#000',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  modalText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FF0000',
    textAlign: 'center',
  },
  modalButton: { 
    backgroundColor: '#FF0000', 
    borderRadius: 5, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

