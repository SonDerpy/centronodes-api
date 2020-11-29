
const fetch = require("node-fetch")

function ApiError(message, data, status) {
  let response = null;
  let isObject = false;


  try {
    response = JSON.parse(data);
    isObject = true;
  } catch (e) {
    response = data;
  }

  this.response = response;
  this.message = message;
  this.status = status;
  this.toString = function () {
    return `${ this.message }\nResponse:\n${ isObject ? JSON.stringify(this.response, null, 2) : this.response }`;
  };
}

// API wrapper function
const fetchResource = (user_id, userOptions = {}) => {

  const defaultOptions = {};

  const defaultHeaders = {};

  const options = {

    ...defaultOptions,
    ...userOptions,

    headers: {
      ...defaultHeaders,
      ...userOptions.headers,
    },
  };

  const url = `https://api.centronodes.com/1.0/index.php?user_id=${user_id}`;

  
  let response = null;

  return fetch(url, options)
    .then(responseObject => {
    
      response = responseObject;

      
      if (response.status === 401) {
       
      }

      if (response.status < 200 || response.status >= 300) {
      
        return response.text();
      }

     
      return response.json();
    })
  
    .then(parsedResponse => {
      // Check for HTTP error codes
      if (response.status < 200 || response.status >= 300) {
        // Throw error
        throw parsedResponse;
      }

      // Request succeeded
      return parsedResponse;
    })
    .catch(error => {
      
      if (response) {
        throw new ApiError(`Request failed with status ${ response.status }.`, error, response.status);
      } else {
        throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
      }
    });
};

function getData(user_id) {
    return fetchResource(`${user_id}`, 'users');
  }
module.exports.getData = getData;
module.exports.fetchResource = fetchResource;
