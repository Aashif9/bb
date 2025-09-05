document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-signup-form');
    const submitBtn = document.getElementById('submit-btn');
    const loadingText = document.getElementById('loading-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const educationLevel = document.getElementById('education-level').value;
        const interestedField = document.getElementById('interested-field').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate passwords
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !educationLevel || !interestedField) {
            alert('Please fill out all required fields.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        loadingText.textContent = 'Creating account...';
        loadingText.style.display = 'block';

        try {
            // Wait for database manager to be available
            if (!window.db) {
                await new Promise(resolve => {
                    const checkDb = setInterval(() => {
                        if (window.db) {
                            clearInterval(checkDb);
                            resolve();
                        }
                    }, 100);
                });
            }

            // Prepare user metadata
            const userData = {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                education_level: educationLevel,
                interested_field: interestedField,
                user_type: 'student'
            };

            // Sign up with Supabase
            const result = await window.db.signUp(email, password, userData);

            if (result.success) {
                console.log('Student signup successful:', result.data);
                alert('Account created successfully! Please check your email to verify your account.');
                
                // Store user data locally
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Reset form
                form.reset();
                
                // Redirect to signin page
                window.location.href = 'signin.html';
            } else {
                console.error('Signup failed:', result.error);
                alert('Signup failed: ' + result.error);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            loadingText.textContent = '';
            loadingText.style.display = 'none';
        }
    });
});