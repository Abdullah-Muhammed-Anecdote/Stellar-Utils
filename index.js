const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken, getSmoobuApartments, getSmoobuBookingsByApartmentId} = require('./smoobu_utils');
const {sendMailBySendGrid, sendDynamicTemplateMailBySendGrid} = require('./sendgrid_utils');
const {sendEmail, getFormUrl, checkAndSendFormLinks} = require('./app_utils');
const {importProperties, getBookings} = require('./lodgify_utils');
const {createNotification} = require('./notification_utils');
const {
    runApifyTask,
    assignWebhook,
    createAirbnbTask,
    createBookingTask,
    createBookingScraperTask,
    createVrboMainLinkScraperTask,
    createVrboTask,
    createExpediaTask,
    createExpediaScraperTask,
    createTripadvisorTask,
    createTripadvisorScraperTask,
    createFacebookReviewsTask
} = require('./apify_utils');

module.exports = {
    createNotification,
    importProperties,
    getBookings,
    updateBrevoContact,
    getSmoobuNewAccessToken,
    getSmoobuApartments,
    getSmoobuBookingsByApartmentId,
    sendMailBySendGrid,
    sendEmail,
    sendDynamicTemplateMailBySendGrid,
    getFormUrl,
    checkAndSendFormLinks,
    runApifyTask,
    assignWebhook,
    createAirbnbTask,
    createBookingTask,
    createBookingScraperTask,
    createVrboMainLinkScraperTask,
    createVrboTask,
    createExpediaTask,
    createExpediaScraperTask,
    createTripadvisorTask,
    createTripadvisorScraperTask,
    createFacebookReviewsTask,
};
