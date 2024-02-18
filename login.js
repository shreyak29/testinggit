
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the username and password from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Construct the request body
    const data = {
        username: username,
        password: password
    };

    // Send a POST request to the backend API
    fetch('http://localhost:4000/user/login', { // Adjust the URL accordingly
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response body as JSON
    })
    .then(data => {
        // Handle successful login
        console.log('Login successful:', data);
        // Redirect to another page or perform any other action
        window.location.href = 'http://127.0.0.1:5500/studentpage/index.html'; // Redirect URL
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
        alert('Login failed. Please try again.'); // Display an error message
    });
});
