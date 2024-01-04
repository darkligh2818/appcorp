const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const { engine } = require('express-handlebars')
const expressSession = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(expressSession);


const app = express()
const PORT = config.get('PORT' || 3006)
const MONGO_URI = config.get('MONGO_URI')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

var store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions-list'
});


app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: 'hbs'
}))

app.set('view engine', 'hbs')
app.set('views', './views')

app.use(
  expressSession({
    secret: config.get('secretKey'),
    resave: false,
    saveUninitialized: true,
    store
  }))

app.use(cors());
app.use(
  fileUpload({
    limits: {
      fieldSize: 1024 * 1024 * 50,
    },
  })
);

app.use(require('./router'))

app.use("/files", express.static("files"))
app.use("/assets", express.static("assets"))

const dev = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    await app.listen(PORT)
    console.log(`Server: ${PORT}. MongoDB: Ok`)
  } catch (error) {
    console.error(error)
  }
}

dev()