window.initiateRazorpayPayment = function(bookingDetails) {
    const options = {
        key: 'rzp_test_IfggTisNgOf3gq', // Razorpay test key
        amount: bookingDetails.totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Ticket Booking Platform',
        description: `Booking ${bookingDetails.tickets} tickets for ${bookingDetails.event}`,
        handler: function (response) {
            // Payment successful, send details to backend
            fetch('http://localhost:3000/save-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...bookingDetails,
                    paymentId: response.razorpay_payment_id
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add booking ID to the booking details
                    bookingDetails.bookingId = data.bookingId;
                    
                    // Show ticket with QR code
                    TicketGenerator.generateTicket(bookingDetails);

                    window.ticketBookingChat.addBotMessage(`
🎉 Booking Successful! 🎉

Event: ${bookingDetails.event}
Tickets: ${bookingDetails.tickets}
Total Amount: ₹${bookingDetails.totalAmount}
Ticket ID: ${data.bookingId}
Payment ID: ${response.razorpay_payment_id}

Your ticket has been generated. Click 'Print Ticket' to view and print.`);
                } else {
                    window.ticketBookingChat.addBotMessage('Booking failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Booking save error:', error);
                window.ticketBookingChat.addBotMessage('An error occurred during booking. Please try again.');
            });
        },
        prefill: {
            name: bookingDetails.name,
            email: bookingDetails.email
        },
        theme: {
            color: '#3182ce' // Blue accent color
        }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}; 