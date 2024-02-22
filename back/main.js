require('dotenv').config();
const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors')

const app = express();
const Todo = require('./todo')

app.use(express.json());
app.use(cors({
    origin:'*'
}))

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})



app.post('/post', async (req, res) => {
    const data = new Todo({
        text: req.body.text,
        date: req.body.date
    })
    try {
        const dataToSave =await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


app.get('/getAll', async (req, res) => {
    try{
        const data = await Todo.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Get by ID Method
app.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Todo.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Delete by ID Method
app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Todo.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Todo.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})