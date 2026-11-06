
import React, { useState } from 'react';
import {
  Alert,
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

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Validate the menu item form
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

    const numericPrice = Number(price);

    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      newErrors.price = 'Enter a valid price greater than zero.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Clear the form
  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
    setErrors({});
  };

  // Add a new menu item or update an existing one
  const saveMenuItem = () => {
    if (!validateForm()) {
      Alert.alert(
        'Invalid Information',
        'Please correct the errors in the form.'
      );
      return;
    }

    const menuItem = {
      id: editingId || Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: Number(price).toFixed(2),
    };

    if (editingId) {
      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingId ? menuItem : item
        )
      );

      Alert.alert(
        'Success',
        'Menu item updated successfully.'
      );
    } else {
      setMenuItems((currentItems) => [
        ...currentItems,
        menuItem,
      ]);

      Alert.alert(
        'Success',
        'Menu item added successfully.'
      );
    }

    resetForm();
  };

  // Load an existing item into the form
  const editMenuItem = (item) => {
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
    setErrors({});
  };

  // Delete a menu item after confirmation
  const deleteMenuItem = (id, name) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((currentItems) =>
              currentItems.filter((item) => item.id !== id)
            );

            if (editingId === id) {
              resetForm();
            }

            Alert.alert(
              'Deleted',
              'Menu item deleted successfully.'
            );
          },
        },
      ]
    );
  };

  // Search and filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    const matchesCourse =
      selectedCourse === '' ||
      item.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Calculate menu statistics
  const totalItems = menuItems.length;

  const totalPrice = menuItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const averagePrice =
    totalItems > 0 ? totalPrice / totalItems : 0;

  const courseCounts = {
    Starter: menuItems.filter(
      (item) => item.course === 'Starter'
    ).length,

    'Main Course': menuItems.filter(
      (item) => item.course === 'Main Course'
    ).length,

    Dessert: menuItems.filter(
      (item) => item.course === 'Dessert'
    ).length,
  };

  // Display an individual menu item
  const renderMenuItem = (item) => (
    <View key={item.id} style={styles.menuCard}>
      <View style={styles.cardHeader}>
        <View style={styles.dishDetails}>
          <Text style={styles.dishName}>
            {item.name}
          </Text>

          <Text style={styles.course}>
            {item.course}
          </Text>
        </View>

        <Text style={styles.price}>
          R {Number(item.price).toFixed(2)}
        </Text>
      </View>

      <Text style={styles.description}>
        {item.description}
      </Text>

      <View style={styles.cardActions}>
        <Pressable
          style={styles.editButton}
          onPress={() => editMenuItem(item)}
        >
          <Text style={styles.actionText}>
            Edit
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() =>
            deleteMenuItem(item.id, item.name)
          }
        >
          <Text style={styles.actionText}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Application Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Restaurant Menu Manager
            </Text>

            <Text style={styles.subtitle}>
              Manage your restaurant menu with ease.
            </Text>
          </View>

          {/* Menu Statistics */}
          <View style={styles.statisticsCard}>
            <Text style={styles.sectionTitle}>
              Menu Statistics
            </Text>

            <View style={styles.statisticsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {totalItems}
                </Text>

                <Text style={styles.statLabel}>
                  Total Items
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  R {averagePrice.toFixed(2)}
                </Text>

                <Text style={styles.statLabel}>
                  Average Price
                </Text>
              </View>
            </View>

            <Text style={styles.courseStatsTitle}>
              Items Per Course
            </Text>

            <View style={styles.courseStatsRow}>
              {COURSES.map((courseName) => (
                <View
                  key={courseName}
                  style={styles.courseStatBox}
                >
                  <Text style={styles.courseStatNumber}>
                    {courseCounts[courseName]}
                  </Text>

                  <Text style={styles.courseStatLabel}>
                    {courseName}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Add or Edit Menu Item Form */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {editingId
                ? 'Edit Menu Item'
                : 'Add Menu Item'}
            </Text>

            <Text style={styles.label}>
              Dish Name
            </Text>

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

            <Text style={styles.label}>
              Description
            </Text>

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

            <Text style={styles.label}>
              Course
            </Text>

            <View
              style={[
                styles.pickerContainer,
                errors.course && styles.inputError,
              ]}
            >
              <Picker
                selectedValue={course}
                onValueChange={setCourse}
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

            <Text style={styles.label}>
              Price (R)
            </Text>

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
              onPress={saveMenuItem}
            >
              <Text style={styles.buttonText}>
                {editingId
                  ? 'Update Menu Item'
                  : 'Save Menu Item'}
              </Text>
            </Pressable>

            {editingId && (
              <Pressable
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel Editing
                </Text>
              </Pressable>
            )}
          </View>

          {/* Search and Filter */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              Search and Filter
            </Text>

            <Text style={styles.label}>
              Search by Dish Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search menu..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <Text style={styles.label}>
              Filter by Course
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={setSelectedCourse}
              >
                <Picker.Item
                  label="All Courses"
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

            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setSearchText('');
                setSelectedCourse('');
              }}
            >
              <Text style={styles.clearButtonText}>
                Clear Search and Filter
              </Text>
            </Pressable>
          </View>

          {/* Menu Items List */}
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              Menu Items
            </Text>

            <Text style={styles.count}>
              {filteredMenuItems.length} displayed
            </Text>
          </View>

          {filteredMenuItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No menu items found
              </Text>

              <Text style={styles.emptyText}>
                Add a menu item or clear your search
                and filters.
              </Text>
            </View>
          ) : (
            filteredMenuItems.map(renderMenuItem)
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F8',
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#252542',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },

  statisticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#252542',
    marginBottom: 16,
  },

  statisticsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: '#F0EEFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#5B4BB7',
  },

  statLabel: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
  },

  courseStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#252542',
    marginTop: 20,
    marginBottom: 12,
  },

  courseStatsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  courseStatBox: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  courseStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#252542',
  },

  courseStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
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
    color: '#222',
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
    backgroundColor: '#5B4BB7',
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

  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  cancelButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },

  clearButton: {
    backgroundColor: '#E9E7F8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },

  clearButtonText: {
    color: '#5B4BB7',
    fontWeight: 'bold',
    fontSize: 14,
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
    color: '#252542',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  dishDetails: {
    flex: 1,
    marginRight: 10,
  },

  dishName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#252542',
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5B4BB7',
  },

  course: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B4BB7',
    marginTop: 5,
  },

  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 21,
  },

  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#5B4BB7',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#D92D20',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
