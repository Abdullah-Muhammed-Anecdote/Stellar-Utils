const axios = require("axios");


module.exports.importProperties = async function ({apiKey}) {

    let options = {

        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.lodgify.com/v2/properties?includeCount=false&includeInOut=false&page=1&size=999',
        headers: {
            'accept': 'application/json',
            'X-ApiKey': apiKey,
        }
    };


    const response = await axios.request(options);
    return response.data;

}


module.exports.getBookings = async function ({apiKey}) {


    const options = {
        method: 'GET',
        url: 'https://api.lodgify.com/v2/reservations/bookings?page=1&size=999&includeCount=false&includeTransactions=false&includeExternal=false&includeQuoteDetails=false',
        headers: {
            accept: 'application/json',
            'X-ApiKey': apiKey,
        }
    };


    const response = await axios.request(options);
    return response.data;


}
