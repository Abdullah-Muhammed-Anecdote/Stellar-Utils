 const qs = require('qs');
 const  axios  = require ("axios");


 module.exports.getSmoobuNewAccessToken = async function  ({ clientId,refreshToken, client_secret})  {

    // URL encode the request body
    const data = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token:  refreshToken,
        client_id: clientId,
        client_secret: client_secret,
    });

    const config = {
        method: 'post',
        url: 'https://login.smoobu.com/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };

    try {
        const response = await axios(config);
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to refresh token:', error.response ? error.response.data : error.message);
    }
}





 module.exports.getSmoobuApartments = async  function getApartments(smoobuAccessToken) {

     const config = {
         method: 'get',
         url: 'https://login.smoobu.com/api/apartments',
         headers: {
             'Authorization': `Bearer ${smoobuAccessToken}`,
             'Cache-Control': 'no-cache'
         }
     };

     const response = await axios(config);
     if (response.status == 401) {
         throw response.data.status;
     } else {
         return response.data.apartments;
     }

 }

 module.exports.getSmoobuBookingsByApartmentId = async  function getBookingsByApartmentId({smoobuAccessToken,apartmentId}) {

     const config = {
         method: 'get',
         maxBodyLength: Infinity,
         url: `https://login.smoobu.com/api/reservations?apartmentId=${apartmentId}`,
         headers: {
             'Cache-Control': 'no-cache',
             'Authorization': `Bearer ${smoobuAccessToken}`
         }
     };

     const response = await axios(config);
     if (response.status == 401) {
         throw response.data.status;
     } else {
         return response.data.bookings;
     }

 }