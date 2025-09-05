document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        
        // Capture email and password values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
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
            
            // Attempt to sign in with Supabase
            const result = await window.db.signIn(email, password);
            
            if (result.success) {
                console.log('Sign in successful:', result.data);
                
                // Store user session info
                localStorage.setItem('user', JSON.stringify(result.data.user));
                
                // Get user profile data to determine user type
                const userId = result.data.user.id;
                const profileResult = await window.db.getUserProfile(userId);
                
                let redirectUrl = 'index.html'; // Default fallback
                
                if (profileResult.success && profileResult.data) {
                    const userType = profileResult.data.user_type;
                    
                    // Redirect based on user type
                    if (userType === 'mentor') {
                        redirectUrl = 'mentor-home-new.html';
                        alert('Welcome back, Mentor!');
                    } else if (userType === 'student') {
                        redirectUrl = 'index.html'; // Student dashboard (can be changed to student-specific page when available)
                        alert('Welcome back, Student!');
                    } else {
                        alert('Welcome back!');
                    }
                } else {
                    console.warn('Could not determine user type, redirecting to default page');
                    alert('Welcome back!');
                }
                
                // Store user type in localStorage for future use
                if (profileResult.success && profileResult.data) {
                    localStorage.setItem('userType', profileResult.data.user_type);
                    localStorage.setItem('userProfile', JSON.stringify(profileResult.data));
                }
                
                // Redirect to appropriate page
                window.location.href = redirectUrl;
            } else {
                console.error('Sign in failed:', result.error);
                alert('Sign in failed: ' + result.error);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert('An error occurred during sign in. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});