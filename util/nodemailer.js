const nodemailer = require("nodemailer");

const send = async (subject = null, html = null) => {
    const testAccount = await nodemailer.createTestAccount();


    const config = {
        host: "smtp.ethereal.email",
        port: "",
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    }
    const transporter = nodemailer.createTransport(config);

    const option = {
        from: "ravistha869@gmail.com",
        to: "shrestha.ravi.1.a@gmail.com",
        subject: subject,
        html: html
    }

    return transporter.sendMail(option)
        .then(info => {
            console.log("info:", info);
            console.log("preview:", nodemailer.getTestMessageUrl(info));
        })
        .catch(err => console.log("sendmailError: ", err))

}

export default send;