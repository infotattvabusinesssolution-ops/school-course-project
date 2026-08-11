const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const body = `--${boundary}\r
Content-Disposition: form-data; name="profilePhoto"; filename="test.jpg"\r
Content-Type: image/jpeg\r
\r
123456\r
--${boundary}--\r
`;

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/avatar',
  method: 'PUT',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body),
    // Need a dummy token to pass 'protect'
    // Actually, I can't easily get a valid token. 
    // If it fails at 'protect', it should return 401 Not authorized, no token provided.
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});

req.on('error', console.error);
req.write(body);
req.end();
