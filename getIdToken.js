const axios = require('axios');

const email = 'test30@gmail.com';
const password = '1234567';
const apiKey = 'AIzaSyAuh64b_I2OtC7KYuubCVx9plEe2pojp2M'; // TU API KEY

const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

axios.post(url, {
  email,
  password,
  returnSecureToken: true
})
.then(res => {
  console.log('✅ ID Token:', res.data.idToken);
})
.catch(err => {
  console.error('❌ Error al obtener token:\n', err.response.data);
});
