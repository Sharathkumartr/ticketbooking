class TicketGenerator {
    static generateTicket(bookingDetails) {
        // Create modal content
        const ticketModal = document.createElement('div');
        ticketModal.id = 'ticketModal';
        ticketModal.innerHTML = `
            <div class="ticket-modal-content">
                <span class="close-button">&times;</span>
                <div class="ticket-header">
                    <h2>Event Ticket</h2>
                </div>
                <div class="ticket-info">
                    <p><strong>Event:</strong> <span>${bookingDetails.event}</span></p>
                    <p><strong>Event ID:</strong> <span>${bookingDetails.eventId}</span></p>
                    <p><strong>Ticket ID:</strong> <span>${bookingDetails.bookingId}</span></p>
                    <p><strong>Email:</strong> <span>${bookingDetails.email}</span></p>
                    <p><strong>Name:</strong> <span>${bookingDetails.name}</span></p>
                    <p><strong>Tickets:</strong> <span>${bookingDetails.tickets}</span></p>
                    <p><strong>Total Amount:</strong> <span>₹${bookingDetails.totalAmount}</span></p>
                </div>
                <div class="qr-code-section">
                    <div id="qrCodeContainer"></div>
                </div>
                <button id="printTicketBtn">Print Ticket</button>
            </div>
        `;
        document.body.appendChild(ticketModal);

        const qrCodeContainer = ticketModal.querySelector('#qrCodeContainer');
        const closeBtn = ticketModal.querySelector('.close-button');
        const printBtn = ticketModal.querySelector('#printTicketBtn');

        // Generate QR Code
        const qrCode = qrcode(0, 'M');
        const qrCodeData = JSON.stringify({
            eventName: bookingDetails.event,
            eventId: bookingDetails.eventId,
            ticketId: bookingDetails.bookingId,
            email: bookingDetails.email,
            name: bookingDetails.name,
            tickets: bookingDetails.tickets
        });
        qrCode.addData(qrCodeData);
        qrCode.make();
        const qrCodeImage = qrCode.createImgTag(5);
        qrCodeContainer.innerHTML = qrCodeImage;

        // Close modal event
        closeBtn.onclick = () => {
            document.body.removeChild(ticketModal);
        };

        // Print ticket event
        printBtn.onclick = () => {
            window.print();
        };
    }
} 