const axios = require('axios');
const initGet = {
  uri: 'http://localhost:3000/'
};

const getAll = function () {
  return axios.all([
      axios.get(initGet.uri + 'users/'),
      axios.get(initGet.uri + 'activities/')
    ])
    .then(axios.spread((userResponse, activitiesResponse) => {
      const data = {
        users: userResponse.data ,
        activities: activitiesResponse.data 
      };
      return data;

    }))
};
module.exports = {
  getAll: getAll
};