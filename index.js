const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId} = require('./smoobu_utils');

module.exports = { updateBrevoContact, getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId };
