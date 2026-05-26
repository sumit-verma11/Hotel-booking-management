require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Hotel = require('../src/models/Hotel');
const Booking = require('../src/models/Booking');
const State = require('../src/models/State');
const City = require('../src/models/City');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_booking';

const states = [
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Delhi', code: 'DL' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Goa', code: 'GA' },
  { name: 'Uttar Pradesh', code: 'UP' }
];

const cities = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'New Delhi', state: 'Delhi' },
  { name: 'Dwarka', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Udaipur', state: 'Rajasthan' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Panaji', state: 'Goa' },
  { name: 'Calangute', state: 'Goa' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' }
];

const users = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '9876543210', address: '12 MG Road, Mumbai' },
  { name: 'Priya Patel', email: 'priya.patel@email.com', phone: '9876543211', address: '45 Park Street, Delhi' },
  { name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '9876543212', address: '7 Brigade Road, Bangalore' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '9876543213', address: '23 Anna Salai, Chennai' },
  { name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '9876543214', address: '9 MI Road, Jaipur' },
  { name: 'Ananya Joshi', email: 'ananya.joshi@email.com', phone: '9876543215', address: '34 CG Road, Ahmedabad' },
  { name: 'Rohit Verma', email: 'rohit.verma@email.com', phone: '9876543216', address: '56 FC Road, Pune' },
  { name: 'Kavya Nair', email: 'kavya.nair@email.com', phone: '9876543217', address: '18 Calangute Beach, Goa' },
  { name: 'Arjun Mehta', email: 'arjun.mehta@email.com', phone: '9876543218', address: '3 Hazratganj, Lucknow' },
  { name: 'Pooja Agarwal', email: 'pooja.agarwal@email.com', phone: '9876543219', address: '67 Taj Road, Agra' }
];

