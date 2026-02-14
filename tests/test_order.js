const http = require('http');

const data = JSON.stringify({
    userId: '2',
    items: [{ id: 2, name: 'Vada Pav', qty: 2, price: 20 }],
    total: 40
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', responseBody);
        process.exit(0);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
    process.exit(1);
});

req.write(data);
req.end();
