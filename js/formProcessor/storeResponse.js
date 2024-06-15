document.getElementById('creatorForm').addEventListener('submit', function() {
  localStorage.setItem('firstName', document.getElementById('firstName').value);
  localStorage.setItem('lastName', document.getElementById('lastName').value);
  localStorage.setItem('email', document.getElementById('email').value);
  localStorage.setItem('message', document.getElementById('message').value);
});