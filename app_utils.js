const axios = require('axios');
const {differenceInDays} = require('date-fns'); // you can use any date library or write your own function


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
                sendFormPromises.push(sendEmail({docId: bookingDoc.id, receiver_email: booking.email}));
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

function sendEmail({docId, receiver_email}) {

  return  getFormUrl(docId).then((url) => {


        let data = JSON.stringify({
            "email": receiver_email,
            "id": `bookings-${docId}`,
            "subject": "booking verification",
            "content": `Please verify your booking by clicking on the link below.\n${url}`
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-accrental-65871.cloudfunctions.net/sendBookingVerificationMailBySendGrid',
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
