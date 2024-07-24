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


    let page = 1;
    let hasMore = true;
    const allBookings = [];

    while (hasMore) {
        const options = {
            method: 'GET',
            url: `https://api.lodgify.com/v2/reservations/bookings?page=${page}&size=2147483647&includeCount=false&includeTransactions=false&includeExternal=false&includeQuoteDetails=false`, // Adjust 'size' as needed
            headers: {
                accept: 'application/json',
                'X-ApiKey': apiKey,
            }
        };

        try {
            const response = await axios.request(options);
            if (response.data && response.data.items.length > 0) {
                allBookings.push(...response.data.items);
                page++; // Go to the next page if current page has data
            } else {
                hasMore = false; // Stop the loop if no data is returned
            }
        } catch (error) {
            console.error('Failed to fetch bookings on page', page, ':', error);
            break; // Exit the loop on error
        }
    }

    return allBookings;


}
