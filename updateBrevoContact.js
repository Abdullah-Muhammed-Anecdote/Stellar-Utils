
const  axios  = require ("axios");
module.exports.updateBrevoContact = async function updateBrevoContact(user, propertiesCount, apiKey) {

    try {

        const attributes = {
            COMPANY_URL: user.company_url,
            COMPANY: user.company,
            FIRSTNAME: user.first_name,
            LASTNAME: user.last_name,
            PHONE_NUMBER: user.phone_number,
            PHONE_COUNTRY: user.phone_country,
            ADDRESS: user.address,
            ZIPCODE: user.zip_code,
            STATE: user.state,
            CITY: user.city,
            COUNTRY: user.country,
            CREATED_TIME: Date(user.created_time.toDate()),
            LAST_SIGN_IN: user.lastSignIn,
        };
        if (propertiesCount) {
            attributes['NUMBER_OF_UNITS'] = propertiesCount;
        }
        const data = {
            attributes: attributes,
            updateEnabled: false,
            email: user.email,
            ext_id: user.uid,
        };


        let url = 'https://api.brevo.com/v3/contacts';
        if (user.brevo_id) {
            url += `/${user.brevo_id}`;
            const response = await axios.put(url, data, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': apiKey
                }
            });
        } else {
            const response = await axios.post(url, data, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': apiKey
                }
            });
            return response.data.id;

        }

    } catch (error) {
        console.error('Error calling Brevo API:', error);
    }

}