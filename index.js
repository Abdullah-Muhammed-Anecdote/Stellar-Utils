const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId} = require('./smoobu_utils');
const {sendMailBySendGrid} = require('./sendgrid_utils');

module.exports = { updateBrevoContact, getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId,sendMailBySendGrid };
