import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddWorker = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    address: '',
    joiningDate: new Date(),
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://192.168.1.5:5000/api/workers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setModalMessage('Worker added successfully!');
        setModalVisible(true);
        setTimeout(() => {
          router.push('/agencydash');
        }, 2000); // Redirect after 2 seconds
      } else {
        setModalMessage(data.message || 'Failed to add worker.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
    }
  };

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
            <TouchableOpacity onPress={() => router.push('/individualdash')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Add Worker</Text>
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
              { name: 'role', placeholder: 'Role' },
              { name: 'department', placeholder: 'Department' },
              { name: 'address', placeholder: 'Address' },
            ].map((field, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors[field.name] && styles.inputError,
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor="white" // Adjusted for better visibility
                  keyboardType={field.keyboardType
                  || 'default'}
                  value={formData[field.name]}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                />
                {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
              </View>
            ))}

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                Joining Date: {formData.joiningDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.joiningDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) handleInputChange('joiningDate', selectedDate);
                }}
              />
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Worker</Text>
            </TouchableOpacity>
          </ScrollView>

          <Modal
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
};

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
  datePicker: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  datePickerText: {
    color: 'white',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#f3830a',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
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
});

export default AddWorker;