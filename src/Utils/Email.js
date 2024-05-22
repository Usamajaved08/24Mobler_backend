import nodemailer from 'nodemailer';
import EmailTemplate from './EmailTemplate.js';

export async function sendEmail({ product, user, emailSubject, emailMsg }) {
    const smtpUser = process.env.SMTP_USER_USERNAME;
    const smtpPassword = process.env.SMTP_USER_PASSWORD;
    const emailSender = process.env.EMAIL_SENDER;

    if (!smtpUser || !smtpPassword || !emailSender) {
        throw new Error('Missing required environment variables for email sending.');
    }
    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 2525,
        auth: {
            user: smtpUser,
            pass: smtpPassword,
        },
    });
    // let htmlContent;
    // if (emailSubject = "Product Uploaded") {
    //     htmlContent = `
    //   <h2>${user?.username}, Your Product is Successfully Submitted For Review</h2>
    //   <p>Product Name: ${product?.title}</p>
    // `;
    // } else {
    //     htmlContent = `
    //   <h2>${user?.username}, Your Product Status Updated!</h2>
    //   <p>Product Name: ${product?.title}</p>
    //   <p>Status updated to: ${product?.status}</p>
    //   ${product?.reason ? `<p>Decline Reason: ${product?.reason}</p>` : ''}
    // `;
    // }
    console.log("emailMsg >>>>", emailMsg);
    console.log("emailSubject >>>>", emailSubject);
    const emailOptions = {
        from: emailSender,
        to: user?.email,
        subject: emailSubject,
        html: EmailTemplate({ name: user?.username, message: emailMsg }),
    };
    try {
        await transporter.sendMail(emailOptions);
        console.log(`Email sent to user: ${user?.username}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
