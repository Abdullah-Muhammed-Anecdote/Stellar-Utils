
 const  axios  = require ("axios");


 module.exports.sendMailBySendGrid = async function  ({ email,subject, content,id,token})  {


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
                "email": "noreply@stellar-trust.com",
                "name": "Stellar"
            },
            "reply_to": {
                "email": "noreply@stellar-trust.com",
                "name": "Stellar"
            },
            "headers": {
                "ID": id
            }
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
        if (sendMailResponse.status === 202||sendMailResponse.status === 200||sendMailResponse.status === 201){
            return true;
        } else {
            console.error('Error sending email:', sendMailResponse.data);
            return false;
        }
}

