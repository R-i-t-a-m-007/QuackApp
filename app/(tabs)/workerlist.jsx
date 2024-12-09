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

export default function WorkerList() {
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState('');
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerAddress, setWorkerAddress] = useState('');
  const [workerCountry, setWorkerCountry] = useState('');
  const [workerCity, setWorkerCity] = useState('');
  const [workerPostcode, setWorkerPostcode] = useState('');

  // Fetch workers from the backend
  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.5:5000/api/workers/list');
      const data = await response.json();
      if (response.ok) {
        setWorkers(data);
      } else {
        console.error('Error fetching workers:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWorker = async () => {
    try {
      const updatedWorker = {
        name: workerName,
        email: workerEmail,
        phone: workerPhone,
        address: workerAddress,
        country: workerCountry,
        city: workerCity,
        postcode: workerPostcode,
      };

      const response = await fetch(`http://192.168.1.5:5000/api/workers/${selectedWorker._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorker),
      });

      if (response.ok) {
        setWorkers((prevWorkers) =>
          prevWorkers.map((worker) =>
            worker._id === selectedWorker._id ? { ...worker, ...updatedWorker } : worker
          )
        );
        setSuccessMessage("Worker updated successfully!");
        setSuccessType('update');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        setSelectedWorker(null);
      } else {
        const data = await response.json();
        console.error('Error updating worker:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteWorker = async (workerId) => {
    try {
      const response = await fetch(`http://192.168.1.5:5000/api/workers/${workerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker._id !== workerId));
        setSuccessMessage("Worker deleted successfully!");
        setSuccessType('delete');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
      } else {
        const data = await response.json();
        console.error('Error deleting worker:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWorkers();
    }, [])
  );

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <TouchableOpacity onPress={() => router.push('/individualdash')}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Worker List</Text>
          <Ionicons name="notifications" size={24} color="white" />
        </LinearGradient>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Worker..."
            placeholderTextColor="#000"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={24} color="#aaa" style={styles.searchIcon} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f3ae0a" />
            <Text style={styles.loadingText}>Loading workers...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardSection}>
              {filteredWorkers.map((worker) => (
                <View style={styles.card} key={worker._id}>
                  <View style={styles.cardContent}>
                    <View style={styles.profileImage}>
                      <Text style={styles.profileInitials}>{worker.name[0]?.toUpperCase()}</Text>
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardText}>Name: {worker.name}</Text>
                      <Text style={styles.cardText}>Worker ID: {worker.email}</Text>
                      <Text style={styles.cardText}>Contact: {worker.phone}</Text>
                      <Text style={styles.cardText}>Status: Active</Text>
                    </View>

                    <View style={styles.smallImagesContainer}>
                      <TouchableOpacity onPress={() => {
                        setSelectedWorker(worker);
                        setWorkerName(worker.name);
                        setWorkerEmail(worker.email);
                        setWorkerPhone(worker.phone);
                        setWorkerAddress(worker.address);
                        setWorkerCountry(worker.country);
                        setWorkerCity(worker.city);
                        setWorkerPostcode(worker.postcode);
                      }}>
                        <Image
                          source={require('@/assets/images/edit.png')}
                          style={styles.smallImage}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => {
                        setWorkerToDelete(worker._id);
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

        {selectedWorker && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={!!selectedWorker}
            onRequestClose={() => setSelectedWorker(null)}
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Worker</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Worker Name"
                  value={workerName}
                  onChangeText={setWorkerName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Worker Email"
                  value={workerEmail}
                  onChangeText={setWorkerEmail}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Worker Phone"
                  value={workerPhone}
                  onChangeText={setWorkerPhone}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Worker Address"
                  value={workerAddress}
                  onChangeText={setWorkerAddress} />
                <TextInput
                  style={styles.input}
                  placeholder="Worker Country"
                  value={workerCountry}
                  onChangeText={setWorkerCountry}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={workerCity}
                  onChangeText={setWorkerCity}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Postcode"
                  value={workerPostcode}
                  onChangeText={setWorkerPostcode}
                  keyboardType="number-pad"
                />
                <TouchableOpacity onPress={updateWorker} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedWorker(null)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}

        {showConfirmModal && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Are you sure you want to delete this worker?</Text>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    deleteWorker(workerToDelete);
                    setShowConfirmModal(false);
                  }}
                >
                  <Text style={styles.confirmButtonText}>Yes, Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {showSuccessModal && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showSuccessModal}
            onRequestClose={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.successMessage}>{successMessage}</Text>
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
    paddingTop:30
  },
  navbar: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  cardSection: {
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#aaa',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  smallImagesContainer: {
    flexDirection: 'row',
  },
  smallImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
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
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#f3ae0a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#999',
  },
  confirmButton: {
    backgroundColor: '#f3830a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
  },
});
