const axios = require("axios");

const replyToEmail = 'message@incoming.stellar-trust.com';

function getReplyToEmailID({id}) {
    const splitReplyToEmail = replyToEmail.split('@');
    return `${splitReplyToEmail[0]}+${id}@${splitReplyToEmail[1]}`;

}

module.exports.sendMailBySendGrid = async function ({email, subject, content, id, token}) {


    let data = JSON.stringify({
        "personalizations": [
            {
                "to": [
                    {
                        "email": email
                    }
                ],
                "subject": subject
            }
        ],
        "content": [
            {
                "type": "text/plain",
                "value": content
            }
        ],
        "from": {
            "email": replyToEmail,
            "name": "Stellar"
        },
        "reply_to": {
            "email": getReplyToEmailID({id: id}),
            "name": "Stellar"
        },
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    };

    const sendMailResponse = await axios.request(config);
    if (sendMailResponse.status === 202 || sendMailResponse.status === 200 || sendMailResponse.status === 201) {
        return true;
    } else {
        console.error('Error sending email:', sendMailResponse.data);
        return false;
    }
}


module.exports.sendDynamicTemplateMailBySendGrid = async function ({
                                                                       email,
                                                                       dynamic_template_data,
                                                                       template_id,
                                                                       id,
                                                                       token
                                                                   }) {


    let data = JSON.stringify({
        "personalizations": [
            {
                "to": [
                    {
                        "email": email
                    }
                ],
                "dynamic_template_data": dynamic_template_data
            }
        ],
        "from": {
            "email": replyToEmail,
            "name": "Stellar"
        },
        "template_id": template_id,
        "reply_to": {
            "email": getReplyToEmailID({id: id}),
            "name": "Stellar"
        },
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    };

    const sendMailResponse = await axios.request(config);
    if (sendMailResponse.status === 202 || sendMailResponse.status === 200 || sendMailResponse.status === 201) {
        return true;
    } else {
        console.error('Error sending email:', sendMailResponse.data);
        return false;
    }
}

