import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function AddCompany() {
  const router = useRouter();
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ImageBackground
          source={require('@/assets/images/main-bg.jpg')}
          style={styles.container}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
            style={styles.navbar}
          >
            <TouchableOpacity onPress={() => router.push('/agencydash')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Add Company</Text>
            <Ionicons name="notifications" size={24} color="white" />
          </LinearGradient>

          <ScrollView 
            style={styles.formContainer}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="white"
                keyboardType="phone-pad"
              />
            </View>

            {/* Address Input with Location Icon on the Right */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="white"
              />
              <Ionicons 
                name="location-outline" 
                size={20} 
                color="white" 
                style={styles.inputIconRight} 
              />
            </View>

            {/* Country Select Input with Down Arrow Icon on the Right */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select Country"
                placeholderTextColor="white"
                editable={false}
              />
              <Ionicons 
                name="chevron-down" 
                size={20} 
                color="white" 
                style={styles.inputIconRight} 
              />
            </View>

            <View style={styles.cityPostcodeRow}>
              <View style={styles.cityInputContainer}>
                <TextInput
                  style={[styles.input, styles.cityPostcodeInput]}
                  placeholder="City"
                  placeholderTextColor="white"
                />
              </View>

              <View style={styles.postcodeInputContainer}>
                <TextInput
                  style={[styles.input, styles.cityPostcodeInput]}
                  placeholder="Postcode"
                  placeholderTextColor="white"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    paddingTop: 50,  // Increased to push content down
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    marginTop:40
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingLeft: 20,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 16,
  },
  inputIconRight: {
    position: 'absolute',
    right: 15,  // Place icons on the right end
    zIndex: 1,
  },
  cityPostcodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cityInputContainer: {
    flex: 1,
    marginRight: 10,
    position: 'relative',
  },
  postcodeInputContainer: {
    flex: 1,
    position: 'relative',
  },
  cityPostcodeInput: {
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
