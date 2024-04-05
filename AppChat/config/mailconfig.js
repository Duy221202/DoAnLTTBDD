const nodemailer = require('nodemailer');

// Tạo 1 transporter cho dịch vụ email của bạn
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'hostotpmail@gmail.com', // địa chỉ email
        pass: 'Tu@123456',
    },
});

module.exports = transporter;