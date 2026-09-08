import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!dishName.trim()) {
      newErrors.dishName = 'Dish name is required.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!course) {
      newErrors.course = 'Please select a course.';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const addMenuItem = () => {
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: Number(price).toFixed(2),
    };

    setMenuItems((currentItems) => [...currentItems, newItem]);

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});

    Alert.alert(
      'Success',
      'Menu item has been added successfully.'
    );
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.price}>R {item.price}</Text>
      </View>

      <Text style={styles.course}>{item.course}</Text>

      <Text style={styles.description}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            Restaurant Menu Manager
          </Text>

          <Text style={styles.subtitle}>
            Add and view your restaurant menu items
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              Add Menu Item
            </Text>

            <Text style={styles.label}>Dish Name</Text>

            <TextInput
              style={[
                styles.input,
                errors.dishName && styles.inputError,
              ]}
              placeholder="Enter dish name"
              value={dishName}
              onChangeText={setDishName}
            />

            {errors.dishName && (
              <Text style={styles.errorText}>
                {errors.dishName}
              </Text>
            )}

            <Text style={styles.label}>Description</Text>

            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                errors.description && styles.inputError,
              ]}
              placeholder="Enter dish description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {errors.description && (
              <Text style={styles.errorText}>
                {errors.description}
              </Text>
            )}

            <Text style={styles.label}>Course</Text>

            <View
              style={[
                styles.pickerContainer,
                errors.course && styles.inputError,
              ]}
            >
              <Picker
                selectedValue={course}
                onValueChange={(itemValue) => setCourse(itemValue)}
              >
                <Picker.Item
                  label="Select a course"
                  value=""
                />
                <Picker.Item
                  label="Starter"
                  value="Starter"
                />
                <Picker.Item
                  label="Main Course"
                  value="Main Course"
                />
                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />
              </Picker>
            </View>

            {errors.course && (
              <Text style={styles.errorText}>
                {errors.course}
              </Text>
            )}

            <Text style={styles.label}>Price</Text>

            <TextInput
              style={[
                styles.input,
                errors.price && styles.inputError,
              ]}
              placeholder="Enter price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            {errors.price && (
              <Text style={styles.errorText}>
                {errors.price}
              </Text>
            )}

            <Pressable
              style={styles.button}
              onPress={addMenuItem}
            >
              <Text style={styles.buttonText}>
                Save Item
              </Text>
            </Pressable>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              Menu Items
            </Text>

            <Text style={styles.count}>
              {menuItems.length} item
              {menuItems.length === 1 ? '' : 's'}
            </Text>
          </View>

          {menuItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No menu items yet
              </Text>

              <Text style={styles.emptyText}>
                Add your first menu item using the form above.
              </Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },

  descriptionInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    overflow: 'hidden',
  },

  inputError: {
    borderColor: '#D92D20',
  },

  errorText: {
    color: '#D92D20',
    fontSize: 13,
    marginTop: 4,
  },

  button: {
    backgroundColor: '#222222',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  count: {
    fontSize: 14,
    color: '#666',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  dishName: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  course: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 21,
  },
});