const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    const form = new FormData();
    // we don't have a file, just test what error it gives
    const res = await axios.put('http://localhost:5000/api/users/avatar', form, {
      headers: form.getHeaders(),
      // pass a dummy token or no token to see what happens
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

testUpload();
