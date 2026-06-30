// India Emergency Helpline Numbers
export const HELPLINES = [
  { number: '112', label: 'National Emergency', icon: '🚨', description: 'All-in-one emergency number' },
  { number: '108', label: 'Ambulance', icon: '🚑', description: 'Emergency ambulance service' },
  { number: '102', label: 'Ambulance (State)', icon: '🚑', description: 'State ambulance service' },
  { number: '101', label: 'Fire Brigade', icon: '🔥', description: 'Fire emergency' },
  { number: '100', label: 'Police', icon: '👮', description: 'Police emergency' },
  { number: '1091', label: 'Women Helpline', icon: '👩', description: 'Women in distress' },
  { number: '1098', label: 'Child Helpline', icon: '🧒', description: 'Children in distress' },
  { number: '1800-180-1104', label: 'Mental Health', icon: '🧠', description: 'NIMHANS helpline' },
];

// Blood groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Hospital types
export const HOSPITAL_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
  { value: 'trust', label: 'Trust' },
  { value: 'clinic', label: 'Clinic' },
];

// Indian states
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
  'Puducherry',
];

// Emergency contact relationships
export const RELATIONSHIPS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse / Partner' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'neighbor', label: 'Neighbor' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'other', label: 'Other' },
];

// Emergency types
export const EMERGENCY_TYPES = [
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'accident', label: 'Accident' },
  { value: 'fire', label: 'Fire' },
  { value: 'crime', label: 'Crime / Violence' },
  { value: 'natural_disaster', label: 'Natural Disaster' },
  { value: 'other', label: 'Other' },
];

// Default location (New Delhi) — fallback if geolocation denied
export const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.2090,
  label: 'New Delhi',
};

// Common allergies
export const COMMON_ALLERGIES = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'NSAIDs', 'Latex',
  'Peanuts', 'Tree nuts', 'Shellfish', 'Dairy', 'Eggs',
  'Dust mites', 'Pollen', 'Pet dander',
];

// Common chronic diseases
export const COMMON_DISEASES = [
  'Diabetes (Type 1)', 'Diabetes (Type 2)', 'Hypertension',
  'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder',
  'Kidney Disease', 'Liver Disease', 'Epilepsy', 'Cancer',
];
