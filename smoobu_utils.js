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