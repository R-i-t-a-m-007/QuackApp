import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CustomCalendar() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const names = ['Elise', 'Physio', 'Checkup', 'Visit', 'John', 'Sarah', 'James', 'Anna', 'Mike', 'Lisa'];

  // Function to generate random dates for the given month
  const getRandomDates = () => {
    const randomDates = [];
    const totalDays = 31; // March has 31 days
    const randomDays = new Set();

    while (randomDays.size < 5) {
      const randomDay = Math.floor(Math.random() * totalDays) + 1;
      randomDays.add(`2024-03-${randomDay < 10 ? '0' + randomDay : randomDay}`);
    }

    randomDays.forEach((date) => {
      const randomNames = [];
      // Get 5 random names for each selected date
      while (randomNames.length < 5) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        if (!randomNames.includes(randomName)) {
          randomNames.push(randomName);
        }
      }
      randomNames.sort(); // Optional: Sort the names alphabetically
      randomDates.push({ date, names: randomNames });
    });

    return randomDates;
  };

  useEffect(() => {
    const randomDates = getRandomDates();
    const updatedMarkedDates = {};
    randomDates.forEach(({ date, names }) => {
      updatedMarkedDates[date] = {
        dots: names.map(() => ({ color: 'purple' })), // Add purple dots for each name
        marked: true,
        names,
      };
    });
    setMarkedDates(updatedMarkedDates);
  }, []);

  const handleDatePress = (dateKey) => {
    const dayData = markedDates[dateKey] || {};
    // Ensure selectedDate is an array of names
    setSelectedDate(dayData.names || []); 
    setIsModalVisible(true);
  };

  const renderDayComponent = (day) => {
    const dateKey = day.dateString;
    const dayData = markedDates[dateKey] || {};
    const names = dayData.names || [];

    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{day.day}</Text>
        {/* Show only the first 2 names */}
        {names.slice(0, 2).map((name, index) => (
          <Text key={index} style={styles.nameText}>
            {name}
          </Text>
        ))}
        {names.length > 2 && (
          <TouchableOpacity onPress={() => handleDatePress(dateKey)}>
            <Text style={styles.viewMoreText}>({names.length - 2} more)</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.monthText}>March</Text>
          <Text style={styles.subtitleText}>Caregiving Calendar</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="search" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calendar Component */}
      <Calendar
        dayComponent={({ date }) => renderDayComponent(date)}
        markingType={'multi-dot'}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#2E66E7',
          arrowColor: '#2E66E7',
          dotColor: 'purple',
          selectedDotColor: 'green',
          textDayFontFamily: 'System',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
        style={styles.calendar}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => alert('Floating Action Button Clicked')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for viewing all names */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Available Today</Text>
            {selectedDate.map((name, index) => (
              <Text key={index} style={styles.modalNameText}>
                {name}
              </Text>
            ))}
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain the same as in the previous version

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E66E7',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 14,
    color: 'white',
  },
  calendar: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayContainer: {
    justifyContent: 'flex-start', // Align items to the top of the box
    alignItems: 'center',
    height: (height - 150) / 6, // Calculate height dynamically to fit screen
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  nameText: {
    fontSize: 12,
    color: 'green', // Name color set to green
    marginTop:5
  },
  viewMoreText: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalNameText: {
    fontSize: 14,
    color: 'green',
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2E66E7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2E66E7',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});
