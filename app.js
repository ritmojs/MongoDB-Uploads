const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const formidable = require('formidable')
const fs = require('fs')
//connection with mongoDb
mongoose.connect('mongodb://localhost:27017/uploadapp', { useNewUrlParser: true })
    .then(response => {
        console.log('DB CONNECTED')
    }).catch(err => console.log("Unable to Connect with DB"));



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trime: true,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    mno: {
        type: Number,
        required: true
    }
})
const User = mongoose.model('User', userSchema)

//middleware
app.use(bodyParser.json())
app.use(cors())

const userData = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {
        if (fields) {
            const { name, email, mno } = fields
            if (!name || !email || !mno) {
                return res.status(400).json({
                    error: "Fill all the Fields"
                })
            }



        }
        if (file.photo) {
            if (file.photo.size > 4000000) {
                return res.status(400).json({
                    error: "Image size is too long"
                })
            }
            const user = new User(fields);
            user.photo.data = fs.readFileSync(file.photo.path)
            user.photo.contentType = file.photo.type


            user.save((err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: "Not save in DB"

                    })

                }
                return res.json(user)
            })
        }
    })

}
//router
app.post('/userdasbord', userData)


const port = 8000;
app.listen(port, () => {
    console.log(`App is running at ${port}`)
});