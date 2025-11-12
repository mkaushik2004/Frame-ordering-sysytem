// login-verify.js — Clean PHP-based login

// Show loading spinner
function showLoading(button) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
}

// Hide loading spinner
function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
}

// Show alert message
function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const form = document.querySelector('form');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Handle login submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('Login form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const button = form.querySelector('button[type="submit"]');

        if (!username || !password) {
            showAlert('Please enter both username/email and password');
            return;
        }

        try {
            showLoading(button);
            const res = await fetch('../backend/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error('Invalid JSON:', text);
                throw new Error('Server error: invalid response');
            }

            if (data.success) {
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                showAlert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            showAlert('Could not connect to server. Make sure PHP is running.');
        } finally {
            hideLoading(button);
        }
    });
});
