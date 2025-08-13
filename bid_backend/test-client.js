// Simple test client for the registration API
const http = require('http');

const testRegistration = () => {
    const postData = JSON.stringify({
        fullname: "Clean Test User",
        email: "cleantest" + Date.now() + "@example.com",
        password: "testpassword123",
        role: "bidder"
    });

    const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Response:', data);
            try {
                const response = JSON.parse(data);
                console.log('Parsed response:', response);
            } catch (e) {
                console.log('Could not parse JSON response');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
};

console.log('Testing registration...');
testRegistration();
