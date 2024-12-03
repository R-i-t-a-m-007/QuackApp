import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Country, City } from 'country-state-city';

export default function AddCompany() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    postcode: '',
  });
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);
  const [searchCountryQuery, setSearchCountryQuery] = useState('');
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = Country.getAllCountries();
        setCountries(data.map((country) => ({ name: country.name, code: country.isoCode })));
      } catch (error) {
        console.error('Failed to fetch countries', error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phonePattern = /^[0-9]+$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only numbers';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://192.168.1.5:5000/api/companies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage(data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          country: '',
          city: '',
          postcode: '',
        });
      } else {
        setModalMessage(data.message || 'Failed to add company');
      }

      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setModalMessage('Server error. Please try again later.');
      setModalVisible(true);
    }
  };

  const handleCountrySelect = (country) => {
    setFormData({ ...formData, country: country.name, city: '' });
    setSelectedCountryCode(country.code); // Store the selected country code
 const cities = City.getCitiesOfCountry(country.code);
    setCities(cities.map((city) => city.name));
    setCityDropdownVisible(false);
    setCountryDropdownVisible(false);
  };

  const handleCitySelect = (city) => {
    setFormData({ ...formData, city });
    setCityDropdownVisible(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchCountryQuery.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

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
          <LinearGradient colors={['#f3ae0a', '#f3ae0a', '#f3830a']} style={styles.navbar}>
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
            {[
              { name: 'name', placeholder: 'Name' },
              { name: 'email', placeholder: 'Email' },
              { name: 'phone', placeholder: 'Phone Number', keyboardType: 'phone-pad' },
              { name: 'address', placeholder: 'Address' },
              {
                name: 'country',
                placeholder: 'Select Country',
                dropdown: true,
              },
              {
                name: 'city',
                placeholder: 'Select City',
                dropdown: true,
              },
              { name: 'postcode', placeholder: 'Postcode' },
            ].map((field, index) => (
              <View key={index} style={styles.inputContainer}>
                {field.dropdown ? (
                  <TouchableOpacity
                    style={[
                      styles.input,
                      errors[field.name] && styles.inputError,
                    ]}
                    onPress={() => {
                      if (field.name === 'country') {
                        setCountryDropdownVisible(true);
                      } else if (field.name === 'city') {
                        setCityDropdownVisible(true);
                      }
                    }}
                  >
                    <Text style={styles.inputText}>
                      {formData[field.name] || field.placeholder}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    style={[
                      styles.input,
                      errors[field.name] && styles.inputError,
                    ]}
                    placeholder={field.placeholder}
                    placeholderTextColor="white"
                    keyboardType={field.keyboardType || 'default'}
                    value={formData[field.name]}
                    onChangeText={(value) => handleInputChange(field.name, value)}
                  />
                )}
                {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
              </View>
            ))}

            {countryDropdownVisible && (
              <Modal
                transparent
                visible={countryDropdownVisible}
                onRequestClose={() => setCountryDropdownVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={styles.searchContainer}>
                      <Ionicons name="search" size={20} color="gray" />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search Country..."
                        value={searchCountryQuery}
                        onChangeText={setSearchCountryQuery}
                      />
                    </View>
                    <ScrollView>
                      {filteredCountries.map((item) => (
                        <TouchableOpacity
                          key={item.code}
                          onPress={() => handleCountrySelect(item)}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownItemText}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            )}

            {cityDropdownVisible && (
              <Modal
                transparent
                visible={cityDropdownVisible}
                onRequestClose={() => setCityDropdownVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={styles.searchContainer}>
                      <Ionicons name="search" size={20} color="gray" />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search City..."
                        value={searchCityQuery}
                        onChangeText={setSearchCityQuery}
                      />
                    </View>
                    <ScrollView>
                    {filteredCities.map((city, index) => (
                      <TouchableOpacity
                        key={`${city}-${index}`} // Use a combination of city name and index for uniqueness
                        onPress={() => handleCitySelect(city)}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{city}</Text>
                      </TouchableOpacity>
                    ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            )}

            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <Modal
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.successModalContainer}>
                <View style={styles.successModalContent}>
                  <Ionicons name="checkmark-circle" size={50} color="#4CAF50" style={styles.successIcon} />
                  <Text style={styles.successModalText}>{modalMessage}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.successModalButton}>
                    <Text style={styles.successModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
    paddingTop: 50,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    marginTop: 40,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    color: 'white',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    position: 'absolute',
    bottom: 18,
    right: 10,
    fontSize: 12,
    color: 'red',
  },
  confirmButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '70%',
    height: '50%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f3830a',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for contrast
  },
  successModalContent: {
    backgroundColor: 'white',
    padding: 30, // Increased padding
    borderRadius: 15, // More rounded corners
    width: '80%', // Adjust width for better appearance
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center', // Center the text
  },
  successModalButton: {
    backgroundColor: '#f3830a', //  Orange background for the button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  successModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successIcon: {
    marginBottom: 15, // Space between icon and text
  },
});