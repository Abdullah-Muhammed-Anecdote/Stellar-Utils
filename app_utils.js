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
    const userName = `${user.first_name} ${user.last_name}`;
    booking.guest = booking.guest.trim() === '' || !booking.guest ? 'guest' : booking.guest;
    let companyName = user.company ?? userName;
    companyName = companyName.trim() === '' ? 'stellar' : companyName;

    return getFormUrl(booking.uid).then((verificationLink) => {
        let data = JSON.stringify({
            id: `bookings-${booking.uid}`,
            email: booking.email,
            subject: 'Important: Complete Your Booking Verification',
            contact_information: user.email,
            verification_link: verificationLink,
            user_name: booking.guest,
            lang: booking.guest_lang,
            company_name: companyName,
            from_email: `${companyName}@incoming.stellar-trust.com`,
            from_name: userName ?? companyName,
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
