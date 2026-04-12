/**
 * Login Modal UI Component
 * Handles the display of the glassmorphic login overlay and OTP flow.
 */

class LoginModal {
    constructor() {
        this.isOpen = false;
        this.currentStep = 1;
        this.phoneNumber = '';
        this.init();
    }

    init() {
        // Only inject if it doesn't already exist
        if (document.getElementById('login-modal-overlay')) return;

        const modalHTML = `
            <div id="login-modal-overlay" class="login-modal-overlay">
                <div class="login-modal-container">
                    <button class="login-modal-close" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Step 1: Phone Number -->
                    <div id="login-step-1" class="login-step active">
                        <div class="login-step-wrapper">
                            <div class="login-header">
                                <div class="logo-text">SnapPrint</div>
                                <div class="subtitle">Login or Signup to continue</div>
                            </div>
                            
                            <div class="login-input-group">
                                <label for="phone-input">Phone Number</label>
                                <div class="phone-input-wrapper">
                                    <div class="country-code">+91</div>
                                    <input type="tel" id="phone-input" class="login-input" placeholder="Enter 10 digit number" maxlength="10" autocomplete="tel">
                                </div>
                                <span class="error-message" id="phone-error"></span>
                            </div>

                            <button id="send-otp-btn" class="login-btn-primary">
                                <span class="btn-text">Continue</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: OTP Verification -->
                    <div id="login-step-2" class="login-step">
                        <div class="login-step-wrapper">
                            <div class="login-header">
                                <div class="logo-text">Verify Phone</div>
                                <div class="subtitle" id="otp-subtitle">Code sent to +91 ******</div>
                            </div>
                            
                            <div class="login-input-group">
                                <label>Enter 6-digit OTP (Mock: 123456)</label>
                                <div class="otp-inputs">
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                    <input type="text" class="otp-box" maxlength="1" pattern="[0-9]*" inputmode="numeric" />
                                </div>
                                <span class="error-message" id="otp-error"></span>
                            </div>

                            <button id="verify-otp-btn" class="login-btn-primary">
                                <span class="btn-text">Verify & Login</span>
                                <div class="spinner"></div>
                            </button>

                            <div class="resend-text">
                                Didn't receive code? <a href="#" id="resend-otp-link">Resend</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.cacheDOM();
        this.bindEvents();
    }

    cacheDOM() {
        this.overlay = document.getElementById('login-modal-overlay');
        this.closeBtn = this.overlay.querySelector('.login-modal-close');
        
        this.step1 = document.getElementById('login-step-1');
        this.step2 = document.getElementById('login-step-2');
        
        this.phoneInput = document.getElementById('phone-input');
        this.sendOtpBtn = document.getElementById('send-otp-btn');
        this.phoneError = document.getElementById('phone-error');
        
        this.otpBoxes = Array.from(this.overlay.querySelectorAll('.otp-box'));
        this.verifyOtpBtn = document.getElementById('verify-otp-btn');
        this.otpError = document.getElementById('otp-error');
        this.otpSubtitle = document.getElementById('otp-subtitle');
        this.resendLink = document.getElementById('resend-otp-link');
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Phone Input
        this.phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            this.phoneError.textContent = '';
        });

        // Send OTP
        this.sendOtpBtn.addEventListener('click', () => this.handleSendOTP());
        this.phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendOTP();
        });

        // OTP Boxes Behavior
        this.otpBoxes.forEach((box, index) => {
            box.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value && index < 5) {
                    this.otpBoxes[index + 1].focus();
                }
                this.otpError.textContent = '';
            });

            box.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    this.otpBoxes[index - 1].focus();
                } else if (e.key === 'Enter') {
                    if (index === 5) this.handleVerifyOTP();
                }
            });
        });

        // Verify OTP
        this.verifyOtpBtn.addEventListener('click', () => this.handleVerifyOTP());

        // Resend
        this.resendLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSendOTP();
        });
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.reset();
        setTimeout(() => this.phoneInput.focus(), 100);
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
    }

    reset() {
        this.setStep(1);
        this.phoneInput.value = '';
        this.otpBoxes.forEach(box => box.value = '');
        this.phoneError.textContent = '';
        this.otpError.textContent = '';
        this.setLoading(this.sendOtpBtn, false);
        this.setLoading(this.verifyOtpBtn, false);
    }

    setStep(step) {
        this.currentStep = step;
        this.step1.classList.remove('active');
        this.step2.classList.remove('active');

        if (step === 1) {
            this.step1.classList.add('active');
        } else {
            this.step2.classList.add('active');
            const masked = this.phoneNumber.substring(0, 2) + '******' + this.phoneNumber.substring(8);
            this.otpSubtitle.textContent = `Code sent to +91 ${masked}`;
            setTimeout(() => this.otpBoxes[0].focus(), 100);
        }
    }

    setLoading(btn, isLoading) {
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    async handleSendOTP() {
        const phone = this.phoneInput.value.trim();
        if (phone.length < 10) {
            this.phoneError.textContent = 'Please enter a valid 10-digit number';
            return;
        }

        this.phoneNumber = phone;
        this.setLoading(this.sendOtpBtn, true);

        try {
            await window.authService.sendOTP(phone);
            this.setStep(2);
        } catch (error) {
            this.phoneError.textContent = error.message;
        } finally {
            this.setLoading(this.sendOtpBtn, false);
        }
    }

    async handleVerifyOTP() {
        const otp = this.otpBoxes.map(b => b.value).join('');
        if (otp.length < 6) {
            this.otpError.textContent = 'Please enter complete 6-digit OTP';
            return;
        }

        this.setLoading(this.verifyOtpBtn, true);

        try {
            await window.authService.verifyOTP(this.phoneNumber, otp);
            this.close();
            // Dispatch a global event indicating successful login
            window.dispatchEvent(new CustomEvent('auth:login-success'));
        } catch (error) {
            this.otpError.textContent = error.message;
            this.otpBoxes.forEach(b => b.value = '');
            this.otpBoxes[0].focus();
        } finally {
            this.setLoading(this.verifyOtpBtn, false);
        }
    }
}

// Ensure global initialization logic
window.addEventListener('DOMContentLoaded', () => {
    // Only init if it hasn't been explicitly skipped
    if (!window.skipLoginModalInit) {
        window.loginModal = new LoginModal();
    }
});
