// Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, необходимо реализовать хранение массива в файле.

//     Подсказки:
// — В обработчиках получения данных по пользователю нужно читать файл
// — В обработчиках создания, обновления и удаления нужно файл читать, чтобы убедиться, что пользователь существует, а затем сохранить в файл, когда внесены изменения
// — Не забывайте про JSON.parse() и JSON.stringify() - эти функции помогут вам переводить объект в строку и наоборот.

// * Формат сдачи работы: *
//     Ссылка на гитхаб / гитлаб
// Файл с кодом.



const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');

//инициализируем приложение express
const app = express();

const usersListPath = path.join(__dirname, 'users.json');
//определяем нашу базу данных для хранения статей
//const users = [];

//создаем уникальный ID для каждой статьи
let uniqueID = 0;

const userSchema = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    city: joi.string().min(2).required(),
    age: joi.number().min(0).max(150).required(),

})
//обработчик, который позволяет в теле запроса получать JSON
app.use(express.json());


app.get('/users', (req, res) => {
    res.send({ users });
})
//GET получить всех пользователей
app.get('/users', (req, res) => {
    const usersJson = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    res.send({ users: usersData });
});
//GET получить конкретного пользователя
app.get('/users/:id', (req, res) => {
    const usersJson = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    const user = usersData.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null, message: 'Пользователь не найден' });
    }
});
//POST добавление нового пользователя
app.post('/users', (req, res) => {
    const validateData = userSchema.validate(req.body);
    if (validateData.error) {
        return res.status(400).send({ error: validateData.error.details })
    };
    const usersJson = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    uniqueID += 1;

    usersData.push({
        id: uniqueID, //"id": 1+1
        ...req.body // spread оператор, 
    });
    fs.writeFileSync(usersListPath, JSON.stringify(usersData));

    res.send({
        id: uniqueID,
    });
});

// PUT обновление
app.put('/users/:id', (req, res) => {
    const validateData = userSchema.validate(req.body);
    if (validateData.error) {
        return res.status(400).send({ error: validateData.error.details })
    };
    const usersJson = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJson);

    const user = usersData.find((user) => user.id === Number(req.params.id));

    if (user) {
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;

        fs.writeFileSync(usersListPath, JSON.stringify(usersData));

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null, message: 'Пользователь не найден' });
    }
});

app.use((req, res) => {
    res.status(404).send({
        message: 'URL нет !'
    })
});

app.listen(3000);



