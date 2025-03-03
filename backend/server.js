require('dotenv').config({ path: '.env' }); // Explicitly specify path
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Validate MongoDB URI
if (!MONGODB_URI) {
    console.error('ERROR: MongoDB URI is not defined in .env file');
    process.exit(1);
}

// Improved MongoDB Connection
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('MongoDB Connected Successfully');
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

// Booking Schema with more robust validation
const BookingSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    event: { 
        type: String, 
        required: true, 
        trim: true 
    },
    eventId: {
        type: String,
        required: true
    },
    tickets: { 
        type: Number, 
        required: true, 
        min: [1, 'Number of tickets must be at least 1']
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    bookingDate: { 
        type: Date, 
        default: Date.now 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
});

const Booking = mongoose.model('Booking', BookingSchema);

// Save Booking Endpoint with improved error handling
app.post('/save-booking', async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Calculate total amount 
        bookingData.totalAmount = bookingData.tickets * bookingData.price;

        const newBooking = new Booking(bookingData);
        await newBooking.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Booking saved successfully',
            bookingId: newBooking._id
        });
    } catch (error) {
        console.error('Booking Save Error:', error);
        
        // Mongoose validation error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    server.close(() => {
        console.log('Server and MongoDB connection closed');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 