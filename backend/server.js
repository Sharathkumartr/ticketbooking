require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-vercel-domain.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@ticketcluster.5od73.mongodb.net/?retryWrites=true&w=majority&appName=TicketCluster';

mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

// Booking Schema
const BookingSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        trim: true 
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

// Booking Endpoint
app.post('/save-booking', async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Validate Required Fields
        const requiredFields = ['email', 'event', 'tickets', 'paymentId'];
        for (let field of requiredFields) {
            if (!bookingData[field]) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Missing required field: ${field}` 
                });
            }
        }

        const newBooking = new Booking(bookingData);
        await newBooking.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Booking saved successfully',
            bookingId: newBooking._id
        });
    } catch (error) {
        console.error('Booking Save Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Booking processing failed',
            error: error.toString()
        });
    }
});

// Root route
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 