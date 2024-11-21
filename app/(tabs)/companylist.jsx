import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, TextInput, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function CompanyList() {
  const router = useRouter();

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
          <Text style={styles.navTitle}>Company List</Text>
          <Ionicons name="notifications" size={24} color="white" />
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Company..."
              placeholderTextColor="black"
            />
            <Ionicons name="search" size={24} color="#aaa" style={styles.searchIcon} />
          </View>

          <View style={styles.cardSection}>
            {Array(5).fill().map((_, index) => (
              <View style={styles.card} key={index}>
                <View style={styles.cardContent}>
                  <View style={styles.profileImage}>
                    {/* Ensure this is a Text component */}
                    <Text style={styles.profileInitials}>{`C${index + 1}`}</Text>
                  </View>
                  
                  <View style={styles.cardInfo}>
                    {/* Ensure all values are wrapped in Text components */}
                    <Text style={styles.cardText}>{`Name: Company ${index + 1}`}</Text>
                    <Text style={styles.cardText}>{`Company ID: 12345${index + 1}`}</Text>
                    <Text style={styles.cardText}>Contact: 555-1234</Text>
                    <Text style={styles.cardText}>Status: Active</Text>
                  </View>

                  <View style={styles.smallImagesContainer}>
                    <TouchableOpacity>
                      <Image
                        source={require('@/assets/images/edit.png')}
                        style={styles.smallImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image
                        source={require('@/assets/images/delete.png')}
                        style={styles.smallImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,  // Space for the status bar
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    paddingTop: 20,  // Adjusted for status bar
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center', // Center the content in the scrollview
    paddingBottom: 20, // Ensure there's space at the bottom
  },
  searchContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9d34a',  // Light gray background for search bar
    borderRadius: 25,
    paddingLeft: 20,
    marginTop: 30, // Adjusted for center positioning
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 20,
  },
  cardSection: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f9d34a',  // background for the cards
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',  // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInitials: {
    fontSize: 24,
    color: '#fff',  // White color for the initials
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  smallImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
