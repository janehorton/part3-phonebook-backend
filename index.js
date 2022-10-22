const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people </p> ${date}`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) response.json(person);
    else response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    console.log("DELETED id:", id);
    response.status(204).end();
});

const generateId = () => {
    const minId = 1;
    const maxId = Number.MAX_SAFE_INTEGER;
    const id = Math.floor(Math.random() * (maxId - minId) + minId);
    return id;
}

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    if (!body.content) {
        request.status(400).json({
            error: "content missing"
        })
    }

    const person = {
        name: body.content,
        number: body.number || "not specified",
        id: generateId(),
    };

    persons = persons.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on PORT ${PORT}`);