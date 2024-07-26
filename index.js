require('./mongo')

const express = require ('express')
const app = express()
const cors = require('cors')

const Note = require('./models/Note')

const logger = require("./loggerMiddleware")
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())
app.use(logger)


app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response)=>{
  Note.find({})
  .then(notes => {
    //console.log(notes)
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next)=>{
    const {id} = request.params;
    
    Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
        //console.log({note})
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const {id} = request.params;

    Note.findByIdAndDelete(id)
      .then(() => response.status(204).end())
      .catch(err => next(err)) 
});

app.put('/api/notes/:id', (request, response, next) => {
  const {id} = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
    .then( result =>{
      response.json(result).status(200).end()
    })
    .catch(err => next(err))
});

app.post('/api/notes', (request, response, next)=>{
  const note = request.body 
  //console.log(note)

  //validación de que la nota tiene contenido
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note ({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(err => next(err))

})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`);
});
