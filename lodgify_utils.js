const axios = require("axios");


module.exports.importProperties = async function ({apiKey}) {


    const options = {
        method: 'GET',
        url: 'https://api.lodgify.com/v2/properties?includeCount=false&includeInOut=false&page=1&size=99999',
        headers: {
            accept: 'application/json',
            'X-ApiKey': apiKey,
        }
    };


    try {
        const response = await axios
            .request(options);
        return response.data.items;
    } catch (error) {
        console.error('Failed to refresh token:', error.response ? error.response.data : error.message);
    }
}



