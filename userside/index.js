const os = require('os');
const axios = require('axios');

// Replace with your server's endpoint
const SERVER_URL = 'https://bus-server-ssh.vercel.app/ip-update';

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

let successCount = 0;
const MAX_SUCCESS = 5;

const intervalId = setInterval(async () => {
    const localIP = getLocalIPAddress();
    try {
        const response = await axios.post(SERVER_URL, {
            ip: localIP,
            hostname: os.hostname()
        });
        console.log(`(${successCount + 1}) IP sent successfully: ${localIP}`);
        successCount++;

        if (successCount >= MAX_SUCCESS) {
            console.log(`Successfully sent data ${MAX_SUCCESS} times. Exiting.`);
            clearInterval(intervalId);
        }
    } catch (error) {
        console.error('Error sending IP:', error.message);
        // Note: we do not increment successCount on failure
    }
}, 5000);
