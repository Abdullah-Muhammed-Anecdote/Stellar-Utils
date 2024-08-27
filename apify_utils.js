const axios = require("axios");
function getRandomInt() {
    return Math.floor(Math.random() * 1000000000);
}
module.exports.runApifyTask = async function ({taskId, apifyToken}) {

    try {
        await axios.post(`https://api.apify.com/v2/actor-tasks/${taskId}/runs`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}

module.exports.assignWebhook = async function ({
    requestUrl,
                                                   apifyTaskID,
                                                   ownerId,
                                                   apifyToken,
                                                   reviewsTaskId,
                                                   languageCode,
                                                   propertyId
                                               }) {

    if (!apifyToken) {
        throw new Error('Apify Token is required');
    }
    try {

       await  axios.post(`https://api.apify.com/v2/webhooks`,
            {
                "isAdHoc": false,
                "eventTypes": [
                    "ACTOR.RUN.SUCCEEDED",
                    "ACTOR.RUN.FAILED",
                    "ACTOR.RUN.TIMED_OUT"
                ],
                "condition": {
                    "actorTaskId": apifyTaskID
                },
                "ignoreSslErrors": false,
                "doNotRetry": false,
                "requestUrl": `https://us-central1-accrental-65871.cloudfunctions.net/${requestUrl}`,
                "payloadTemplate": `{\n\"userId\": \"{{userId}}\",\n\"createdAt\": \"{{createdAt}}\",\n\"eventType\": \"{{eventType}}\",\n\"eventData\": \"{{eventData}}\",\n\"owner\": \"${ownerId}\",\n\"reviewsTaskId\": \"${reviewsTaskId}\",\n\"languageCode\": \"${languageCode}\",\n\"propertyId\": \"${propertyId}\"\n}`,
                "shouldInterpolateStrings": true
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apifyToken}`,
                }
            });
    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}


module.exports.createAirbnbTask = async function ({url, apifyToken}) {

    const uri = new URL(url);
    const parts = uri.pathname.split('/');
    const roomId = parts[2];

    try {
        const response = await axios.post(`https://api.apify.com/v2/actor-tasks`,
            {
                "actId": "GsNzxEKzE2vQ5d9HN",
                "name": `${getRandomInt()}-airbnb-listing-url-${Math.floor(Date.now() / 1000)}-${roomId}`,
                "options": {
                    "build": "0.0.60",
                    "timeoutSecs": 300,
                    "memoryMbytes": 1024
                },
                "input": {
                    "addMoreHostInfo": false,
                    "calendarMonths": 0,
                    "debugLog": false,
                    "includeReviews": true,
                    "limitPoints": 100,
                    "maxConcurrency": 50,
                    "maxListings": 10,
                    "maxReviews": 10,
                    "proxyConfiguration": {
                        "useApifyProxy": true
                    },
                    "simple": false,
                    "startUrls": [
                        {
                            "url": url
                        }
                    ],
                    "timeoutMs": 300000
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apifyToken}`,
                }
            });

        return response.data;
    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}
module.exports.createBookingTask = async function ({url, apifyToken}) {


    try {
        const response = await axios.post(`https://api.apify.com/v2/actor-tasks`,
            {
                "actId": "PbMHke3jW25J6hSOA",
                "name": `${getRandomInt()}-booking-listing-url-${Math.floor(Date.now() / 1000)}`,
                "options": {
                    "build": "latest",
                    "timeoutSecs": 300,
                    "memoryMbytes": 2048
                },
                "input": {
                    "maxReviewsPerHotel": 10,
                    "reviewScores": [
                        "ALL"
                    ],
                    "sortReviewsBy": "f_recent_desc",
                    "startUrls": [
                        {
                            "url": url
                        }
                    ]
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apifyToken}`,
                }
            });
        return response.data;


    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}
module.exports.createBookingScraperTask = async function ({url, apifyToken}) {


    try {
        const response =  await axios.post(`https://api.apify.com/v2/actor-tasks`,
            {
                "actId": "oeiQgfg5fsmIJB7Cn",
                "name": `${getRandomInt()}-booking-listing-url-${Math.floor(Date.now() / 1000)}`,
                "options": {
                    "build": "latest",
                    "timeoutSecs": 300,
                    "memoryMbytes": 2048
                },
                "input": {
                    "currency": "USD",
                    "language": "en-gb",
                    "maxItems": 10,
                    "minMaxPrice": "0-999999",
                    "sortBy": "distance_from_search",
                    "starsCountFilter": "any",
                    "startUrls": [
                        {
                            "url": url
                        }
                    ],
                    "propertyType": "none",
                    "rooms": 1,
                    "adults": 2,
                    "children": 0
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apifyToken}`,
                }
            });
        return response.data;


    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}
module.exports.createVrboMainLinkScraperTask = async function ({url, apifyToken}) {


    try {
        const response = await axios.post(`https://api.apify.com/v2/actor-tasks`,
            {
                "actId": "WTC73sz39D0txDRdF",
                "name": `${getRandomInt()}-vrbo-main-url-${Math.floor(Date.now() / 1000)}`,
                "options": {
                    "build": "latest",
                    "timeoutSecs": 300,
                    "memoryMbytes": 1024
                },
                "input": {
                    "url": url
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apifyToken}`,
                }
            });
        return response.data;


    } catch (error) {
        console.log('Error calling the external API:', error);
    }
}
module.exports.createVrboTask = async function ({url, apifyToken}) {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/');
    const location = pathSegments.pop()

    const body = {

        "actId": "kRRC9n6Rv5lEcE3b3",
        "name": `${getRandomInt()}-vrbo-listing-url-${Math.floor(Date.now() / 1000)}`,
        "options": {
            "build": "latest",
            "timeoutSecs": 300,
            "memoryMbytes": 1024
        },
        "input": {
            "dev_dataset_clear": false,
            "dev_dataset_enable": false,
            "dev_no_http2": false,
            "dev_no_retry": false,
            "dev_transform_enable": false,
            "filters:4_stars": false,
            "filters:RV": false,
            "filters:air_conditioning": false,
            "filters:apartment_or_condo": false,
            "filters:balcony": false,
            "filters:beach": false,
            "filters:beach_view": false,
            "filters:beachfront": false,
            "filters:bed_linens_provided": false,
            "filters:boat": false,
            "filters:cabin": false,
            "filters:carbon_monoxide_detector": false,
            "filters:casinos": false,
            "filters:castle": false,
            "filters:chalet": false,
            "filters:children_allowed": false,
            "filters:clothes_dryer": false,
            "filters:cottage": false,
            "filters:crib": false,
            "filters:cycling": false,
            "filters:dining_room": false,
            "filters:dishwasher": false,
            "filters:downtown_location": false,
            "filters:elevator": false,
            "filters:estate": false,
            "filters:events_allowed": false,
            "filters:families": false,
            "filters:fireplace": false,
            "filters:fishing": false,
            "filters:free_cancellation": false,
            "filters:garden_or_backyard": false,
            "filters:golf_course": false,
            "filters:golfing": false,
            "filters:guest_house": false,
            "filters:highly_rated_for_cleanliness": false,
            "filters:highly_rated_for_location": false,
            "filters:hiking": false,
            "filters:horseback_riding": false,
            "filters:hot_tub": false,
            "filters:hotel": false,
            "filters:house": false,
            "filters:houseboat": false,
            "filters:instant_confirmation": false,
            "filters:internet_available": false,
            "filters:iron_and_board": false,
            "filters:kids_high_chair": false,
            "filters:king_sized_bed": false,
            "filters:kitchen": false,
            "filters:lake_location": false,
            "filters:living_room": false,
            "filters:microwave": false,
            "filters:monthly_discount": false,
            "filters:mountains_location": false,
            "filters:museums": false,
            "filters:new_listing_price": false,
            "filters:ocean": false,
            "filters:oceanfront": false,
            "filters:outdoor_grill": false,
            "filters:outdoor_space": false,
            "filters:oven": false,
            "filters:parking": false,
            "filters:patio_or_deck": false,
            "filters:pay_later_with_affirm": false,
            "filters:pets_allowed": false,
            "filters:pool": false,
            "filters:premier_host": false,
            "filters:private_pool": false,
            "filters:resort": false,
            "filters:rock_or_mountain_climbing": false,
            "filters:rural_location": false,
            "filters:scuba_diving_or_snorkeling": false,
            "filters:shopping": false,
            "filters:skiin_skiout": false,
            "filters:skiing_or_snowboarding": false,
            "filters:smoke_detector": false,
            "filters:smoking_allowed": false,
            "filters:spa_and_wellness": false,
            "filters:stove": false,
            "filters:television": false,
            "filters:tennis": false,
            "filters:theme_parks": false,
            "filters:villa": false,
            "filters:village_location": false,
            "filters:virtual_tour": false,
            "filters:washer": false,
            "filters:waterfront": false,
            "filters:watersports": false,
            "filters:weekly_discount": false,
            "filters:wheelchair_accessible": false,
            "filters:wineries_or_breweries": false,
            "filters:winter_activities": false,
            "filters:zoo_or_wildlife_viewing": false,
            "includes:amenities": true,
            "includes:calendar": false,
            "includes:description": false,
            "includes:faq": false,
            "includes:gallery": false,
            "includes:landmarks": false,
            "includes:location": true,
            "includes:offers": false,
            "includes:policies": false,
            "includes:review": true,
            "includes:review_count": 10,
            "location": location,
            "total_price": false,
            "limit": 10,
            "adults": 1,
            "children": 0,
            "pets": 0
        }

    };

    try {
        const response = await axios.post('https://api.apify.com/v2/actor-tasks', body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error running actor task:', error);
        throw error;
    }
}
module.exports.createExpediaTask = async function ({url, apifyToken}) {

    const body = {

        "actId": "4zyibEJ79jE7VXIpA",
        "name": `${getRandomInt()}-expedia-listing-url-${Math.floor(Date.now() / 1000)}`,
        "options": {
            "build": "latest",
            "timeoutSecs": 300,
            "memoryMbytes": 1024
        },
        "input": {
            "debugLog": false,
            "startUrls": [
                {
                    "url": url
                }
            ],
            "maxReviewsPerHotel": 10,
            "proxyConfiguration": {
                "useApifyProxy": true,
                "apifyProxyGroups": [
                    "RESIDENTIAL"
                ]
            },
            "maxRequestRetries": 8,
            "sortBy": "Most relevant",
            "minDate": "1990-01-01"
        }

    };

    try {
        const response = await axios.post('https://api.apify.com/v2/actor-tasks', body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error running actor task:', error);
        throw error;
    }
}
module.exports.createExpediaScraperTask = async function ({url, apifyToken}) {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/');
    let locationId;
    for (let segment of pathSegments) {
        if (segment.includes('.h') && segment.includes('Hotel')) {
            const hotelId = segment.split('.h').pop();
            locationId = hotelId.split('.').shift();
        }
    }
    const body = {

        "actId": "pK2iIKVVxERtpwXMy",
        "name": `${getRandomInt()}-expedia-scraper-listing-url-${Math.floor(Date.now() / 1000)}`,
        "options": {
            "build": "latest",
            "timeoutSecs": 300,
            "memoryMbytes": 1024
        },
        "input": {
            "access:accessible_bathroom": false,
            "access:accessible_parking": false,
            "access:elevator": false,
            "access:in_room_accessible": false,
            "access:roll_in_shower": false,
            "access:service_animal": false,
            "access:sign_language_interpreter": false,
            "access:stair_free_path": false,
            "amenities:air_conditioning": false,
            "amenities:balcony_or_terrace": false,
            "amenities:casino": false,
            "amenities:crib": false,
            "amenities:electric_car": false,
            "amenities:free_airport_transportation": false,
            "amenities:gym": false,
            "amenities:hot_tub": false,
            "amenities:kitchen_kitchenette": false,
            "amenities:ocean_view": false,
            "amenities:parking": false,
            "amenities:pets": false,
            "amenities:pool": false,
            "amenities:restaurant_in_hotel": false,
            "amenities:spa_on_site": false,
            "amenities:washer_dryer": false,
            "amenities:water_park": false,
            "amenities:wifi": false,
            "dev_dataset_clear": false,
            "dev_dataset_enable": false,
            "dev_no_retry": false,
            "dev_transform_enable": false,
            "includes:amenities": false,
            "includes:calendar": false,
            "includes:description": false,
            "includes:faq": false,
            "includes:gallery": true,
            "includes:landmarks": false,
            "includes:location": false,
            "includes:offers": false,
            "includes:policies": false,
            "includes:review": false,
            "location": locationId,
            "meals:all_inclusive": false,
            "meals:free_breakfast": false,
            "meals:full_board": false,
            "meals:half_board": false,
            "payment:free_cancellation": false,
            "payment:pay_later": false,
            "payment:pay_without_creditcard": false,
            "rewards:member_only": false,
            "rewards:vip": false,
            "star:10": false,
            "star:20": false,
            "star:30": false,
            "star:40": false,
            "star:50": false,
            "styles:homes": false,
            "styles:hotels": false,
            "styles:luxury": false,
            "styles:outdoor": false,
            "styles:unique": false,
            "traveler:business": false,
            "traveler:family": false,
            "traveler:lgbt": false,
            "types:agritourism": false,
            "types:apart_hotel": false,
            "types:apartment": false,
            "types:bed_and_breakfast": false,
            "types:cabin": false,
            "types:capsule_hotel": false,
            "types:caravan_park": false,
            "types:castle": false,
            "types:chalet": false,
            "types:condo": false,
            "types:condo_resort": false,
            "types:cottage": false,
            "types:country_house": false,
            "types:cruise": false,
            "types:guest_house": false,
            "types:holiday_park": false,
            "types:hostal": false,
            "types:hostel": false,
            "types:hotel": false,
            "types:hotel_resort": false,
            "types:house_boat": false,
            "types:inn": false,
            "types:lodge": false,
            "types:motel": false,
            "types:palace": false,
            "types:pension": false,
            "types:pousada_brazil": false,
            "types:pousada_portugal": false,
            "types:ranch": false,
            "types:residence": false,
            "types:riad": false,
            "types:ryokan": false,
            "types:safari": false,
            "types:townhouse": false,
            "types:tree_house": false,
            "types:vacation_home": false,
            "types:villa": false,
            "limit": 1
        }

    };

    try {
        const response = await axios.post('https://api.apify.com/v2/actor-tasks', body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error running actor task:', error);
        throw error;
    }
}
module.exports.createTripadvisorTask = async function ({url, apifyToken}) {

    const body = {

        "actId": "Hvp4YfFGyLM635Q2F",
        "name": `${getRandomInt()}-tripadvisor-listing-url-${Math.floor(Date.now() / 1000)}`,
        "options": {
            "build": "latest",
            "timeoutSecs": 300,
            "memoryMbytes": 1024
        },
        "input": {
            "addMoreHostInfo": false,
            "calendarMonths": 0,
            "debugLog": false,
            "includeReviews": true,
            "limitPoints": 100,
            "maxConcurrency": 50,
            "maxListings": 10,
            "maxReviews": 10,
            "proxyConfiguration": {
                "useApifyProxy": true
            },
            "simple": false,
            "startUrls": [
                {
                    "url": url
                }
            ],
            "timeoutMs": 300000
        },

    };

    try {
        const response = await axios.post('https://api.apify.com/v2/actor-tasks', body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error running actor task:', error);
        throw error;
    }
}
module.exports.createTripadvisorScraperTask = async function ({url, apifyToken}) {

    const body = {

        "actId": "dbEyMBriog95Fv8CW",
        "name": `${getRandomInt()}-tripadvisor-scraper-listing-url-${Math.floor(Date.now() / 1000)}`,
        "options": {
            "build": "latest",
            "timeoutSecs": 300,
            "memoryMbytes": 1024
        },
        "input": {
            "currency": "USD",
            "includeAttractions": true,
            "includeHotels": true,
            "includePriceOffers": true,
            "includeRestaurants": true,
            "includeTags": true,
            "includeVacationRentals": false,
            "language": "en",
            "maxItemsPerQuery": 1,
            "startUrls": [
                {
                    "url": url
                }
            ],
            "checkInDate": "",
            "checkOutDate": ""
        },

    };

    try {
        const response = await axios.post('https://api.apify.com/v2/actor-tasks', body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apifyToken}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error running actor task:', error);
        throw error;
    }
}
