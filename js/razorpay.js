window.initiateRazorpayPayment = function(bookingDetails) {
    // Use environment variable for backend URL
    const backendUrl = process.env.BACKEND_URL || 'https://your-vercel-backend-url.vercel.app/save-booking';

    const options = {
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_IfggTisNgOf3gq',
        amount: bookingDetails.totalAmount * 100,
        currency: 'INR',
        name: 'Museum Ticket Booking',
        description: `Booking ${bookingDetails.tickets} tickets for ${bookingDetails.event}`,
        handler: async function (response) {
            try {
                const paymentResponse = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.API_SECRET}`
                    },
                    body: JSON.stringify({
                        ...bookingDetails,
                        paymentId: response.razorpay_payment_id
                    })
                });

                const data = await paymentResponse.json();

                if (data.success) {
                    bookingDetails.bookingId = data.bookingId;
                    
                    // Generate ticket with additional security
                    TicketGenerator.generateTicket({
                        ...bookingDetails,
                        secureHash: data.secureHash // Server-generated secure hash
                    });

                    window.ticketBookingChat.addBotMessage(`
🎉 Booking Successful! 🎉

Event: ${bookingDetails.event}
Tickets: ${bookingDetails.tickets}
Total Amount: ₹${bookingDetails.totalAmount}
Ticket ID: ${data.bookingId}
Payment Verification: ✅ Confirmed`);
                } else {
                    throw new Error(data.message || 'Booking verification failed');
                }
            } catch (error) {
                console.error('Booking Verification Error:', error);
                window.ticketBookingChat.addBotMessage(`
❌ Booking Error
Reason: ${error.message}
Please contact support with your payment ID.`);
            }
        },
        prefill: {
            name: bookingDetails.name,
            email: bookingDetails.email,
            contact: bookingDetails.phone || ''
        },
        notes: {
            event_id: bookingDetails.eventId
        },
        theme: {
            color: process.env.THEME_COLOR || '#3182ce'
        },
        modal: {
            ondismiss: function() {
                window.ticketBookingChat.addBotMessage('Payment process was cancelled. No charges applied.');
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}; 