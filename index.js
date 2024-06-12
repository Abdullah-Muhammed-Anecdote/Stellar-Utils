const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId} = require('./smoobu_utils');
const {sendMailBySendGrid,sendDynamicTemplateMailBySendGrid} = require('./sendgrid_utils');
const {sendEmail,getFormUrl,checkAndSendFormLinks} = require('./app_utils');

module.exports = { updateBrevoContact, getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId,sendMailBySendGrid, sendEmail,sendDynamicTemplateMailBySendGrid,getFormUrl,checkAndSendFormLinks };
