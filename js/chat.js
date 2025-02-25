class TicketBookingChat {
    constructor() {
        this.stage = 'welcome';
        this.bookingDetails = {};
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.themeToggle = document.getElementById('themeToggle');

        this.events = [
            { 
                name: 'Museum of Melodies: Night of Harmony', 
                id: 'EVT12345', 
                price: 1000, 
                description: 'A musical event hosted at a museum, blending art and music' 
            },
            { 
                name: 'Tech Innovations Gallery: Future Unveiled', 
                id: 'CONF2023', 
                price: 1500, 
                description: 'A tech-focused event presented in a museum-like gallery format' 
            },
            { 
                name: 'Art for a Cause: Charity Exhibition', 
                id: 'GALA2024', 
                price: 2000, 
                description: 'A charity gala featuring art pieces, hosted at a heritage museum' 
            }
        ];

        this.setupEventListeners();
        this.initializeChat();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
    }

    setupThemeToggle() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggle.checked = true;
        }

        this.themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            
            // Save theme preference
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    initializeChat() {
        this.stage = 'welcome';
        this.displayEventOptions();
    }

    displayEventOptions() {
        const eventOptionsContainer = document.createElement('div');
        eventOptionsContainer.classList.add('event-options');

        this.events.forEach(event => {
            const eventButton = document.createElement('button');
            eventButton.classList.add('event-option');
            
            // Add interactive visual elements
            const priceTag = document.createElement('span');
            priceTag.classList.add('price-tag');
            priceTag.textContent = `₹${event.price}`;

            eventButton.innerHTML = `
                <strong>${event.name}</strong>
                <small>ID: ${event.id}</small>
                <p>${event.description}</p>
            `;
            eventButton.appendChild(priceTag);
            
            // Add hover and click animations
            eventButton.addEventListener('mouseenter', () => {
                eventButton.style.transform = 'scale(1.02)';
            });
            
            eventButton.addEventListener('mouseleave', () => {
                eventButton.style.transform = 'scale(1)';
            });
            
            eventButton.addEventListener('click', () => {
                // Add click animation
                eventButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    eventButton.style.transform = 'scale(1)';
                    this.selectEvent(event);
                }, 100);
            });

            eventOptionsContainer.appendChild(eventButton);
        });

        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('bot-message');
        botMessageElement.innerHTML = `
            🎉 Welcome to Museum Ticket Booking! 
            <br>Please select an event from the options below.
        `;
        
        this.chatMessages.appendChild(botMessageElement);
        this.chatMessages.appendChild(eventOptionsContainer);
        this.scrollToBottom();
    }

    selectEvent(event) {
        // Remove existing event options
        const existingOptions = this.chatMessages.querySelector('.event-options');
        if (existingOptions) {
            existingOptions.remove();
        }

        this.bookingDetails.event = event.name;
        this.bookingDetails.eventId = event.id;
        this.bookingDetails.price = event.price;

        this.addBotMessage(`You've selected: ${event.name}
Price per ticket: ₹${event.price}

Please enter your email address to proceed.`);
        this.stage = 'email';
    }

    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message');
        messageElement.textContent = message;
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('user-message');
        messageElement.textContent = message;
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    handleUserInput() {
        const userInput = this.chatInput.value.trim();
        if (!userInput) return;

        this.addUserMessage(userInput);
        this.processInput(userInput);
        this.chatInput.value = '';
    }

    processInput(input) {
        switch(this.stage) {
            case 'welcome':
            case 'email':
                this.handleEmailStage(input);
                break;
            case 'confirm-email':
                this.handleEmailConfirmation(input);
                break;
            case 'name':
                this.handleNameStage(input);
                break;
            case 'address':
                this.handleAddressStage(input);
                break;
            case 'tickets':
                this.handleTicketStage(input);
                break;
        }
    }

    handleEmailStage(email) {
        if (this.isValidEmail(email)) {
            this.bookingDetails.email = email;
            this.stage = 'confirm-email';
            this.addBotMessage(`Please confirm your email by re-entering: ${email}`);
        } else {
            this.addBotMessage('Invalid email. Please use a valid .com email address.');
        }
    }

    handleEmailConfirmation(confirmedEmail) {
        if (confirmedEmail === this.bookingDetails.email) {
            this.stage = 'name';
            this.addBotMessage('Great! Could you please tell me your full name?');
        } else {
            this.addBotMessage('Emails do not match. Please enter your email again.');
            this.stage = 'email';
        }
    }

    handleNameStage(name) {
        if (name.trim().length >= 2) {
            this.bookingDetails.name = name.trim();
            this.stage = 'address';
            this.addBotMessage('Thank you! Could you provide your address?');
        } else {
            this.addBotMessage('Please enter a valid name.');
        }
    }

    handleAddressStage(address) {
        if (address.trim().length >= 5) {
            this.bookingDetails.address = address.trim();
            this.stage = 'tickets';
            this.addBotMessage(`How many tickets would you like to book for ${this.bookingDetails.event}? 
(Price per ticket: ₹${this.bookingDetails.price})`);
        } else {
            this.addBotMessage('Please enter a valid address.');
        }
    }

    handleTicketStage(tickets) {
        const numTickets = parseInt(tickets);
        if (isNaN(numTickets) || numTickets <= 0) {
            this.addBotMessage('Please enter a valid number of tickets.');
            return;
        }
        this.bookingDetails.tickets = numTickets;
        this.bookingDetails.totalAmount = numTickets * this.bookingDetails.price;
        this.initiatePayment();
    }

    initiatePayment() {
        window.initiateRazorpayPayment(this.bookingDetails);
    }

    isValidEmail(email) {
        // Stricter email validation with .com domain
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        return emailRegex.test(email);
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.ticketBookingChat = new TicketBookingChat();
}); 