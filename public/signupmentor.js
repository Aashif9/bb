document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("graduation-year");
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 30; i++) {
      const year = currentYear - i;
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  
    const form = document.getElementById("mentorForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMsg = document.getElementById("statusMsg");
  
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const college = document.getElementById("college").value.trim();
        const degree = document.getElementById("degree").value.trim();
        const graduationYear = document.getElementById("graduation-year").value;
        const currentRole = document.getElementById("current-role").value.trim();
        const company = document.getElementById("company").value.trim();
        const experience = document.getElementById("experience").value;
        const expertise = document.getElementById("expertise").value.trim();
        const mentoringExperience = document.getElementById("mentoring-experience").value;
        const availability = document.getElementById("availability").value;
        const motivation = document.getElementById("motivation").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        
        // Validate passwords
        if (password !== confirmPassword) {
            statusMsg.textContent = 'Passwords do not match. Please try again.';
            statusMsg.style.color = "red";
            return;
        }
        
        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !college || !degree || !graduationYear || !currentRole || !company || !expertise || !mentoringExperience || !availability || !motivation) {
            statusMsg.textContent = 'Please fill out all required fields.';
            statusMsg.style.color = "red";
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusMsg.textContent = 'Please enter a valid email address.';
            statusMsg.style.color = "red";
            return;
        }
        
        // Validate phone format (basic validation)
        const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(phone)) {
            statusMsg.textContent = 'Please enter a valid phone number.';
            statusMsg.style.color = "red";
            return;
        }
        
        // Validate password strength
        if (password.length < 6) {
            statusMsg.textContent = 'Password must be at least 6 characters long.';
            statusMsg.style.color = "red";
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";
        statusMsg.textContent = "";
        
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
                college: college,
                degree: degree,
                graduation_year: parseInt(graduationYear),
                current_role: currentRole,
                company: company,
                experience_years: parseInt(experience),
                expertise: expertise,
                mentoring_experience: mentoringExperience,
                weekly_availability: availability,
                motivation: motivation,
                user_type: 'mentor',
                profile_completed: true,
                created_at: new Date().toISOString()
            };
            
            // Sign up with Supabase
            const result = await window.db.signUp(email, password, userData);
            
            if (result.success) {
                console.log('Mentor signup successful:', result.data);
                statusMsg.textContent = "Account created successfully! Please check your email to verify your account.";
                statusMsg.style.color = "green";
                
                // Store user data locally
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    window.location.href = 'signin.html';
                }, 2000);
            } else {
                console.error('Signup failed:', result.error);
                statusMsg.textContent = 'Signup failed: ' + result.error;
                statusMsg.style.color = "red";
            }
        } catch (error) {
            console.error('Signup error:', error);
            statusMsg.textContent = 'An error occurred during signup. Please try again.';
            statusMsg.style.color = "red";
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Mentor Account";
        }
    });
});