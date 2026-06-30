require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const Pharmacy = require('../models/Pharmacy');
const BloodDonor = require('../models/BloodDonor');
const User = require('../models/User');

const hospitals = [
  {
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'government',
    address: { houseNumber: 'Sri Aurobindo Marg', street: 'Ansari Nagar', locality: 'Ansari Nagar', city: 'New Delhi', district: 'South Delhi', state: 'Delhi', pinCode: '110029' },
    phone: '011-26588500',
    location: { type: 'Point', coordinates: [77.2100, 28.5672] },
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Trauma', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 2478,
    rating: 4.5,
  },
  {
    name: 'Safdarjung Hospital',
    type: 'government',
    address: { street: 'Ring Road', locality: 'Safdarjung', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi', pinCode: '110029' },
    phone: '011-26165060',
    location: { type: 'Point', coordinates: [77.2050, 28.5686] },
    specialties: ['General Medicine', 'Surgery', 'Obstetrics', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 1531,
    rating: 3.8,
  },
  {
    name: 'Lok Nayak Jai Prakash Hospital',
    type: 'government',
    address: { street: 'Jawahar Lal Nehru Marg', locality: 'Delhi Gate', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pinCode: '110002' },
    phone: '011-23232400',
    location: { type: 'Point', coordinates: [77.2424, 28.6380] },
    specialties: ['Emergency Medicine', 'Surgery', 'Medicine'],
    emergencyAvailable: true,
    beds: 2200,
    rating: 3.5,
  },
  {
    name: 'Kasturba Gandhi Hospital',
    type: 'government',
    address: { street: 'Daryaganj', locality: 'Daryaganj', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pinCode: '110002' },
    phone: '011-23232400',
    location: { type: 'Point', coordinates: [77.2380, 28.6420] },
    specialties: ['Obstetrics', 'Gynecology', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 660,
    rating: 3.7,
  },
  {
    name: 'Sir Ganga Ram Hospital',
    type: 'private',
    address: { street: 'Siri Fort Road', locality: 'Rajinder Nagar', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pinCode: '110060' },
    phone: '011-25750000',
    location: { type: 'Point', coordinates: [77.1900, 28.6394] },
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
    emergencyAvailable: true,
    beds: 675,
    rating: 4.3,
  },
  {
    name: 'Fortis Hospital Mulund',
    type: 'private',
    address: { street: 'Mulund Goregaon Link Road', locality: 'Mulund West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', pinCode: '400078' },
    phone: '022-71279000',
    location: { type: 'Point', coordinates: [72.9567, 19.1769] },
    specialties: ['Cardiology', 'Neurosurgery', 'Oncology', 'Transplant'],
    emergencyAvailable: true,
    beds: 315,
    rating: 4.2,
  },
  {
    name: 'KEM Hospital',
    type: 'government',
    address: { street: 'Acharya Donde Marg', locality: 'Parel', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', pinCode: '400012' },
    phone: '022-24107000',
    location: { type: 'Point', coordinates: [72.8436, 19.0020] },
    specialties: ['Trauma', 'Surgery', 'Medicine', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 1800,
    rating: 3.9,
  },
  {
    name: 'Lilavati Hospital',
    type: 'private',
    address: { street: 'A-791 Bandra Reclamation', locality: 'Bandra West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', pinCode: '400050' },
    phone: '022-26751000',
    location: { type: 'Point', coordinates: [72.8280, 19.0548] },
    specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
    emergencyAvailable: true,
    beds: 323,
    rating: 4.4,
  },
  {
    name: 'Nimhans',
    type: 'government',
    address: { street: 'Hosur Road', locality: 'Lakkasandra', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pinCode: '560029' },
    phone: '080-46110007',
    location: { type: 'Point', coordinates: [77.5941, 12.9361] },
    specialties: ['Psychiatry', 'Neurology', 'Neurosurgery'],
    emergencyAvailable: true,
    beds: 800,
    rating: 4.6,
  },
  {
    name: 'Manipal Hospital HAL Airport Road',
    type: 'private',
    address: { street: '98 HAL Airport Road', locality: 'Kodihalli', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pinCode: '560017' },
    phone: '080-25024444',
    location: { type: 'Point', coordinates: [77.6559, 12.9621] },
    specialties: ['Cardiology', 'Oncology', 'Orthopedics', 'Transplant'],
    emergencyAvailable: true,
    beds: 600,
    rating: 4.3,
  },
  {
    name: 'Rajiv Gandhi Government General Hospital',
    type: 'government',
    address: { street: 'Park Town', locality: 'Park Town', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pinCode: '600003' },
    phone: '044-25305000',
    location: { type: 'Point', coordinates: [80.2782, 13.0836] },
    specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics'],
    emergencyAvailable: true,
    beds: 2700,
    rating: 3.6,
  },
  {
    name: 'Apollo Hospitals Greams Road',
    type: 'private',
    address: { street: '21 Greams Lane Off Greams Road', locality: 'Thousand Lights', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pinCode: '600006' },
    phone: '044-28290200',
    location: { type: 'Point', coordinates: [80.2561, 13.0600] },
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Transplant', 'Orthopedics'],
    emergencyAvailable: true,
    beds: 710,
    rating: 4.5,
  },
  {
    name: 'PGIMER',
    type: 'government',
    address: { street: 'Sector 12', locality: 'Chandigarh', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', pinCode: '160012' },
    phone: '0172-2755555',
    location: { type: 'Point', coordinates: [76.7814, 30.7649] },
    specialties: ['Cardiology', 'Neurology', 'Nephrology', 'Oncology'],
    emergencyAvailable: true,
    beds: 1999,
    rating: 4.4,
  },
  {
    name: 'IPGMER and SSKM Hospital',
    type: 'government',
    address: { street: '244 AJC Bose Road', locality: 'Bhowanipore', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', pinCode: '700020' },
    phone: '033-22041382',
    location: { type: 'Point', coordinates: [88.3416, 22.5316] },
    specialties: ['Medicine', 'Surgery', 'Neurology', 'Cardiology'],
    emergencyAvailable: true,
    beds: 1800,
    rating: 3.7,
  },
  {
    name: 'Medica Superspecialty Hospital',
    type: 'private',
    address: { street: '127 Mukundapur', locality: 'E.M. Bypass', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', pinCode: '700099' },
    phone: '033-40404040',
    location: { type: 'Point', coordinates: [88.3987, 22.5018] },
    specialties: ['Cardiology', 'Neurosurgery', 'Oncology', 'Orthopedics'],
    emergencyAvailable: true,
    beds: 510,
    rating: 4.2,
  },
  {
    name: 'Nizam\'s Institute of Medical Sciences (NIMS)',
    type: 'government',
    address: { street: 'Punjagutta', locality: 'Punjagutta', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pinCode: '500082' },
    phone: '040-23489000',
    location: { type: 'Point', coordinates: [78.4491, 17.4280] },
    specialties: ['Cardiology', 'Neurology', 'Nephrology', 'Oncology'],
    emergencyAvailable: true,
    beds: 1194,
    rating: 4.0,
  },
  {
    name: 'Care Hospital',
    type: 'private',
    address: { street: 'Road No 1 Banjara Hills', locality: 'Banjara Hills', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pinCode: '500034' },
    phone: '040-30411000',
    location: { type: 'Point', coordinates: [78.4482, 17.4204] },
    specialties: ['Cardiology', 'Gastroenterology', 'Orthopedics'],
    emergencyAvailable: true,
    beds: 450,
    rating: 4.1,
  },
  {
    name: 'Ruby Hall Clinic',
    type: 'private',
    address: { street: '40 Sassoon Road', locality: 'Camp', city: 'Pune', district: 'Pune', state: 'Maharashtra', pinCode: '411001' },
    phone: '020-26163391',
    location: { type: 'Point', coordinates: [73.8778, 18.5204] },
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology'],
    emergencyAvailable: true,
    beds: 630,
    rating: 4.3,
  },
  {
    name: 'Jehangir Hospital',
    type: 'private',
    address: { street: '32 Sassoon Road', locality: 'Pune Camp', city: 'Pune', district: 'Pune', state: 'Maharashtra', pinCode: '411001' },
    phone: '020-66810000',
    location: { type: 'Point', coordinates: [73.8761, 18.5240] },
    specialties: ['General Surgery', 'Orthopedics', 'Cardiology'],
    emergencyAvailable: true,
    beds: 340,
    rating: 4.0,
  },
  {
    name: 'JIPMER',
    type: 'government',
    address: { street: 'Dhanvantari Nagar', locality: 'Gorimedu', city: 'Puducherry', district: 'Puducherry', state: 'Puducherry', pinCode: '605006' },
    phone: '0413-2272380',
    location: { type: 'Point', coordinates: [79.8543, 11.9409] },
    specialties: ['Cardiology', 'Neurology', 'Pediatrics', 'Endocrinology'],
    emergencyAvailable: true,
    beds: 1939,
    rating: 4.3,
  },
  {
    name: 'SMS Hospital',
    type: 'government',
    address: { street: 'Jawaharlal Nehru Marg', locality: 'Ashok Nagar', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', pinCode: '302004' },
    phone: '0141-2518888',
    location: { type: 'Point', coordinates: [75.8007, 26.9053] },
    specialties: ['Surgery', 'Orthopedics', 'Cardiology', 'Neurology'],
    emergencyAvailable: true,
    beds: 2000,
    rating: 3.6,
  },
  {
    name: 'SGPGI',
    type: 'government',
    address: { street: 'Raebareli Road', locality: 'Lucknow', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', pinCode: '226014' },
    phone: '0522-2668700',
    location: { type: 'Point', coordinates: [80.9462, 26.7783] },
    specialties: ['Nephrology', 'Neurology', 'Cardiology', 'Gastroenterology'],
    emergencyAvailable: true,
    beds: 1042,
    rating: 4.2,
  },
  {
    name: 'Post Graduate Institute of Medical Sciences Rohtak',
    type: 'government',
    address: { street: 'Rohtak', locality: 'Rohtak', city: 'Rohtak', district: 'Rohtak', state: 'Haryana', pinCode: '124001' },
    phone: '01262-213066',
    location: { type: 'Point', coordinates: [76.5849, 28.8955] },
    specialties: ['Medicine', 'Surgery', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 1500,
    rating: 3.8,
  },
  {
    name: 'Government Medical College Hospital Kozhikode',
    type: 'government',
    address: { street: 'Medical College Road', locality: 'Kozhikode', city: 'Kozhikode', district: 'Kozhikode', state: 'Kerala', pinCode: '673008' },
    phone: '0495-2350216',
    location: { type: 'Point', coordinates: [75.7841, 11.2588] },
    specialties: ['Medicine', 'Surgery', 'Obstetrics', 'Pediatrics'],
    emergencyAvailable: true,
    beds: 1500,
    rating: 3.9,
  },
  {
    name: 'Amrita Institute of Medical Sciences',
    type: 'private',
    address: { street: 'AIMS Ponekkara', locality: 'Ponekkara', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pinCode: '682041' },
    phone: '0484-2801234',
    location: { type: 'Point', coordinates: [76.3125, 10.0200] },
    specialties: ['Cardiology', 'Oncology', 'Transplant', 'Neurosurgery'],
    emergencyAvailable: true,
    beds: 1250,
    rating: 4.5,
  },
];

const pharmacies = [
  { name: 'Apollo Pharmacy', address: { street: 'Connaught Place', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pinCode: '110001' }, phone: '9811234567', location: { type: 'Point', coordinates: [77.2167, 28.6315] }, isOpen24x7: true },
  { name: 'MedPlus Pharmacy', address: { street: 'Banjara Hills Road No 12', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pinCode: '500034' }, phone: '9812345678', location: { type: 'Point', coordinates: [78.4482, 17.4150] }, isOpen24x7: false },
  { name: 'Netmeds Pharmacy', address: { street: 'Anna Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pinCode: '600040' }, phone: '9813456789', location: { type: 'Point', coordinates: [80.2100, 13.0850] }, isOpen24x7: true },
  { name: 'Wellness Forever', address: { street: 'Koregaon Park', city: 'Pune', district: 'Pune', state: 'Maharashtra', pinCode: '411001' }, phone: '9814567890', location: { type: 'Point', coordinates: [73.8981, 18.5362] }, isOpen24x7: false },
  { name: 'Jan Aushadhi Kendra', address: { street: 'Sector 22', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', pinCode: '160022' }, phone: '9815678901', location: { type: 'Point', coordinates: [76.8066, 30.7279] }, isOpen24x7: false },
  { name: 'Fortis Medical Centre Pharmacy', address: { street: 'Mulund', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', pinCode: '400080' }, phone: '9816789012', location: { type: 'Point', coordinates: [72.9625, 19.1745] }, isOpen24x7: true },
  { name: 'Columbia Asia Pharmacy', address: { street: 'Whitefield Road', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pinCode: '560066' }, phone: '9817890123', location: { type: 'Point', coordinates: [77.7480, 12.9698] }, isOpen24x7: false },
  { name: 'Sahyadri Hospital Pharmacy', address: { street: 'Karve Road', city: 'Pune', district: 'Pune', state: 'Maharashtra', pinCode: '411004' }, phone: '9818901234', location: { type: 'Point', coordinates: [73.8329, 18.5089] }, isOpen24x7: true },
  { name: 'Medikabazaar', address: { street: 'Rajouri Garden', city: 'New Delhi', district: 'West Delhi', state: 'Delhi', pinCode: '110027' }, phone: '9819012345', location: { type: 'Point', coordinates: [77.1188, 28.6486] }, isOpen24x7: false },
  { name: '1mg Pharmacy', address: { street: 'Salt Lake Sector V', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', pinCode: '700091' }, phone: '9820123456', location: { type: 'Point', coordinates: [88.4320, 22.5726] }, isOpen24x7: false },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Hospital.deleteMany({});
    await Pharmacy.deleteMany({});
    console.log('🗑️  Cleared existing hospitals and pharmacies');

    // Insert hospitals
    const insertedHospitals = await Hospital.insertMany(hospitals);
    console.log(`✅ Inserted ${insertedHospitals.length} hospitals`);

    // Insert pharmacies
    const insertedPharmacies = await Pharmacy.insertMany(pharmacies);
    console.log(`✅ Inserted ${insertedPharmacies.length} pharmacies`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@rahat.in' });
    if (!adminExists) {
      await User.create({
        name: 'RAHAT Admin',
        email: 'admin@rahat.in',
        phone: '9800000000',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@rahat.in / Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
