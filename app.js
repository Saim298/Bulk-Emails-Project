const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv'); // Add this line

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, 'csvFile.csv');
    },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('csvFile'), (req, res) => {
    // Process the uploaded file (csvFile)
    const { title, description } = req.body;

    // Use the createTransport with OAuth2 for security in production
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'saimarifeen298@gmail.com',
            pass: process.env.PASSWORD, // Use the password from environment variables
        },
    });

    fs.createReadStream('uploads/csvFile.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Send email logic here using nodemailer
            const mailOptions = {
                from: 'saimarifeen298@gmail.com',
                to: row.email,
                subject: title,
                text: description,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed.');
            res.redirect('/');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
