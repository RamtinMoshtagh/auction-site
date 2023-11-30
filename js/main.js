async function showRegister() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h1>Register</h1>
        <form id="register-form" class="row g-3">
            <div class="col-md-6">
                <input type="text" class="form-control" id="register-name" placeholder="Username" required>
            </div>
            <div class="col-md-6">
                <input type="email" class="form-control" id="register-email" placeholder="Email" required>
            </div>
            <div class="col-12">
                <input type="password" class="form-control" id="register-password" placeholder="Password" required>
            </div>
            <div class="col-12">
                <input type="url" class="form-control" id="register-avatar" placeholder="Avatar URL (optional)">
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Register</button>
            </div>
        </form>
    `;
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const avatar = document.getElementById('register-avatar').value;

    const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password,
            avatar
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Registration successful', data);
        // Handle successful registration (e.g., show login page or auto-login)
    } else {
        console.error('Registration failed', data);
        // Handle registration errors
    }
}

function showHome() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<h1>Welcome to the Auction Site</h1>';
    // Add more home page content here
}

function showLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h1>Login</h1>
        <form id="login-form" class="row g-3">
            <div class="col-md-6">
                <input type="email" class="form-control" id="login-email" placeholder="Email" required />
            </div>
            <div class="col-md-6">
                <input type="password" class="form-control" id="login-password" placeholder="Password" required />
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Login successful', data);
        onLoginSuccess(data);
    } else {
        console.error('Login failed', data);
        // Handle login errors
    }
}

function onLoginSuccess(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    updateNavigation();
    // Redirect to home page or show user profile, etc.
}

function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // User is logged in, update navigation accordingly
        // Hide login/register and show logout/profile options
    } else {
        // User is not logged in, show default navigation options
    }
}

function logout() {
    localStorage.removeItem('user');
    updateNavigation();
    // Redirect to home page or login page
}

document.getElementById('home-link').addEventListener('click', function(event) {
    event.preventDefault();
    showHome();
});

document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault();
    showLogin();
});

document.getElementById('register-link').addEventListener('click', function(event) {
    event.preventDefault();
    showRegister();
});

// Initialize with the home view
showHome();
