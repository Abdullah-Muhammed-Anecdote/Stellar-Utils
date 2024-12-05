const {updateBrevoContact} = require('./updateBrevoContact');
const {getSmoobuNewAccessToken, getSmoobuApartments, getSmoobuBookingsByApartmentId, getNotificationContent} = require('./smoobu_utils');
const {sendMailBySendGrid, sendDynamicTemplateMailBySendGrid} = require('./sendgrid_utils');
const {sendEmail, getFormUrl, checkAndSendFormLinks,supportedCheckInCountries,countryInfoJson,getCountryName,getCountryCode,checkCountrySupportedForCheckIn} = require('./app_utils');
const {importProperties, getBookings} = require('./lodgify_utils');
const {createNotification} = require('./notification_utils');
const {
    runApifyTask,
    assignWebhook,
    createAirbnbTask,
    createAirbnbProfileListingsUrlTask,
    createBookingTask,
    createBookingScraperTask,
    createVrboMainLinkScraperTask,
    createVrboTask,
    createExpediaTask,
    createExpediaScraperTask,
    createTripadvisorTask,
    createTripadvisorScraperTask,
    createFacebookReviewsTask,
    createFacebookRatingsTask,
    createGoogleReviewsTask,
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
    createAirbnbProfileListingsUrlTask,
    createBookingTask,
    createBookingScraperTask,
    createVrboMainLinkScraperTask,
    createVrboTask,
    createExpediaTask,
    createExpediaScraperTask,
    createTripadvisorTask,
    createTripadvisorScraperTask,
    createFacebookReviewsTask,
    createFacebookRatingsTask,
    createGoogleReviewsTask,
    getNotificationContent,
    checkCountrySupportedForCheckIn,
    supportedCheckInCountries,
    countryInfoJson,
    getCountryName,
    getCountryCode,
};

