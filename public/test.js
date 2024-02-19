const axios = require('axios');

let obj = {};
let ip = "42.104.131.67";

const HOST = "https://api.whatismyip.com/";
const TOOL_FILE_NAME = [ "proxy.php?", "ip-address-lookup.php?", "domain-black-list.php?", "host-name.php?", "whois.php?", "user-agent.php?"];
const OUTPUT_FORMAT = "&output=json";
const INPUT = `&input=${ip}`;
const API_KEY = "key=eb5fee85322e9bc7822bf0040709e653";

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
    // if (toolFileName === 'proxy.php?') {
    //   obj = { ...obj, ...{ 'proxy-check': response['proxy-check'] } };
    // } else {
    //   obj = { ...obj, ...response };
    // }
    obj = { ...obj, ...response };
  }
}

async function main() {
  for (const toolFileName of TOOL_FILE_NAME) {
    await updateObjectWithApiResponse(toolFileName);
  }

  console.log("Final obj:", obj);
}

main();
