import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function CompanyList() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyCountry, setCompanyCountry] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyPostcode, setCompanyPostcode] = useState('');

  // Fetch companies from the backend
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.5:5000/api/companies/list');
      const data = await response.json();
      if (response.ok) {
        setCompanies(data);
      } else {
        console.error('Error fetching companies:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async () => {
    try {
      const updatedCompany = {
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        country: companyCountry,
        city: companyCity,
        postcode: companyPostcode,
      };

      const response = await fetch(`http://192.168.1.5:5000/api/companies/${selectedCompany._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompany),
      });

      if (response.ok) {
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company._id === selectedCompany._id ? { ...company, ...updatedCompany } : company
          )
        );
        setSuccessMessage("Company updated successfully!");
        setSuccessType('update');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        setSelectedCompany(null);
      } else {
        const data = await response.json();
        console.error('Error updating company:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(`http://192.168.1.5:5000/api/companies/${companyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompanies((prevCompanies) => prevCompanies.filter((company) => company._id !== companyId));
        setSuccessMessage("Company deleted successfully!");
        setSuccessType('delete');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
 } else {
        const data = await response.json();
        console.error('Error deleting company:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCompanies();
    }, [])
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Company..."
            placeholderTextColor="#000" // Ensure placeholder is visible
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={24} color="#aaa" style={styles.searchIcon} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f3ae0a" />
            <Text style={styles.loadingText}>Loading companies...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false} // Remove scrollbar
          >
            <View style={styles.cardSection}>
              {filteredCompanies.map((company) => (
                <View style={styles.card} key={company._id}>
                  <View style={styles.cardContent}>
                    <View style={styles.profileImage}>
                      <Text style={styles.profileInitials}>{company.name[0]?.toUpperCase()}</Text>
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardText}>Name: {company.name}</Text>
                      <Text style={styles.cardText}>Company ID: {company.email}</Text>
                      <Text style={styles.cardText}>Contact: {company.phone}</Text>
                      <Text style={styles.cardText}>Status: Active</Text>
                    </View>

                    <View style={styles.smallImagesContainer}>
                      <TouchableOpacity onPress={() => {
                        setSelectedCompany(company);
                        setCompanyName(company.name);
                        setCompanyEmail(company.email);
                        setCompanyPhone(company.phone);
                        setCompanyAddress(company.address);
                        setCompanyCountry(company.country);
                        setCompanyCity(company.city);
                        setCompanyPostcode(company.postcode);
                      }}>
                        <Image
                          source={require('@/assets/images/edit.png')}
                          style={styles.smallImage}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => {
                        setCompanyToDelete(company._id);
                        setShowConfirmModal(true);
                      }}>
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
        )}

        {selectedCompany && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={!!selectedCompany}
            onRequestClose={() => setSelectedCompany(null)}
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  value={companyName}
                  onChangeText={setCompanyName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Company Email"
                  value={companyEmail}
                  onChangeText={setCompanyEmail}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Company Phone"
                  value={companyPhone}
                  onChangeText={setCompanyPhone}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Company Address"
                  value={companyAddress}
                  onChangeText={setCompanyAddress} />
                <TextInput
                  style={styles.input}
                  placeholder="Company Country"
                  value={companyCountry}
                  onChangeText={setCompanyCountry}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={companyCity}
                  onChangeText={setCompanyCity}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Postcode"
                  value={companyPostcode}
                  onChangeText={setCompanyPostcode}
                  keyboardType="number-pad"
                />
                <TouchableOpacity onPress={updateCompany} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}

        {showSuccessModal && (
          <Animatable.View
            style={styles.successModal}
            animation="fadeIn"
            duration={500}
            useNativeDriver
          >
            <View style={styles.successModalContent}>
              <Text style={styles.successModalText}>{successMessage}</Text>
            </View>
          </Animatable.View>
        )}

        {showConfirmModal && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.confirmationContent}>
                <Text style={styles.confirmationText}>Are you sure you want to delete this company?</Text>
                <View style={styles.confirmationButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      deleteCompany(companyToDelete);
                      setShowConfirmModal(false);
                    }}
                    style={styles.confirmationButton}
                  >
                    <Text style={styles.confirmationButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={styles.confirmationButton}>
                    <Text style={styles.confirmationButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9d34a',
    borderRadius: 25,
    paddingLeft: 20,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardSection: {
    flexDirection: 'column',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f9d34a',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#f3830a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-evenly marginLeft: 15',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallImage: {
    width: 24,
    height: 24,
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Set modal width to 80% of the screen
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#f3830a',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    elevation: 10,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successModalContent: {
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3830a',
    textAlign: 'center',
  },
  confirmationContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    backgroundColor: '#f3830a',
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});