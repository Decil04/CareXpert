import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Platform } from 'react-native';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { theme } from '../theme';
import { Search, Star, MapPin, Filter, Calendar } from 'lucide-react-native';

// Dummy Doctor Data with high quality unsplash images
const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    experience: '15+ Years',
    rating: 4.9,
    reviews: 128,
    location: 'Metro General Hospital',
    distance: '2.5 mi',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Today',
    fee: '$150'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    experience: '12+ Years',
    rating: 4.8,
    reviews: 94,
    location: 'Downtown Medical Center',
    distance: '3.1 mi',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Tomorrow',
    fee: '$200'
  },
  {
    id: '3',
    name: 'Dr. Emily Peterson',
    specialty: 'Pediatrics',
    experience: '8+ Years',
    rating: 4.9,
    reviews: 215,
    location: 'Sunrise Children Clinic',
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1594824432258-f6a15eb888eb?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Today',
    fee: '$120'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    experience: '20+ Years',
    rating: 4.7,
    reviews: 310,
    location: 'Joint & Bone Institute',
    distance: '5.0 mi',
    image: 'https://images.unsplash.com/photo-1537368910025-702800faa86b?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Next Week',
    fee: '$180'
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    specialty: 'Dermatology',
    experience: '10+ Years',
    rating: 4.9,
    reviews: 175,
    location: 'Skin Clear Clinic',
    distance: '4.2 mi',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Tomorrow',
    fee: '$140'
  }
];

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

export const DoctorsScreen: React.FC<any> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <Layout scrollable>
      <ScreenHeader showBack />
      
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text variant="headlineMd" color="primary" style={styles.pageTitle}>Find a Doctor</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color={theme.colors.outline} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, specialties..."
              placeholderTextColor={theme.colors.outlineVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {/* Specialties Horizontal Scroll */}
        <View style={styles.specialtiesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesScroll}>
            {SPECIALTIES.map((spec, index) => {
              const isActive = selectedSpecialty === spec;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.specialtyChip, isActive && styles.specialtyChipActive]}
                  onPress={() => setSelectedSpecialty(spec)}
                >
                  <Text 
                    variant="labelMd" 
                    color={isActive ? "onPrimary" : "primary"}
                    style={isActive ? styles.boldText : {}}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.listContainer}>
          <Text variant="title" color="primary" style={styles.resultsText}>
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </Text>

          {filteredDoctors.map((doc) => (
            <Card key={doc.id} level={1} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <Image source={{ uri: doc.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <View style={styles.nameRow}>
                    <Text variant="title" color="primary" style={styles.doctorName}>{doc.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text variant="labelMd" style={styles.ratingText}>{doc.rating}</Text>
                    </View>
                  </View>
                  <Text variant="labelMd" color="secondary" style={styles.specialtyText}>{doc.specialty}</Text>
                  
                  <View style={styles.locationRow}>
                    <MapPin size={14} color={theme.colors.outline} />
                    <Text variant="bodyMd" color="onSurfaceVariant" style={styles.locationText}>{doc.location} ({doc.distance})</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.doctorFooter}>
                <View style={styles.footerDetailsRow}>
                  <View style={styles.availabilityCol}>
                    <Text variant="labelMd" color="outline">Available</Text>
                    <View style={styles.availabilityRow}>
                      <Calendar size={14} color={theme.colors.primary} />
                      <Text variant="labelMd" color="primary" style={styles.boldText}>{doc.available}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.feeCol}>
                    <Text variant="labelMd" color="outline">Consultation Fee</Text>
                    <Text variant="title" color="primary">{doc.fee}</Text>
                  </View>
                </View>

                <Button 
                  title="Book Appointment" 
                  style={styles.bookButton}
                  onPress={() => console.log('Book appointment with', doc.name)}
                />
              </View>
            </Card>
          ))}
          
          {filteredDoctors.length === 0 && (
            <View style={styles.emptyState}>
              <Text variant="title" color="outline">No doctors found</Text>
              <Text variant="bodyMd" color="outlineVariant">Try adjusting your search criteria.</Text>
            </View>
          )}

        </View>
      </Animated.View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  container: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: theme.colors.primary,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } as any,
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }
    })
  },
  specialtiesWrapper: {
    marginBottom: theme.spacing.xl,
    marginHorizontal: -theme.spacing.lg,
  },
  specialtiesScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  specialtyChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  specialtyChipActive: {
    backgroundColor: theme.colors.primary,
  },
  boldText: {
    fontWeight: '700',
  },
  listContainer: {
    gap: theme.spacing.md,
  },
  resultsText: {
    marginBottom: theme.spacing.sm,
  },
  doctorCard: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  doctorHeader: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  specialtyText: {
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  doctorFooter: {
    gap: theme.spacing.md,
  },
  footerDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityCol: {
    gap: 4,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feeCol: {
    gap: 4,
    alignItems: 'center',
  },
  bookButton: {
    width: '100%',
    minHeight: 44,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  }
});
