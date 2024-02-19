
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Fetching user input
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      // Load JSON file
      fetch('/data.json')
        .then((response) => response.json())
        .then((data) => {
          // Check username and password
          if (data["username"] === username && data["password"] === password) {
            alert("Login successful!");
          } else {
            handleLoginFailure();
          }
        })
        .catch((error) => console.error("Error loading JSON file:", error));
    });
});

var attempts = 0;

function handleLoginFailure() {
  attempts++;
//   attempts_log(username,password,attempts).then(res=> console.log("Logs updated"));
  var remainingAttempts = 3 - attempts;

  if (remainingAttempts > 0) {
    alert("Login failed. Remaining attempts: " + remainingAttempts);
  } else {
    alert("Login attempts exhausted. Initiating capture process...");
    captureAndStoreImages();
  }
}


function captureAndStoreImages() {
  // Update the URL to match your server's address and port
  const serverURL = "http://localhost:8000";

  // Make a GET request to the /capture-images endpoint
  fetch(`${serverURL}/capture-image`)
    .then((response) => {
      if (response.ok) {
        alert("Image captured and stored successfully");
      }else{
        alert("Failed to capture and store images");
      }
    return response.json(); // Assuming the server returns JSON with some information
    })
    .then((data) => {
      // Handle the response data if needed
      console.log("Server response:", data);
    })
    .catch((error) => {
      console.log("Error capturing and storing images:", error);
    });
}
