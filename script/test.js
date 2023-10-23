const axios = require('axios');
const params = {
  access_key: '27b85d376b7c166a6b9445c63c1a5946',
  query: '1600 Pennsylvania Ave NW'
}

axios.get('https://api.positionstack.com/v1/forward', {params})
  .then(response => {
    console.log(response.data);
  }).catch(error => {
    console.log(error);
  });