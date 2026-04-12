/**
 * Profile Page Logic
 * Handles checking auth session, loading user data, and updating profile info.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth state
    const user = window.authService.getCurrentUser();
    if (!user) {
        // Not logged in, bounds back to homepage
        window.location.href = 'index.html';
        return;
    }

    // 2. Load basic info
    const greeting = document.getElementById('profile-greeting');
    const phoneView = document.getElementById('profile-phone');
    const inputName = document.getElementById('profile-name');
    const inputEmail = document.getElementById('profile-email');
    const inputPhone = document.getElementById('profile-phone-input');
    const inputAddress = document.getElementById('profile-address');
    const inputPincode = document.getElementById('profile-pincode');

    const updateView = (u) => {
        greeting.textContent = u.name ? `Welcome back, ${u.name.split(' ')[0]}!` : 'Welcome back!';
        phoneView.textContent = u.phone ? `+91 ${u.phone.substring(0,2)}******${u.phone.substring(8)}` : '';
        inputName.value = u.name || '';
        inputEmail.value = u.email || '';
        inputPhone.value = u.phone || '';
        inputAddress.value = u.address || '';
        inputPincode.value = u.pincode || '';
    }

    updateView(user);

    // 3. Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetViewId = `view-${item.dataset.view}`;
            
            // Update active sidebar item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle views
            contentViews.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });

            // Smooth scroll to top on mobile
            if (window.innerWidth <= 900) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 4. Setup Edit Toggle
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const formActions = document.querySelector('.form-actions');
    const profileForm = document.getElementById('profile-form');
    const inputsToEdit = [inputName, inputEmail, inputAddress, inputPincode]; // We won't allow phone edit in this mock

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = false);
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
        inputName.focus();
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = true);
        formActions.style.display = 'none';
        editBtn.style.display = 'block';
        updateView(window.authService.getCurrentUser()); // Reset logic
    });

    // 5. Save form
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-profile-btn');
        const ogText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            const updatedUser = await window.authService.updateProfile({
                name: inputName.value.trim(),
                email: inputEmail.value.trim(),
                address: inputAddress.value.trim(),
                pincode: inputPincode.value.trim()
            });

            updateView(updatedUser);
            inputsToEdit.forEach(i => i.disabled = true);
            formActions.style.display = 'none';
            editBtn.style.display = 'block';
            
            // Dispatch event so Header might update immediately if it showed name
            window.dispatchEvent(new CustomEvent('auth:profile-updated'));

        } catch (error) {
            console.error(error);
            alert('Failed to save profile!');
        } finally {
            saveBtn.textContent = ogText;
            saveBtn.disabled = false;
        }
    });

    // 6. Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        window.authService.logout();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = 'index.html';
    });
});
