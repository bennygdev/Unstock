// Retrieve form data from localStorage
document.getElementById('responseFirstName').textContent = localStorage.getItem('firstName');
document.getElementById('responseLastName').textContent = localStorage.getItem('lastName');
document.getElementById('responseEmail').textContent = localStorage.getItem('email');
document.getElementById('responseMessage').textContent = localStorage.getItem('message');

// Clear the localStorage to avoid displaying the same data on next form submission
localStorage.removeItem("firstName")
localStorage.removeItem("lastName")
localStorage.removeItem("email")
localStorage.removeItem("message")