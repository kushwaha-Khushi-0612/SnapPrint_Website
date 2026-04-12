/**
 * Mock Auth Service
 * Simulates a backend OTP authentication flow and maintains a JSON database in localStorage.
 */

const SESSION_KEY = 'snapprint_active_session';
const API_BASE = 'api'; // Base path for PHP API

const authService = {
    /**
     * Send OTP to a phone number.
     * @param {string} phone 
     * @returns {Promise<boolean>}
     */
    sendOTP: async (phone) => {
        try {
            const response = await fetch(`${API_BASE}/auth.php?action=sendOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
            return true;
        } catch (error) {
            console.error('sendOTP Error:', error);
            throw error;
        }
    },

    /**
     * Verify the OTP provided by the user.
     * @param {string} phone 
     * @param {string} otp 
     * @returns {Promise<Object>}
     */
    verifyOTP: async (phone, otp) => {
        try {
            const response = await fetch(`${API_BASE}/auth.php?action=verifyOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'OTP Verification Failed');
            
            const user = data.user;
            // Create session
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('verifyOTP Error:', error);
            throw error;
        }
    },

    /**
     * Update current user profile details
     * @param {Object} updates 
     */
    updateProfile: async (updates) => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) throw new Error('Not authenticated');

            const response = await fetch(`${API_BASE}/profile.php?action=update&userId=${currentUser.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update profile');
            
            const updatedUser = data.profile;
            // Update session locally to reflect changes immediately
            localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            console.error('updateProfile Error:', error);
            throw error;
        }
    },

    /**
     * Reload profile data from server
     * @returns {Promise<Object>}
     */
    reloadProfile: async () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return null;
        
        try {
            const response = await fetch(`${API_BASE}/profile.php?userId=${currentUser.id}`);
            if (!response.ok) {
                // If profile deleted or inaccessible, log user out
                if (response.status === 404) authService.logout();
                return null;
            }
            const data = await response.json();
            localStorage.setItem(SESSION_KEY, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('reloadProfile Error:', error);
            return currentUser; // return stale data if offline
        }
    },

    /**
     * Get the current active user session
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    /**
     * Delete the current session
     */
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.reload();
    }
};

// Expose globally
window.authService = authService;
