"# ticketbooking" 


# Museum Ticket Booking Platform 🎟️

A modern ticket booking platform with a chatbot interface, Razorpay payment integration, and QR code tickets.

---

## 🌟 Features

- Interactive event selection
- Chatbot-guided booking process
- Razorpay payment gateway
- QR code ticket generation
- Responsive design

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/museum-ticket-booking.git
cd museum-ticket-booking
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=3000
```

### 3. Frontend Setup
No additional setup required. Frontend files are in the root directory.

---

## 🌐 Deployment

- **Frontend**: Deploy on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- **Backend**: Deploy on [Render](https://render.com/) or [Railway](https://railway.app/).

Update the frontend with the backend URL:
```javascript
const backendUrl = "https://your-backend-url.com";
```

---

## 🛠️ Troubleshooting

- **Payment Issues**: Verify Razorpay credentials and backend logs.
- **CORS Errors**: Enable CORS in the backend.
- **Database Errors**: Check MongoDB Atlas connection string and IP whitelist.

---

## 📄 License

This project is licensed under the **MIT License**.

