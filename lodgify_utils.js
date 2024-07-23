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
        if (response.status === 200) {
            return response.data.items;
        } else {
            throw response.data.message;
        }
    } catch (error) {
        console.error('Failed to refresh token:', error.response ? error.response.data : error.message);
    }
}


module.exports.getBookings = async function ({apiKey }) {


    const options = {
        method: 'GET',
        url: 'https://api.lodgify.com/v2/reservations/bookings?page=1&size=9999&includeCount=false&includeTransactions=false&includeExternal=false&includeQuoteDetails=false',
        headers: {
            accept: 'application/json',
            'X-ApiKey': apiKey,
        }
    };


    const response = await axios.request(options);
    if (response.status === 200) {
        return response.data.items;
    } else {
        throw response.data.message;
    }

}
