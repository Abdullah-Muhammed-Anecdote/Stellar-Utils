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

function checkCountrySupportedForCheckIn(normalizedInput) {
    if (normalizedInput == null) {
        return false;
    }
    for (const country of supportedCheckInCountries) {
        for (const altName of country.alternativeNames) {
            if (altName.toLowerCase() === getCountryName(normalizedInput).toLowerCase()) {
                return true;
            }
        }
    }
    return false;
}

function getCountryName(country) {

    if (country == null) {
        return null;
    } else if (country.length > 3) {
        return country;
    } else if (country.length > 2) {
        const filteredCountry = Object.keys(countryInfoJson)
            .filter((countryName) => countryInfoJson[countryName]['iso-3'] === country);
        return filteredCountry[0];
    } else {
        const filteredCountry = Object.keys(countryInfoJson)
            .filter((countryName) => countryInfoJson[countryName]['code'] === country);
        return filteredCountry[0];
    }

}
function getCountryCode(country) {
    if (country == null) {
        return null;
    } else if (country.length > 3) {
        const firstChar = country.charAt(0);
        const rest = country.slice(1);

        if (!(firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase())) {
            // Adjust the casing: first letter uppercase, rest lowercase
            country = firstChar.toUpperCase() + rest.toLowerCase();
        }
        return  countryInfoJson[country]['code'];
    }   else if (country.length >2){
        const filteredCountry = Object.keys(countryInfoJson)
            .filter((countryName) => countryInfoJson[countryName]['iso-3'] === country.toUpperCase());
        return filteredCountry[0]['code'];

    } else {
      return country;
    }
}

async function setIncrementId(counterName, documentRef, fieldName) {
    const counterRef = admin.firestore().collection('counters').doc(counterName);

    return admin.firestore().runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let newId;

        if (!counterDoc.exists) {
            // Initialize the counter if it doesn't exist
            newId = 1001;
            transaction.set(counterRef, { value: newId });
        } else {
            // Increment the counter value
            newId = counterDoc.data().value + 1;
            transaction.update(counterRef, { value: newId });
        }

        // Update the target document with the new incremented ID
        transaction.update(documentRef, { [fieldName]: newId });

        return newId; 
    });
}

