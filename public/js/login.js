let tempobj = {
  Id:null,
  IP_Address:null,
  Employee_UserIDs_used: [],
  OTPs_used: [],
  User_Image_File:null
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Fetching user input
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      tempobj.IP_Address = document.getElementById("ip_value").value;
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
  tempobj.Employee_UserIDs_used[attempts] = username;
  tempobj.OTPs_used[attempts] = password;
  attempts++;
  //   attempts_log(username,password,attempts).then(res=> console.log("Logs updated"));
  var remainingAttempts = 3 - attempts;

  if (remainingAttempts > 0) {
    alert("Login failed. Remaining attempts: " + remainingAttempts);
  } else {
    update_users_log();
    alert("Login attempts exhausted. Initiating capture process...");
    captureAndStoreImages();
  }
}

function update_users_log() {
  fetch("/get_users_log")
    .then((response) => response.json())
    .then((data) => {
      tempobj.Id = data.length + 1;
      tempobj.User_Image_File = tempobj.Id +"_"+ tempobj.IP_Address + ".jpg";
      data.push(tempobj);

      // Send the modified array back to the server
      fetch("/update_users_log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((updatedData) => {
          console.log("Updated Users log:", updatedData);
        })
        .catch((error) => {
          console.error("Error updating Users log:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching Users log:", error);
    });
}

function captureAndStoreImages() {
  // Update the URL to match your server's address and port
  const serverURL = "http://localhost:8000";

  // Make a GET request to the /capture-images endpoint
  fetch(`${serverURL}/capture-image`)
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

// function update_IPs_log(){
//   fetch(`/update_IPs_log?id=${tempobj.Id}`)
//     .then((response) => response.json())
//     .then((data) => {
//       if(data.success === true){
//         console.log("Updated IPs log Successfully");
//       }else{
//         console.log("Failed to Update IPs log");
//       }
//     })
//   .catch((error) => {
//       console.error("Error updating IPs logs:", error);
//   });
// }