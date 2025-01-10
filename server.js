const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Настройки почтового сервера (замените на свои)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Замените на ваш email
const YOUR_EMAIL = process.env.EMAIL_USER;

let selectedFoods = [];

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

app.post('/notify', (req, res) => {
    console.log('req.body:', req.body); // Добавляем лог для отладки
    const message = req.body.message;

    if (!message) {
        return res.status(400).send({ error: 'Сообщение не предоставлено' });
    }

    selectedFoods.push(message);
    console.log('Сообщения:', selectedFoods);

    res.status(200).send({ message: 'Выбор сохранен' }); // Изменено на res.status(200)
});

setInterval(() => {
    console.log('Проверка уведомлений'); // Добавляем лог
    if (selectedFoods.length > 0) {
        const messagesToSend = selectedFoods;
        selectedFoods = [];

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: YOUR_EMAIL,
            subject: 'Уведомление о выборе еды',
            text: messagesToSend.join("\n")
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Ошибка при отправке письма:", error);
                return;
            }
            console.log("Письмо отправлено:", info.response);
        });
    }
}, 10000);

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