const hotels = [
  { name: 'The Grand Mumbai', location: 'Marine Drive', city: 'Mumbai', state: 'Maharashtra', country: 'India', rating: 5, amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'], pricePerNight: 8500, description: 'Luxury hotel overlooking the Arabian Sea', isActive: true },
  { name: 'Pune Palace', location: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', country: 'India', rating: 4, amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar'], pricePerNight: 4500, description: 'Premium hotel in the heart of Pune', isActive: true },
  { name: 'Delhi Darbar', location: 'Connaught Place', city: 'New Delhi', state: 'Delhi', country: 'India', rating: 5, amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Conference Hall'], pricePerNight: 9000, description: 'Iconic hotel near the capital\'s center', isActive: true },
  { name: 'Bangalore Tech Stay', location: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', country: 'India', rating: 3, amenities: ['WiFi', 'Gym', 'Restaurant'], pricePerNight: 3200, isActive: true },
  { name: 'Mysore Heritage', location: 'Chamundi Hills Road', city: 'Mysore', state: 'Karnataka', country: 'India', rating: 4, amenities: ['WiFi', 'Pool', 'Restaurant', 'Garden'], pricePerNight: 5500, description: 'Heritage property near Mysore Palace', isActive: true },
  { name: 'Chennai Coast', location: 'Marina Beach Road', city: 'Chennai', state: 'Tamil Nadu', country: 'India', rating: 4, amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access'], pricePerNight: 4800, isActive: true },
  { name: 'Jaipur Royal', location: 'Amer Road', city: 'Jaipur', state: 'Rajasthan', country: 'India', rating: 5, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Heritage Tour'], pricePerNight: 7500, description: 'Royal palace hotel experience', isActive: true },
  { name: 'Udaipur Lake View', location: 'Lake Pichola', city: 'Udaipur', state: 'Rajasthan', country: 'India', rating: 5, amenities: ['WiFi', 'Pool', 'Spa', 'Boat Ride', 'Restaurant'], pricePerNight: 10000, description: 'Stunning views of Lake Pichola', isActive: true },
  { name: 'Goa Beach Resort', location: 'Calangute Beach', city: 'Calangute', state: 'Goa', country: 'India', rating: 4, amenities: ['WiFi', 'Pool', 'Beach Access', 'Bar', 'Restaurant', 'Water Sports'], pricePerNight: 6500, isActive: true },
  { name: 'Ahmedabad Business Inn', location: 'SG Highway', city: 'Ahmedabad', state: 'Gujarat', country: 'India', rating: 3, amenities: ['WiFi', 'Gym', 'Restaurant', 'Conference Hall'], pricePerNight: 2800, isActive: true },
  { name: 'Nagpur Center Hotel', location: 'Sitabuldi', city: 'Nagpur', state: 'Maharashtra', country: 'India', rating: 3, amenities: ['WiFi', 'Restaurant'], pricePerNight: 2200, isActive: false },
  { name: 'Lucknow Nawab Retreat', location: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', rating: 4, amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa'], pricePerNight: 4200, isActive: true },
  { name: 'Agra Taj View', location: 'Taj Ganj', city: 'Agra', state: 'Uttar Pradesh', country: 'India', rating: 4, amenities: ['WiFi', 'Rooftop Restaurant', 'Taj View Room'], pricePerNight: 5800, description: 'Rooms with direct view of Taj Mahal', isActive: true },
  { name: 'Surat Textile Hub', location: 'Ring Road', city: 'Surat', state: 'Gujarat', country: 'India', rating: 3, amenities: ['WiFi', 'Gym', 'Restaurant'], pricePerNight: 2500, isActive: true },
  { name: 'Coimbatore Garden Inn', location: 'RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', rating: 3, amenities: ['WiFi', 'Garden', 'Restaurant'], pricePerNight: 2700, isActive: false }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Hotel.deleteMany({}),
    Booking.deleteMany({}),
    State.deleteMany({}),
    City.deleteMany({})
  ]);

  const [insertedStates, insertedCities, insertedUsers, insertedHotels] = await Promise.all([
    State.insertMany(states),
    City.insertMany(cities),
    User.insertMany(users),
    Hotel.insertMany(hotels)
  ]);

  console.log(`Seeded ${insertedStates.length} states`);
  console.log(`Seeded ${insertedCities.length} cities`);
  console.log(`Seeded ${insertedUsers.length} users`);
  console.log(`Seeded ${insertedHotels.length} hotels`);

  const bookings = [
    { userId: insertedUsers[0]._id, hotelId: insertedHotels[0]._id, checkInDate: new Date('2024-07-15'), numberOfGuests: 2, status: 2, specialRequests: 'Sea view room please', bookingDate: new Date('2024-07-10') },
    { userId: insertedUsers[1]._id, hotelId: insertedHotels[2]._id, checkInDate: new Date('2024-08-20'), numberOfGuests: 1, status: 0, bookingDate: new Date('2024-08-15') },
    { userId: insertedUsers[2]._id, hotelId: insertedHotels[3]._id, checkInDate: new Date('2024-09-05'), numberOfGuests: 3, status: 1, specialRequests: 'Late check-in', bookingDate: new Date('2024-09-01') },
    { userId: insertedUsers[3]._id, hotelId: insertedHotels[5]._id, checkInDate: new Date('2024-10-12'), numberOfGuests: 2, status: 0, bookingDate: new Date('2024-10-08') },
    { userId: insertedUsers[4]._id, hotelId: insertedHotels[6]._id, checkInDate: new Date('2024-11-25'), numberOfGuests: 4, status: 0, specialRequests: 'Heritage tour package needed', bookingDate: new Date('2024-11-20') },
    { userId: insertedUsers[5]._id, hotelId: insertedHotels[7]._id, checkInDate: new Date('2024-12-01'), numberOfGuests: 2, status: 0, specialRequests: 'Anniversary celebration', bookingDate: new Date('2024-11-25') },
    { userId: insertedUsers[6]._id, hotelId: insertedHotels[8]._id, checkInDate: new Date('2025-01-10'), numberOfGuests: 5, status: 2, bookingDate: new Date('2025-01-05') },
    { userId: insertedUsers[7]._id, hotelId: insertedHotels[1]._id, checkInDate: new Date('2025-02-14'), numberOfGuests: 2, status: 0, specialRequests: 'Valentine\'s special', bookingDate: new Date('2025-02-10') },
    { userId: insertedUsers[8]._id, hotelId: insertedHotels[11]._id, checkInDate: new Date('2025-03-20'), numberOfGuests: 1, status: 1, bookingDate: new Date('2025-03-15') },
    { userId: insertedUsers[9]._id, hotelId: insertedHotels[12]._id, checkInDate: new Date('2025-04-05'), numberOfGuests: 3, status: 0, specialRequests: 'Taj Mahal view room', bookingDate: new Date('2025-04-01') },
    { userId: insertedUsers[0]._id, hotelId: insertedHotels[4]._id, checkInDate: new Date('2025-05-15'), numberOfGuests: 2, status: 0, bookingDate: new Date('2025-05-10') },
    { userId: insertedUsers[1]._id, hotelId: insertedHotels[9]._id, checkInDate: new Date('2025-06-10'), numberOfGuests: 1, status: 0, specialRequests: 'Early check-in required', bookingDate: new Date('2025-06-05') }
  ];

  const insertedBookings = await Booking.insertMany(bookings);
  console.log(`Seeded ${insertedBookings.length} bookings`);

  await mongoose.disconnect();
  console.log('Seeding complete');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
