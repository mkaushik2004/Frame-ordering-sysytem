// login-verify.js — Clean PHP-based login system

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

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// 🔐 Auto-redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    const userAuth = sessionStorage.getItem('userAuthenticated');
    if (adminAuth === 'true') window.location.href = 'admin.html';
    if (userAuth === 'true') window.location.href = 'index.html';

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const button = form.querySelector('button[type="submit"]');
        if (button.disabled) return;

        if (!username || !password) {
            showAlert('Please enter both username/email and password');
            return;
        }

        // 🧠 Handle hardcoded Admin instantly (no PHP fetch)

        // 🧩 Otherwise, normal PHP user login
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
                console.error('Invalid JSON from PHP:', text);
                throw new Error('Server error: invalid JSON');
            }

            if (data.success) {
                sessionStorage.setItem("userAuthenticated", "true");
                localStorage.setItem("username", data.user?.name || username);
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = "index.html", 1000);
            } else {
                showAlert(data.message || 'Invalid username or password');
            }

        } catch (err) {
            console.error('Login error:', err);
            showAlert('Could not connect to PHP backend. Ensure Apache is running.');
        } finally {
            hideLoading(button);
        }
    });
});
