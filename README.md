(ENG)
An application for systematization and random selection of your leisure activities.

## What is the application for?

I think everyone has had this experience. I've completed some difficult task and it's time to finally have a good rest. But you can't choose what to do on your well-deserved vacation. But I don't have the strength to think anymore. And as a result, a lot of time has passed, and you realize yourself watching a YouTube video about an ant colony or watching the hundredth shorts. And you go to bed feeling the futility of your time.

With this application, you can pre-select a list of things you would like to do. And you will need to put much less effort into choosing and thinking, which will certainly motivate you to a more active and interesting vacation. Although you may have other plans. Who knows? You write down what you will probably have to do. And if you don't like the randomly suggested option, you can always try again or just choose yourself from the list. Everything is in your hands... and even chance)

## Technologies

- TypeScript
- Next.js
- Redux Toolkit
- MongoDB
- Tailwind CSS
- Axios
- bcryptjs
- i18next
- jose
- js-cookie
- jsonwebtoken
- react-beautiful-dnd

## Installation and launch

### Installing dependencies

```bash
$ npm install

Launching a development server
$ npm run dev

The server will be running on localhost:3000.

Building and running the server
$ npm run build
$ npm run start
```

### API

POST /api/sections/[_id]/activities
Adds a new activity to the specified section.

Parameters
\_id: Section ID (in URL)
name: The name of the new activity (in the request body)
Request Example
curl -X POST http://localhost:3000/api/sections/12345/activities -d '{"name": "Reading a book"}' -H "Content-Type: application/json"

Sample response
{
"\_id": "12345",
"activities": [
{
"name": "Reading a book"
}
]
}

(RUS)
Приложение для систематизации и случайного подбора видов вашего досуга.

## Для чего приложение нужно

Думаю, у каждого бывало такое. Вот выполнил какую-то сложную задачу и пришло время наконец хорошо отдохнуть. Но вы не можешь выбрать, чем же заняться в свой заслуженный отдых. А на размышления уже нет сил. И в итоге прошло уже много времени, и вы осознаете себя смотрящим ролик на YouTube про колонию муравьёв или смотрящим уже сотый shorts. И ты ложишься спать с ощущением бесполезности проведённого времени.

С помощью этого приложения вы сможете заранее выбрать перечень дел, которыми вы хотели бы заняться. И вам нужно будет прикладывать значительно меньше усилий для выбора и раздумий, что наверняка замотивирует вас к более активному и интересному отдыху. Хотя может быть у вас другие планы. Кто знает? Вы сами вписываете, чем вам вероятно придётся заняться. И если вам не понравится случайно предложенный вариант, то всегда можете зарандомить снова или просто выбрать самому из списка. Все в ваших руках..., и даже случайность)

## Технологии

- TypeScript
- Next.js
- Redux Toolkit
- MongoDB
- Tailwind CSS
- Axios
- bcryptjs
- i18next
- jose
- js-cookie
- jsonwebtoken
- react-beautiful-dnd

## Установка и запуск

### Установка зависимостей

```bash
$ npm install

Запуск сервера для разработки
$ npm run dev

Сервер будет запущен на localhost:3000.

Сборка и запуск сервера
$ npm run build
$ npm run start
```

### API

POST /api/sections/[_id]/activities
Добавляет новое занятие в указанную секцию.

Параметры
\_id: ID секции (в URL)
name: Название нового занятия (в теле запроса)
Пример запроса
curl -X POST http://localhost:3000/api/sections/12345/activities -d '{"name": "Чтение книги"}' -H "Content-Type: application/json"

Пример ответа
{
"\_id": "12345",
"activities": [
{
"name": "Чтение книги"
}
]
}
