const {
    SES
} = require("@aws-sdk/client-ses");
require('dotenv').config();

const ses = new SES({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },

    region: process.env.AWS_REGION
});

const sendEmail = async (email, data, template) => {
    console.log("Email passed:", email);
    console.log("Data passed:", data);
    console.log("Template name:", template);

    if (!email || !email.includes("@")) {
        console.error("Invalid email format detected!");
        throw new Error("Invalid email address provided.");
    }

    const params = {
        Source: "pathalertdev@gmail.com", // Ensure this is verified in SES
        Template: template,
        Destination: {
            ToAddresses: [email],
        },
        TemplateData: JSON.stringify(data),
    };

    try {
        const result = await ses.sendTemplatedEmail(params);
        console.log("Email sent successfully:", result);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
};


module.exports = { sendEmail };