import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { ActivityIndicator } from 'react-native';

export default function IndividualDash() {
  const router = useRouter();
  const [totalWorkers, setTotalWorkers] = useState(0); // Store the total workers
  const [loading, setLoading] = useState(false); // To control the loading state

  // Function to fetch the total number of workers
  const fetchTotalWorkers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.5:5000/api/workers/list');
      const data = await response.json();
      setTotalWorkers(data.length);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total workers whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTotalWorkers();
    }, [])
  );

  // Handle navigation to worker list after fetching data
  const goToWorkerList = () => {
    router.push('/workerlist');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
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
          <Text style={styles.navTitle}>Dashboard</Text>
          <Ionicons name="notifications" size={24} color="white" />
        </LinearGradient>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
              style={styles.profileImageGradient}
            >
              <Ionicons name="person" size={50} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.greeting}>Hi, there</Text>
          <Text style={styles.welcome}>Welcome back</Text>
        </View>

        <View style={styles.cardSection}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.cardWrapper} onPress={goToWorkerList}>
              <LinearGradient
                colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
                style={styles.card}
              >
                <Ionicons name="people" size={50} color="black" />
                <Text style={styles.cardText}>TOTAL WORKER</Text>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.cardText2}>{totalWorkers}</Text> // Display total workers
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardWrapper} onPress={() => router.push('/addworker')}>
              <LinearGradient
                colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
                style={styles.card}
              >
                <Ionicons name="add-circle" size={50} color="black" />
                <Text style={styles.cardText}>ADD WORKER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.cardWrapper}>
              <LinearGradient
                colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
                style={styles.card}
              >
                <Ionicons name="briefcase" size={50} color="black" />
                <Text style={styles.cardText}>CREATE JOBS</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardWrapper} onPress={() => router.push('/myaccount')}>
              <LinearGradient
                colors={['#f3ae0a', '#f3ae0a', '#f3830a']}
                style={styles.card}
              >
                <Ionicons name="person-circle" size={50} color="black" />
                <Text style={styles.cardText}>MY ACCOUNT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 30,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    paddingTop: 20,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileImageGradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  welcome: {
    fontSize: 16,
    color: 'white',
  },
  cardSection: {
    width: '80%',
    alignItems: 'center',
    marginTop: 0,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  cardWrapper: {
    width: '45%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  card: {
    borderRadius: 10,
    height: 130,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  cardImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  cardText: {
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardText2: {
    marginTop: 5,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cancelButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '90%',
    marginTop: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