const supportedCheckInCountries = [
    {
        name: 'Austria',
        alternativeNames: ['Austria', 'Republic of Austria', 'Österreich']
    },
    {
        name: 'Belgium',
        alternativeNames: ['Belgium', 'Kingdom of Belgium']
    },
    {
        name: 'Bulgaria',
        alternativeNames: ['Bulgaria', 'Republic of Bulgaria']
    },
    {
        name: 'Croatia',
        alternativeNames: ['Croatia', 'Republic of Croatia']
    },
    {
        name: 'Cyprus',
        alternativeNames: ['Cyprus', 'Republic of Cyprus', 'Kıbrıs']
    },
    {
        name: 'Czech Republic',
        alternativeNames: ['Czech Republic', 'Czechia']
    },
    {
        name: 'Denmark',
        alternativeNames: ['Denmark', 'Kingdom of Denmark']
    },
    {
        name: 'Estonia',
        alternativeNames: ['Estonia', 'Republic of Estonia']
    },
    {
        name: 'Finland',
        alternativeNames: ['Finland', 'Republic of Finland', 'Suomi']
    },
    {
        name: 'France',
        alternativeNames: ['France', 'French Republic', 'République française']
    },
    {
        name: 'Germany',
        alternativeNames: ['Germany', 'Federal Republic of Germany', 'Deutschland']
    },
    {
        name: 'Greece',
        alternativeNames: ['Greece', 'Hellenic Republic', 'Ελλάς', 'Ελλάδα']
    },
    {
        name: 'Hungary',
        alternativeNames: ['Hungary', 'Magyarország']
    },
    {
        name: 'Iceland',
        alternativeNames: ['Iceland', 'Republic of Iceland', 'Ísland']
    },
    {
        name: 'Ireland',
        alternativeNames: ['Ireland', 'Republic of Ireland', 'Éire']
    },
    {
        name: 'Italy',
        alternativeNames: ['Italy', 'Italian Republic', 'Repubblica Italiana']
    },
    {
        name: 'Latvia',
        alternativeNames: ['Latvia', 'Republic of Latvia', 'Latvija']
    },
    {
        name: 'Liechtenstein',
        alternativeNames: ['Liechtenstein', 'Principality of Liechtenstein', 'Fürstentum Liechtenstein']
    },
    {
        name: 'Lithuania',
        alternativeNames: ['Lithuania', 'Republic of Lithuania', 'Lietuva']
    },
    {
        name: 'Luxembourg',
        alternativeNames: ['Luxembourg', 'Grand Duchy of Luxembourg', 'Grand-Duché de Luxembourg', 'Großherzogtum Luxemburg', 'Groussherzogtum Lëtzebuerg']
    },
    {
        name: 'Malta',
        alternativeNames: ['Malta', 'Republic of Malta', 'Repubblika ta’ Malta']
    },
    {
        name: 'Netherlands',
        alternativeNames: ['Netherlands', 'Kingdom of the Netherlands', 'Holland', 'Nederland']
    },
    {
        name: 'Norway',
        alternativeNames: ['Norway', 'Kingdom of Norway', 'Norge']
    },
    {
        name: 'Poland',
        alternativeNames: ['Poland', 'Republic of Poland', 'Polska']
    },
    {
        name: 'Portugal',
        alternativeNames: ['Portugal', 'Portuguese Republic', 'República Portuguesa']
    },
    {
        name: 'Romania',
        alternativeNames: ['Romania', 'România']
    },
    {
        name: 'Slovakia',
        alternativeNames: ['Slovakia', 'Slovak Republic', 'Slovensko']
    },
    {
        name: 'Slovenia',
        alternativeNames: ['Slovenia', 'Republic of Slovenia', 'Republika Slovenija']
    },
    {
        name: 'Spain',
        alternativeNames: ['Spain', 'Kingdom of Spain', 'Reino de España', 'España']
    },
    {
        name: 'Sweden',
        alternativeNames: ['Sweden', 'Kingdom of Sweden', 'Sverige']
    },
    {
        name: 'Switzerland',
        alternativeNames: ['Switzerland', 'Swiss Confederation', 'Schweiz', 'Suisse', 'Svizzera', 'Svizra']
    },
    {
        name: 'United Kingdom',
        alternativeNames: ['United Kingdom', 'Britain', 'Great Britain',]
    }
];





