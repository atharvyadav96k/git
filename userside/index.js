const os = require('os');
const axios = require('axios');

// Replace with your server's endpoint
const SERVER_URL = 'http://localhost:3000/ip-update';

// Function to get local IP address
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address;
            }
        }
    }
    return '0.0.0.0';
}

async function sendIPToServer() {
    const localIP = getLocalIPAddress();
    try {
        const response = await axios.post(SERVER_URL, {
            ip: localIP,
            hostname: os.hostname()
        });
        console.log(`IP sent successfully: ${localIP}`);
    } catch (error) {
        console.error('Error sending IP:', error.message);
    }
}

// Send IP every 5 seconds
setInterval(sendIPToServer, 5000);
