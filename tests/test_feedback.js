const http = require('http');

const data = JSON.stringify({
    name: "Test Student",
    email: "student@test.com",
    contact: "9876543210",
    message: "The samosas were cold today.",
    photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/complaints',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', responseBody);
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error('Error:', e);
    process.exit(1);
});

req.write(data);
req.end();
