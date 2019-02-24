const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);


function sendTxt(to, body) {
    return client.messages
        .create({
            to, body,
            from: "+19293343145",
        });
}


function sendVerification(number, code) {
    let msg = `Your verification code: ${code}`;
    return sendTxt(number, msg);
}

module.exports = { sendVerification };