const axios = require('axios');
const {differenceInDays} = require('date-fns');

async function checkAndSendFormLinks({userBookingsSettings, bookingsSnapshot}) {
    const now = new Date();


    const sendFormPromises = [];
    bookingsSnapshot.forEach((bookingDoc) => {
        const booking = bookingDoc.data();
        const arrivalDate = booking.arrival.toDate();
        const userId = booking.owner.id;
        const daysBeforeSendingFormLink = userBookingsSettings[userId];

        if (daysBeforeSendingFormLink !== undefined) {
            const daysDifference = differenceInDays(arrivalDate, now);

            if (daysDifference === daysBeforeSendingFormLink) {

                sendFormPromises.push(
                    booking.owner.get().then((userDoc) => {
                        sendEmail({booking: booking, user: userDoc.data()})
                    })
                );
            }
        }
    });

    return Promise.all(sendFormPromises).then(() => {

    }).catch(error => {
        throw error;
    });


}

async function getFormUrl(docId) {

    let data = JSON.stringify({
        "bookingId": docId
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-accrental-65871.cloudfunctions.net/getBookingVerificationLink',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const fetchingUrlResponse = await axios.request(config);
    return fetchingUrlResponse.data.url;
}

function sendEmail({booking, user}) {

    return getFormUrl(booking.uid).then((verificationLink) => {

        let data = JSON.stringify({
            id: `bookings-${booking.uid}`,
            email: booking.email,
            subject: 'Important: Complete Your Booking Verification',
            contact_information: user.email,
            verification_link: verificationLink,
            user_name: booking.guest ?? 'client',
            company_name: user.company,


        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-accrental-65871.cloudfunctions.net/sendBookingVerificationMailBySendGridTemplate',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios.request(config);

    });


}


module.exports = {
    checkAndSendFormLinks,
    getFormUrl,
    sendEmail
};
