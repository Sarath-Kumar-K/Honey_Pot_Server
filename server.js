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
// app.use(express.static(path.join(__dirname, '../public')));

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
        constantIP = clientIP;
        console.log(`IP address set to: ${constantIP}`);
    }

    // You can use the IP address to customize your response or perform other actions
    // console.log(`Request from IP address: ${clientIP}`);

    // Serve the 'index.html' file
    res.sendFile(path.join(__dirname, 'views/index.ejs'), { constantIP });
});

// Endpoint to run the Python script
// Unique id number every image 
let image_id = 1;
app.get('/capture-images', (req, res) => {
    const pythonScriptPath = path.join(__dirname, 'scripts/CaptureImage.py');
    let filename = image_id + constantIP + ".jpg"

    const pythonProcess = exec(`python ${pythonScriptPath} ${filename}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing CaptureImage.py: ${error}`);
            console.error(`stderr: ${stderr}`);
            res.status(500).json({ success: false, error: 'Failed to capture images' });
        } else {
            image_id = image_id + 1;
            res.status(200).json({ success: true, message: 'Image captured successfully' });
        }
    });

    pythonProcess.on('error', (err) => {
        console.error(`Error event from python process: ${err}`);
        res.status(500).json({ success: false, error: 'Failed to capture images' });
    });
});


app.get('/ip_logs', (req, res) => {
    // Read the content of fraud_ip_log.json file
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


