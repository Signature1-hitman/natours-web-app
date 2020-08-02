const nodemailer = require('nodemailer');
const sendEmail = async options=>{
    //1) Create a transporter
    const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
        auth:{

            user: process.env.EMAIL_USER,
            pass:process.env.PASS
        }
    })
    //2) define the email options
    const mailOptions={
        from:'Shivansh Saxena',
        to:optional.email,
        subject:options.subject,
        text: options.message
        
    }
    await transporter.sendMail(mailOptions)
    // 3) Actually send the mail
}
module.exports = sendEmail