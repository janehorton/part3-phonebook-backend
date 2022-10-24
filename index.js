const express = require('express');
const app = express();

// Middlewares
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
morgan.token('post-data', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(express.static('build'));

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
    
    if (!body.name || !body.number) {
        response.status(400).json({
            error: "specified name and/or number is missing"
        })
    }
    else if (persons.find(person => person.name === body.name)) {
        response.status(409).json({
            error: "specified name already exists in the phonebook"
        })
    }
    else {
        const person = {
            name: body.name,
            number: body.number || "not specified",
            id: generateId(),
        };

        persons = persons.concat(person);

        response.json(person);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});