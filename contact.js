document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            console.log('Contact form submitted:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);
            
            // Alert user (since we don't have a backend to send to yet)
            alert('THANK YOU. YOUR MESSAGE HAS BEEN TRANSMITTED TO THE SYSTEM.');
            
            // Clear form
            contactForm.reset();
        });
    }
});
