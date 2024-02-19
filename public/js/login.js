let tempobj = {
  username_used: [],
  password_used: []
};
let Ip_log_count = 0;
let ipAddress = null;

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Fetching user input
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      ipAddress = document.getElementById("ip_value").value;
      tempobj.ip = ipAddress;

      // Load JSON file
      fetch("/data.json")
        .then((response) => response.json())
        .then((data) => {
          // Check username and password
          if (data["username"] === username && data["password"] === password) {
            tempobj = {};
            alert("Login successful!");
          } else {
            handleLoginFailure(username, password);
          }
        })
        .catch((error) => console.error("Error loading JSON file:", error));
    });
});

var attempts = 0;

function handleLoginFailure(username, password) {
  tempobj.username_used[attempts] = username;
  tempobj.password_used[attempts] = password;
  attempts++;
  //   attempts_log(username,password,attempts).then(res=> console.log("Logs updated"));
  var remainingAttempts = 3 - attempts;

  if (remainingAttempts > 0) {
    alert("Login failed. Remaining attempts: " + remainingAttempts);
  } else {
    update_log();
    alert("Login attempts exhausted. Initiating capture process...");
    captureAndStoreImages(Ip_log_count);
  }
}

function update_log() {
  fetch("/ip_logs")
    .then((response) => response.json())
    .then((data) => {
      // Modify the array by pushing a new object
      Ip_log_count = data.length + 1;
      tempobj.id = Ip_log_count;
      tempobj.User_image = Ip_log_count + ipAddress + ".jpg";
      data.push(tempobj);

      // Send the modified array back to the server
      fetch("/update_ip_logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((updatedData) => {
          console.log("Updated IP logs:", updatedData);
        })
        .catch((error) => {
          console.error("Error updating IP logs:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching IP logs:", error);
    });
}

function captureAndStoreImages(image_id) {
  // Update the URL to match your server's address and port
  const serverURL = "http://localhost:8000";

  // Make a GET request to the /capture-images endpoint
  fetch(`${serverURL}/capture-image?id=${image_id}`)
    .then((response) => {
      if (response.ok) {
        alert("Image captured and stored successfully");
      } else {
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
