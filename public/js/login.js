// const axios = require('axios');
// const fs = require('fs').promises;
// const path = require('path');


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
  fetch("/get_user_logs")
    .then((response) => response.json())
    .then((data) => {
      // Modify the array by pushing a new object
      Ip_log_count = data.length + 1;
      tempobj.id = Ip_log_count;
      tempobj.User_image = Ip_log_count + ipAddress + ".jpg";
      // if(Array.isArray(data)){
      //   console.log("Data returned by route /ip_logs is an array");
      // }else{
      //   console.log("Data returned by route /ip_logs is not an array");
      // }
      // main();
      data.push(tempobj);

      // Send the modified array back to the server
      fetch("/update_user_logs", {
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
  console.log(`image at the capturing function request` + image_id);
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

// const HOST = "https://api.whatismyip.com/";
// const TOOL_FILE_NAME = [ "proxy.php?", "ip-address-lookup.php?", "domain-black-list.php?", "host-name.php?", "whois.php?", "user-agent.php?"];
// const OUTPUT_FORMAT = "&output=json";
// const INPUT = `&input=${ipAddress}`;
// const API_KEY = "key=eb5fee85322e9bc7822bf0040709e653";
// const TEST_JSON_FILE = 'test.json';

// async function makeApiCall(toolFileName) {
//   const apiUrl = `${HOST}${toolFileName}${API_KEY}${INPUT}${OUTPUT_FORMAT}`;
//   try {
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (error) {
//     console.error(`Error making API call for ${toolFileName}: ${error.message}`);
//     return null;
//   }
// }

// async function updateObjectWithApiResponse(toolFileName) {
//   const response = await makeApiCall(toolFileName);
//   if (response) {
//     if (toolFileName === 'proxy.php?') {
//       tempobj = { ...obj, ...{ 'proxy-check': response['proxy-check'] } };
//     } else {
//       obj = { ...obj, ...response };
//     }
//   }
// }

// async function writeToTestJson() {
//   try {
//     // Read existing data from test.json
//     const filename = 'test.json'; // Replace with your actual file name
//     const filePath = path.join(__dirname, filename);
//     const existingData = await fs.readFile(filePath, 'utf-8');
//     const dataArray = JSON.parse(existingData);

//     // Append the new object to the array
//     dataArray.push(obj);

//     // Write the updated array back to test.json
//     await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
//     console.log('Data successfully written to test.json');
//   } catch (error) {
//     console.error('Error writing to test.json:', error.message);
//   }
// }

// async function main() {
//   for (const toolFileName of TOOL_FILE_NAME) {
//     await updateObjectWithApiResponse(toolFileName);
//   }

// }