const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');


dotenv.config();

const app = express();
const port = 8000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Serve your HTML, CSS, and JS files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// middleware to parse json data
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Set 'views' directory for EJS files
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

let constantIP = null; // Variable to store the IP address
// object to store Ips data
// let obj = {
//     ID:null,
//     IP_Address:null
//   };
// // Variables to make api call
// const HOST = process.env.HOST;
// const TOOL_FILE_NAME = JSON.parse(process.env.TOOL_FILE_NAME);
// const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT;
// const INPUT = `&input=${obj.IP_Address}`;
// const API_KEY = process.env.API_KEY;
// Base route handler
app.get('/login', (req, res) => {
    // Access the IP address directly from the query parameter
    const clientIP = (req.query.ip).trim();

    // If an IP address is present, save it in the constant variable
    if (clientIP) {
        constantIP = clientIP;
        // obj.IP_Address = constantIP;
        console.log(`IP address set to: ${constantIP}`);
    }

    // You can use the IP address to customize your response or perform other actions
    console.log(`IP address is set to : ${clientIP}`);

     // Render the 'index' EJS view and pass the constantIP variable
     res.render('index', { constantIP });
});

// route to access to data.json
app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, '/data.json'));
});

// Endpoint to run the Python script

app.post('/capture-image', (req, res) => {
    const pythonScriptPath = path.join(__dirname, 'scripts/CaptureImage.py');
    let image_name = req.body.filename; 
    const pythonProcess = exec(`python ${pythonScriptPath} ${image_name}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing CaptureImage.py: ${error}`);
            console.error(`stderr: ${stderr}`);
            res.status(500).json({ success: false, error: 'Failed to capture images' });
        } else {
            res.status(200).json({ success: true, message: 'Image captured and stored successfully' });
        }
    });
    pythonProcess.on('error', (err) => {
        console.error(`Error event from python process: ${err}`);
        res.status(500).json({ success: false, error: 'Failed to capture images' });
    });
});

// Read the content of fraud_ip_log.json file rout

app.get('/get_users_log', (req, res) => {
    const filePath = path.join(__dirname, 'fraud_users_log.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading fraud_users_log.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing fraud_users_log.json:', parseError);
            res.status(500).send('Internal Server Error');
        }
    });
});

// update the fraud_ip_log file route

app.post('/update_users_log', (req, res) => {
    // Get the modified array from the request body
    const updatedData = req.body;
  
    // Write the updated array back to the fraud_ip_log.json file
    const filePath = path.join(__dirname, 'fraud_users_log.json');
    fs.writeFile(filePath, JSON.stringify(updatedData), 'utf-8', (err) => {
      if (err) {
        console.error('Error updating fraud_users_log.json:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Fraud Users logs updated successfully');
        res.json(updatedData);
      }
    });
});

// app.get('/update_IPs_log', async (req, res) => {
//     try {
//       obj.ID = req.query.id;
//       const result = await main();
//       res.json(result);
//     } catch (error) {
//       console.error('Error handling update request:', error.message);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

// async function main() {
//     try {
//         const promises = TOOL_FILE_NAME.map(updateObjectWithApiResponse);
//         await Promise.all(promises);
    
//         await writeToTestJson();
    
//         return { success: true, message: 'Data successfully updated' };
//     } catch (error) {
//         console.error('Error in main function:', error.message);
//         return { success: false, message: 'Failed to update data' };
//     }
// }
// async function updateObjectWithApiResponse(toolFileName) {
//     const response = await makeApiCall(toolFileName);
//     if (response) {
//       if (toolFileName === 'proxy.php?') {
//         // If the tool is proxy.php, update the 'proxy-check' property
//         obj['proxy-check'] = response['proxy-check'];
//       } else {
//         // Otherwise, update each property individually
//         Object.keys(response).forEach(key => {
//           obj[key] = response[key];
//         });
//       }
//     }
// }
// async function makeApiCall(toolFileName) {
//     const apiUrl = `${HOST}${toolFileName}${API_KEY}${INPUT}${OUTPUT_FORMAT}`;
//     try {
//       const response = await axios.get(apiUrl);
//       return response.data;
//     } catch (error) {
//       console.error(`Error making API call for ${toolFileName}: ${error.message}`);
//       return null;
//     }
// }
// async function writeToTestJson() {
//     try {
//       // Read existing data from test.json
//       const filename = 'fraud_IPs_log.json'; // Replace with your actual file name
//       const filePath = path.join(__dirname, filename);
//       const existingData = await fs.readFile(filePath, 'utf-8');
//       const dataArray = JSON.parse(existingData);
  
//       // Append the new object to the array
//       dataArray.push(obj);
  
//       // Write the updated array back to test.json
//       await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
//       console.log('Data successfully written to test.json');
//     } catch (error) {
//       console.error('Error writing to test.json:', error.message);
//     }
// }