const countryInfoJson = {
    "Afghanistan": {"dial_code": "+93", "code": "AF", "iso-3": "AFG"},
    "Aland Islands": {"dial_code": "+358", "code": "AX", "iso-3": "ALA"},
    "Albania": {"dial_code": "+355", "code": "AL", "iso-3": "ALB"},
    "Algeria": {"dial_code": "+213", "code": "DZ", "iso-3": "DZA"},
    "AmericanSamoa": {"dial_code": "+1684", "code": "AS", "iso-3": "ASM"},
    "Andorra": {"dial_code": "+376", "code": "AD", "iso-3": "AND"},
    "Angola": {"dial_code": "+244", "code": "AO", "iso-3": "AGO"},
    "Anguilla": {"dial_code": "+1264", "code": "AI", "iso-3": "AIA"},
    "Antarctica": {"dial_code": "+672", "code": "AQ", "iso-3": "ATA"},
    "Antigua and Barbuda": {"dial_code": "+1268", "code": "AG", "iso-3": "ATG"},
    "Argentina": {"dial_code": "+54", "code": "AR", "iso-3": "ARG"},
    "Armenia": {"dial_code": "+374", "code": "AM", "iso-3": "ARM"},
    "Aruba": {"dial_code": "+297", "code": "AW", "iso-3": "ABW"},
    "Australia": {"dial_code": "+61", "code": "AU", "iso-3": "AUS"},
    "Austria": {"dial_code": "+43", "code": "AT", "iso-3": "AUT"},
    "Azerbaijan": {"dial_code": "+994", "code": "AZ", "iso-3": "AZE"},
    "Bahamas": {"dial_code": "+1242", "code": "BS", "iso-3": "BHS"},
    "Bahrain": {"dial_code": "+973", "code": "BH", "iso-3": "BHR"},
    "Bangladesh": {"dial_code": "+880", "code": "BD", "iso-3": "BGD"},
    "Barbados": {"dial_code": "+1246", "code": "BB", "iso-3": "BRB"},
    "Belarus": {"dial_code": "+375", "code": "BY", "iso-3": "BLR"},
    "Belgium": {"dial_code": "+32", "code": "BE", "iso-3": "BEL"},
    "Belize": {"dial_code": "+501", "code": "BZ", "iso-3": "BLZ"},
    "Benin": {"dial_code": "+229", "code": "BJ", "iso-3": "BEN"},
    "Bermuda": {"dial_code": "+1441", "code": "BM", "iso-3": "BMU"},
    "Bhutan": {"dial_code": "+975", "code": "BT", "iso-3": "BTN"},
    "Bolivia": {"dial_code": "+591", "code": "BO", "iso-3": "BOL"},
    "Bosnia and Herzegovina": {"dial_code": "+387", "code": "BA", "iso-3": "BIH"},
    "Botswana": {"dial_code": "+267", "code": "BW", "iso-3": "BWA"},
    "Brazil": {"dial_code": "+55", "code": "BR", "iso-3": "BRA"},
    "British Indian Ocean Territory": {"dial_code": "+246", "code": "IO", "iso-3": "IOT"},
    "Brunei Darussalam": {"dial_code": "+673", "code": "BN", "iso-3": "BRN"},
    "Bulgaria": {"dial_code": "+359", "code": "BG", "iso-3": "BGR"},
    "Burkina Faso": {"dial_code": "+226", "code": "BF", "iso-3": "BFA"},
    "Burundi": {"dial_code": "+257", "code": "BI", "iso-3": "BDI"},
    "Cambodia": {"dial_code": "+855", "code": "KH", "iso-3": "KHM"},
    "Cameroon": {"dial_code": "+237", "code": "CM", "iso-3": "CMR"},
    "Canada": {"dial_code": "+1", "code": "CA", "iso-3": "CAN"},
    "Cape Verde": {"dial_code": "+238", "code": "CV", "iso-3": "CPV"},
    "Cayman Islands": {"dial_code": "+345", "code": "KY", "iso-3": "CYM"},
    "Central African Republic": {"dial_code": "+236", "code": "CF", "iso-3": "CAF"},
    "Chad": {"dial_code": "+235", "code": "TD", "iso-3": "TCD"},
    "Chile": {"dial_code": "+56", "code": "CL", "iso-3": "CHL"},
    "China": {"dial_code": "+86", "code": "CN", "iso-3": "CHN"},
    "Christmas Island": {"dial_code": "+61", "code": "CX", "iso-3": "CXR"},
    "Cocos (Keeling) Islands": {"dial_code": "+61", "code": "CC", "iso-3": "CCK"},
    "Colombia": {"dial_code": "+57", "code": "CO", "iso-3": "COL"},
    "Comoros": {"dial_code": "+269", "code": "KM", "iso-3": "COM"},
    "Congo": {"dial_code": "+242", "code": "CG", "iso-3": "COG"},
    "Congo, The Democratic Republic of the Congo": {
        "dial_code": "+243",
        "code": "CD",
        "iso-3": "COD"
    },
    "Cook Islands": {"dial_code": "+682", "code": "CK", "iso-3": "COK"},
    "Costa Rica": {"dial_code": "+506", "code": "CR", "iso-3": "CRI"},
    "Cote d'Ivoire": {"dial_code": "+225", "code": "CI", "iso-3": "CIV"},
    "Croatia": {"dial_code": "+385", "code": "HR", "iso-3": "HRV"},
    "Cuba": {"dial_code": "+53", "code": "CU", "iso-3": "CUB"},
    "Cyprus": {"dial_code": "+357", "code": "CY", "iso-3": "CYP"},
    "Czech Republic": {"dial_code": "+420", "code": "CZ", "iso-3": "CZE"},
    "Denmark": {"dial_code": "+45", "code": "DK", "iso-3": "DNK"},
    "Djibouti": {"dial_code": "+253", "code": "DJ", "iso-3": "DJI"},
    "Dominica": {"dial_code": "+1767", "code": "DM", "iso-3": "DMA"},
    "Dominican Republic": {"dial_code": "+1849", "code": "DO", "iso-3": "DOM"},
    "Ecuador": {"dial_code": "+593", "code": "EC", "iso-3": "ECU"},
    "Egypt": {"dial_code": "+20", "code": "EG", "iso-3": "EGY"},
    "El Salvador": {"dial_code": "+503", "code": "SV", "iso-3": "SLV"},
    "Equatorial Guinea": {"dial_code": "+240", "code": "GQ", "iso-3": "GNQ"},
    "Eritrea": {"dial_code": "+291", "code": "ER", "iso-3": "ERI"},
    "Estonia": {"dial_code": "+372", "code": "EE", "iso-3": "EST"},
    "Ethiopia": {"dial_code": "+251", "code": "ET", "iso-3": "ETH"},
    "Falkland Islands (Malvinas)": {"dial_code": "+500", "code": "FK", "iso-3": "FLK"},
    "Faroe Islands": {"dial_code": "+298", "code": "FO", "iso-3": "FRO"},
    "Fiji": {"dial_code": "+679", "code": "FJ", "iso-3": "FJI"},
    "Finland": {"dial_code": "+358", "code": "FI", "iso-3": "FIN"},
    "France": {"dial_code": "+33", "code": "FR", "iso-3": "FRA"},
    "French Guiana": {"dial_code": "+594", "code": "GF", "iso-3": "GUF"},
    "French Polynesia": {"dial_code": "+689", "code": "PF", "iso-3": "PYF"},
    "Gabon": {"dial_code": "+241", "code": "GA", "iso-3": "GAB"},
    "Gambia": {"dial_code": "+220", "code": "GM", "iso-3": "GMB"},
    "Georgia": {"dial_code": "+995", "code": "GE", "iso-3": "GEO"},
    "Germany": {"dial_code": "+49", "code": "DE", "iso-3": "DEU"},
    "Ghana": {"dial_code": "+233", "code": "GH", "iso-3": "GHA"},
    "Gibraltar": {"dial_code": "+350", "code": "GI", "iso-3": "GIB"},
    "Greece": {"dial_code": "+30", "code": "GR", "iso-3": "GRC"},
    "Greenland": {"dial_code": "+299", "code": "GL", "iso-3": "GRL"},
    "Grenada": {"dial_code": "+1473", "code": "GD", "iso-3": "GRD"},
    "Guadeloupe": {"dial_code": "+590", "code": "GP", "iso-3": "GLP"},
    "Guam": {"dial_code": "+1671", "code": "GU", "iso-3": "GUM"},
    "Guatemala": {"dial_code": "+502", "code": "GT", "iso-3": "GTM"},
    "Guernsey": {"dial_code": "+44", "code": "GG", "iso-3": "GGY"},
    "Guinea": {"dial_code": "+224", "code": "GN", "iso-3": "GIN"},
    "Guinea-Bissau": {"dial_code": "+245", "code": "GW", "iso-3": "GNB"},
    "Guyana": {"dial_code": "+595", "code": "GY", "iso-3": "GUY"},
    "Haiti": {"dial_code": "+509", "code": "HT", "iso-3": "HTI"},
    "Holy See (Vatican City State)": {"dial_code": "+379", "code": "VA", "iso-3": "VAT"},
    "Honduras": {"dial_code": "+504", "code": "HN", "iso-3": "HND"},
    "Hong Kong": {"dial_code": "+852", "code": "HK", "iso-3": "HKG"},
    "Hungary": {"dial_code": "+36", "code": "HU", "iso-3": "HUN"},
    "Iceland": {"dial_code": "+354", "code": "IS", "iso-3": "ISL"},
    "India": {"dial_code": "+91", "code": "IN", "iso-3": "IND"},
    "Indonesia": {"dial_code": "+62", "code": "ID", "iso-3": "IDN"},
    "Iran, Islamic Republic of Persian Gulf": {
        "dial_code": "+98",
        "code": "IR",
        "iso-3": "IRN"
    },
    "Iraq": {"dial_code": "+964", "code": "IQ", "iso-3": "IRQ"},
    "Ireland": {"dial_code": "+353", "code": "IE", "iso-3": "IRL"},
    "Isle of Man": {"dial_code": "+44", "code": "IM", "iso-3": "IMN"},
    "Israel": {"dial_code": "+972", "code": "IL", "iso-3": "ISR"},
    "Italy": {"dial_code": "+39", "code": "IT", "iso-3": "ITA"},
    "Jamaica": {"dial_code": "+1876", "code": "JM", "iso-3": "JAM"},
    "Japan": {"dial_code": "+81", "code": "JP", "iso-3": "JPN"},
    "Jersey": {"dial_code": "+44", "code": "JE", "iso-3": "JEY"},
    "Jordan": {"dial_code": "+962", "code": "JO", "iso-3": "JOR"},
    "Kazakhstan": {"dial_code": "+77", "code": "KZ", "iso-3": "KAZ"},
    "Kenya": {"dial_code": "+254", "code": "KE", "iso-3": "KEN"},
    "Kiribati": {"dial_code": "+686", "code": "KI", "iso-3": "KIR"},
    "Korea, Democratic People's Republic of Korea": {
        "dial_code": "+850",
        "code": "KP",
        "iso-3": "PRK"
    },
    "Korea, Republic of South Korea": {"dial_code": "+82", "code": "KR", "iso-3": "KOR"},
    "Kuwait": {"dial_code": "+965", "code": "KW", "iso-3": "KWT"},
    "Kyrgyzstan": {"dial_code": "+996", "code": "KG", "iso-3": "KGZ"},
    "Laos": {"dial_code": "+856", "code": "LA", "iso-3": "LAO"},
    "Latvia": {"dial_code": "+371", "code": "LV", "iso-3": "LVA"},
    "Lebanon": {"dial_code": "+961", "code": "LB", "iso-3": "LBN"},
    "Lesotho": {"dial_code": "+266", "code": "LS", "iso-3": "LSO"},
    "Liberia": {"dial_code": "+231", "code": "LR", "iso-3": "LBR"},
    "Libyan Arab Jamahiriya": {"dial_code": "+218", "code": "LY", "iso-3": "LBY"},
    "Liechtenstein": {"dial_code": "+423", "code": "LI", "iso-3": "LIE"},
    "Lithuania": {"dial_code": "+370", "code": "LT", "iso-3": "LTU"},
    "Luxembourg": {"dial_code": "+352", "code": "LU", "iso-3": "LUX"},
    "Macao": {"dial_code": "+853", "code": "MO", "iso-3": "MAC"},
    "Macedonia": {"dial_code": "+389", "code": "MK", "iso-3": "MKD"},
    "Madagascar": {"dial_code": "+261", "code": "MG", "iso-3": "MDG"},
    "Malawi": {"dial_code": "+265", "code": "MW", "iso-3": "MWI"},
    "Malaysia": {"dial_code": "+60", "code": "MY", "iso-3": "MYS"},
    "Maldives": {"dial_code": "+960", "code": "MV", "iso-3": "MDV"},
    "Mali": {"dial_code": "+223", "code": "ML", "iso-3": "MLI"},
    "Malta": {"dial_code": "+356", "code": "MT", "iso-3": "MLT"},
    "Marshall Islands": {"dial_code": "+692", "code": "MH", "iso-3": "MHL"},
    "Martinique": {"dial_code": "+596", "code": "MQ", "iso-3": "MTQ"},
    "Mauritania": {"dial_code": "+222", "code": "MR", "iso-3": "MRT"},
    "Mauritius": {"dial_code": "+230", "code": "MU", "iso-3": "MUS"},
    "Mayotte": {"dial_code": "+262", "code": "YT", "iso-3": "MYT"},
    "Mexico": {"dial_code": "+52", "code": "MX", "iso-3": "MEX"},
    "Micronesia, Federated States of Micronesia": {
        "dial_code": "+691",
        "code": "FM",
        "iso-3": "FSM"
    },
    "Moldova": {"dial_code": "+373", "code": "MD", "iso-3": "MDA"},
    "Monaco": {"dial_code": "+377", "code": "MC", "iso-3": "MCO"},
    "Mongolia": {"dial_code": "+976", "code": "MN", "iso-3": "MNG"},
    "Montenegro": {"dial_code": "+382", "code": "ME", "iso-3": "MNE"},
    "Montserrat": {"dial_code": "+1664", "code": "MS", "iso-3": "MSR"},
    "Morocco": {"dial_code": "+212", "code": "MA", "iso-3": "MAR"},
    "Mozambique": {"dial_code": "+258", "code": "MZ", "iso-3": "MOZ"},
    "Myanmar": {"dial_code": "+95", "code": "MM", "iso-3": "MMR"},
    "Namibia": {"dial_code": "+264", "code": "NA", "iso-3": "NAM"},
    "Nauru": {"dial_code": "+674", "code": "NR", "iso-3": "NRU"},
    "Nepal": {"dial_code": "+977", "code": "NP", "iso-3": "NPL"},
    "Netherlands": {"dial_code": "+31", "code": "NL", "iso-3": "NLD"},
    "Netherlands Antilles": {"dial_code": "+599", "code": "AN", "iso-3": "ANT"},
    "New Caledonia": {"dial_code": "+687", "code": "NC", "iso-3": "NCL"},
    "New Zealand": {"dial_code": "+64", "code": "NZ", "iso-3": "NZL"},
    "Nicaragua": {"dial_code": "+505", "code": "NI", "iso-3": "NIC"},
    "Niger": {"dial_code": "+227", "code": "NE", "iso-3": "NER"},
    "Nigeria": {"dial_code": "+234", "code": "NG", "iso-3": "NGA"},
    "Niue": {"dial_code": "+683", "code": "NU", "iso-3": "NIU"},
    "Norfolk Island": {"dial_code": "+672", "code": "NF", "iso-3": "NFK"},
    "Northern Mariana Islands": {"dial_code": "+1670", "code": "MP", "iso-3": "MNP"},
    "Norway": {"dial_code": "+47", "code": "NO", "iso-3": "NOR"},
    "Oman": {"dial_code": "+968", "code": "OM", "iso-3": "OMN"},
    "Pakistan": {"dial_code": "+92", "code": "PK", "iso-3": "PAK"},
    "Palau": {"dial_code": "+680", "code": "PW", "iso-3": "PLW"},
    "Palestinian Territory, Occupied": {"dial_code": "+970", "code": "PS", "iso-3": "PSE"},
    "Panama": {"dial_code": "+507", "code": "PA", "iso-3": "PAN"},
    "Papua New Guinea": {"dial_code": "+675", "code": "PG", "iso-3": "PNG"},
    "Paraguay": {"dial_code": "+595", "code": "PY", "iso-3": "PRY"},
    "Peru": {"dial_code": "+51", "code": "PE", "iso-3": "PER"},
    "Philippines": {"dial_code": "+63", "code": "PH", "iso-3": "PHL"},
    "Pitcairn": {"dial_code": "+872", "code": "PN", "iso-3": "PCN"},
    "Poland": {"dial_code": "+48", "code": "PL", "iso-3": "POL"},
    "Portugal": {"dial_code": "+351", "code": "PT", "iso-3": "PRT"},
    "Puerto Rico": {"dial_code": "+1939", "code": "PR", "iso-3": "PRI"},
    "Qatar": {"dial_code": "+974", "code": "QA", "iso-3": "QAT"},
    "Romania": {"dial_code": "+40", "code": "RO", "iso-3": "ROU"},
    "Russia": {"dial_code": "+7", "code": "RU", "iso-3": "RUS"},
    "Rwanda": {"dial_code": "+250", "code": "RW", "iso-3": "RWA"},
    "Reunion": {"dial_code": "+262", "code": "RE", "iso-3": "REU"},
    "Saint Barthelemy": {"dial_code": "+590", "code": "BL", "iso-3": "BLM"},
    "Saint Helena, Ascension and Tristan Da Cunha": {
        "dial_code": "+290",
        "code": "SH",
        "iso-3": "SHN"
    },
    "Saint Kitts and Nevis": {"dial_code": "+1869", "code": "KN", "iso-3": "KNA"},
    "Saint Lucia": {"dial_code": "+1758", "code": "LC", "iso-3": "LCA"},
    "Saint Martin": {"dial_code": "+590", "code": "MF", "iso-3": "MAF"},
    "Saint Pierre and Miquelon": {"dial_code": "+508", "code": "PM", "iso-3": "SPM"},
    "Saint Vincent and the Grenadines": {"dial_code": "+1784", "code": "VC", "iso-3": "VCT"},
    "Samoa": {"dial_code": "+685", "code": "WS", "iso-3": "WSM"},
    "San Marino": {"dial_code": "+378", "code": "SM", "iso-3": "SMR"},
    "Sao Tome and Principe": {"dial_code": "+239", "code": "ST", "iso-3": "STP"},
    "Saudi Arabia": {"dial_code": "+966", "code": "SA", "iso-3": "SAU"},
    "Senegal": {"dial_code": "+221", "code": "SN", "iso-3": "SEN"},
    "Serbia": {"dial_code": "+381", "code": "RS", "iso-3": "SRB"},
    "Seychelles": {"dial_code": "+248", "code": "SC", "iso-3": "SYC"},
    "Sierra Leone": {"dial_code": "+232", "code": "SL", "iso-3": "SLE"},
    "Singapore": {"dial_code": "+65", "code": "SG", "iso-3": "SGP"},
    "Slovakia": {"dial_code": "+421", "code": "SK", "iso-3": "SVK"},
    "Slovenia": {"dial_code": "+386", "code": "SI", "iso-3": "SVN"},
    "Solomon Islands": {"dial_code": "+677", "code": "SB", "iso-3": "SLB"},
    "Somalia": {"dial_code": "+252", "code": "SO", "iso-3": "SOM"},
    "South Africa": {"dial_code": "+27", "code": "ZA", "iso-3": "ZAF"},
    "South Sudan": {"dial_code": "+211", "code": "SS", "iso-3": "SSD"},
    "South Georgia and the South Sandwich Islands": {
        "dial_code": "+500",
        "code": "GS",
        "iso-3": "SGS"
    },
    "Spain": {"dial_code": "+34", "code": "ES", "iso-3": "ESP"},
    "Sri Lanka": {"dial_code": "+94", "code": "LK", "iso-3": "LKA"},
    "Sudan": {"dial_code": "+249", "code": "SD", "iso-3": "SDN"},
    "Suriname": {"dial_code": "+597", "code": "SR", "iso-3": "SUR"},
    "Svalbard and Jan Mayen": {"dial_code": "+47", "code": "SJ", "iso-3": "SJM"},
    "Swaziland": {"dial_code": "+268", "code": "SZ", "iso-3": "SWZ"},
    "Sweden": {"dial_code": "+46", "code": "SE", "iso-3": "SWE"},
    "Switzerland": {"dial_code": "+41", "code": "CH", "iso-3": "CHE"},
    "Syrian Arab Republic": {"dial_code": "+963", "code": "SY", "iso-3": "SYR"},
    "Taiwan": {"dial_code": "+886", "code": "TW", "iso-3": "TWN"},
    "Tajikistan": {"dial_code": "+992", "code": "TJ", "iso-3": "TJK"},
    "Tanzania, United Republic of Tanzania": {
        "dial_code": "+255",
        "code": "TZ",
        "iso-3": "TZA"
    },
    "Thailand": {"dial_code": "+66", "code": "TH", "iso-3": "THA"},
    "Timor-Leste": {"dial_code": "+670", "code": "TL", "iso-3": "TLS"},
    "Togo": {"dial_code": "+228", "code": "TG", "iso-3": "TGO"},
    "Tokelau": {"dial_code": "+690", "code": "TK", "iso-3": "TKL"},
    "Tonga": {"dial_code": "+676", "code": "TO", "iso-3": "TON"},
    "Trinidad and Tobago": {"dial_code": "+1868", "code": "TT", "iso-3": "TTO"},
    "Tunisia": {"dial_code": "+216", "code": "TN", "iso-3": "TUN"},
    "Turkey": {"dial_code": "+90", "code": "TR", "iso-3": "TUR"},
    "Turkmenistan": {"dial_code": "+993", "code": "TM", "iso-3": "TKM"},
    "Turks and Caicos Islands": {"dial_code": "+1649", "code": "TC", "iso-3": "TCA"},
    "Tuvalu": {"dial_code": "+688", "code": "TV", "iso-3": "TUV"},
    "Uganda": {"dial_code": "+256", "code": "UG", "iso-3": "UGA"},
    "Ukraine": {"dial_code": "+380", "code": "UA", "iso-3": "UKR"},
    "United Arab Emirates": {"dial_code": "+971", "code": "AE", "iso-3": "ARE"},
    "GB": {"dial_code": "+44", "code": "GB", "iso-3": "GBR"},
    "United Kingdom": {"dial_code": "+44", "code": "UK", "iso-3": "GBR"},
    "United States": {"dial_code": "+1", "code": "US", "iso-3": "USA"},
    "Uruguay": {"dial_code": "+598", "code": "UY", "iso-3": "URY"},
    "Uzbekistan": {"dial_code": "+998", "code": "UZ", "iso-3": "UZB"},
    "Vanuatu": {"dial_code": "+678", "code": "VU", "iso-3": "VUT"},
    "Venezuela, Bolivarian Republic of Venezuela": {
        "dial_code": "+58",
        "code": "VE",
        "iso-3": "VEN"
    },
    "Vietnam": {"dial_code": "+84", "code": "VN", "iso-3": "VNM"},
    "Virgin Islands, British": {"dial_code": "+1284", "code": "VG", "iso-3": "VGB"},
    "Virgin Islands, U.S.": {"dial_code": "+1340", "code": "VI", "iso-3": "VIR"},
    "Wallis and Futuna": {"dial_code": "+681", "code": "WF", "iso-3": "WLF"},
    "Yemen": {"dial_code": "+967", "code": "YE", "iso-3": "YEM"},
    "Zambia": {"dial_code": "+260", "code": "ZM", "iso-3": "ZMB"},
    "Zimbabwe": {"dial_code": "+263", "code": "ZW", "iso-3": "ZWE"}
};
module.exports = {
    checkAndSendFormLinks,
    getFormUrl,
    sendEmail,
    checkCountrySupportedForCheckIn,
    getCountryName,
    getCountryCode,
    supportedCheckInCountries,
    countryInfoJson,
    setIncrementId
};
