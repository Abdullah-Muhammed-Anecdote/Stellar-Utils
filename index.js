const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId} = require('./smoobu_utils');
const {sendMailBySendGrid,sendDynamicTemplateMailBySendGrid} = require('./sendgrid_utils');
const {sendEmail,getFormUrl,checkAndSendFormLinks} = require('./app_utils');
const {importProperties,getBookings} = require('./lodgify_utils');

module.exports = {importProperties,getBookings, updateBrevoContact, getSmoobuNewAccessToken,getSmoobuApartments, getSmoobuBookingsByApartmentId,sendMailBySendGrid, sendEmail,sendDynamicTemplateMailBySendGrid,getFormUrl,checkAndSendFormLinks };
