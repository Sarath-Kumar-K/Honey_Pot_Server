const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 8000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Serve your HTML, CSS, and JS files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for EJS files
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

let constantIP = null; // Variable to store the IP address

// Base route handler
app.get('/', (req, res) => {
    // Access the IP address directly from the query parameter
    const clientIP = req.query.ip;

    // If an IP address is present, save it in the constant variable
    if (clientIP) {
        constantIP = clientIP.trim();
        console.log(`IP address set to: ${constantIP}`);
    }

    // You can use the IP address to customize your response or perform other actions
    // console.log(`Request from IP address: ${clientIP}`);

     // Render the 'index' EJS view and pass the constantIP variable
     res.render('index', { constantIP });
});

// route to access to data.json
app.get('/data.json', (req, res) => {
    console.log("/data.json route called");
    res.sendFile(path.join(__dirname, '/data.json'));
});

// Endpoint to run the Python script
// Unique id number every image 
let image_id = 1;
app.get('/capture-image', (req, res) => {
    const pythonScriptPath = path.join(__dirname, 'scripts/CaptureImage.py');
    let filename = image_id + "_" + constantIP + ".jpg";

    const pythonProcess = exec(`python ${pythonScriptPath} ${filename}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing CaptureImage.py: ${error}`);
            console.error(`stderr: ${stderr}`);
            res.status(500).json({ success: false, error: 'Failed to capture images' });
        } else {
            image_id = image_id + 1;
            res.status(200).json({ success: true, message: 'Image captured and stored successfully' });
        }
    });

    pythonProcess.on('error', (err) => {
        console.error(`Error event from python process: ${err}`);
        res.status(500).json({ success: false, error: 'Failed to capture images' });
    });
});


app.get('/get_user_logs', (req, res) => {
    const filePath = path.join(__dirname, 'fraud_ip_log.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading fraud_ip_log.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing fraud_ip_log.json:', parseError);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/update_user_logs', (req, res) =>{
    const updatedData = req.body;
    try {
        // Read existing data from test.json
        const filename = 'fraud_ip_log.json'; // Replace with your actual file name
        const filePath = path.join(__dirname, filename);
        const existingData = fs.readFile(filePath, 'utf-8');
        const dataArray = JSON.parse(existingData);
    
        // Append the new object to the array
        dataArray.push(updatedData);
    
        // Write the updated array back to test.json
        fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
        console.log('Data successfully written to test.json');
      } catch (error) {
        console.error('Error writing to test.json:', error.message);
      }
});