const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

let obj = {};
let ip = "42.104.142.68";

const HOST = "https://api.whatismyip.com/";
const TOOL_FILE_NAME = [ "proxy.php?", "ip-address-lookup.php?", "domain-black-list.php?", "host-name.php?", "whois.php?", "user-agent.php?"];
const OUTPUT_FORMAT = "&output=json";
const INPUT = `&input=${ip}`;
const API_KEY = "key=eb5fee85322e9bc7822bf0040709e653";
const TEST_JSON_FILE = 'test.json';

async function makeApiCall(toolFileName) {
  const apiUrl = `${HOST}${toolFileName}${API_KEY}${INPUT}${OUTPUT_FORMAT}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error making API call for ${toolFileName}: ${error.message}`);
    return null;
  }
}

async function updateObjectWithApiResponse(toolFileName) {
  const response = await makeApiCall(toolFileName);
  if (response) {
    if (toolFileName === 'proxy.php?') {
      obj = { ...obj, ...{ 'proxy-check': response['proxy-check'] } };
    } else {
      obj = { ...obj, ...response };
    }
  }
}

async function writeToTestJson() {
  try {
    // Read existing data from test.json
    const filename = 'test.json'; // Replace with your actual file name
    const filePath = path.join(__dirname, filename);
    const existingData = await fs.readFile(filePath, 'utf-8');
    const dataArray = JSON.parse(existingData);

    // Append the new object to the array
    dataArray.push(obj);

    // Write the updated array back to test.json
    await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
    console.log('Data successfully written to test.json');
  } catch (error) {
    console.error('Error writing to test.json:', error.message);
  }
}

async function main() {
  for (const toolFileName of TOOL_FILE_NAME) {
    await updateObjectWithApiResponse(toolFileName);
  }

  await writeToTestJson();
}

main();
