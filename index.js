require('dotenv').config();
const path = require('path')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const multer = require('multer')
const marked = require('marked')

const minio = require('minio')
const minioHost = process.env.MINIO_HOST || 'localhost'
const minioBucket = 'image-storage'

const app = express()
const port = process.env.PORT || 3000
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dev'
// const mongoURL = process.env.MONGO_LOCAL_CONNECTION_STRING || 'mongodb://localhost:27017/dev'

async function initMongo() {
  console.log('Initialising MongoDB...')
  let success = false
  while (!success) {
    try {
      client = await MongoClient.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      success = true
    } catch {
      console.log('Error connecting to MongoDB, retrying in 1 second')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log('MongoDB initialised')
  return client.db(client.s.options.dbName).collection('notes')
}

// create a bucket on MinIO, can be seen as the "folder" where your pictures are saved
async function initMinIO() {
  console.log('Initialising MinIO...')
  const client = new minio.Client({
    endPoint: minioHost,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  })
  let success = false
  while (!success) {
    try {
      if (!(await client.bucketExists(minioBucket))) {
        await client.makeBucket(minioBucket)
      }
      success = true
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log('MinIO initialised')
  return client
}

async function start() {
  const db = await initMongo()
  const minio = await initMinIO()

  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'views'))
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('/', async (req, res) => {
    res.render('index', { notes: await retrieveNotes(db) })
  })

  // saves uploaded pictures in the public/uploads folder app directory + inserts link to the file into the text box
  app.post(
    '/note',
    // multer({ dest: path.join(__dirname, 'public/uploads/') }).single('image'),
    multer({ storage: multer.memoryStorage() }).single('image'),
    async (req, res) => {
      if (!req.body.upload && req.body.description) {
        await saveNote(db, { description: req.body.description })
        res.redirect('/')
      } else if (req.body.upload && req.file) {
        await minio.putObject(
          minioBucket,
          req.file.originalname,
          req.file.buffer
        )
        const link = `/img/${encodeURIComponent(req.file.originalname)}`
        // const link = `/uploads/${encodeURIComponent(req.file.filename)}`
        res.render('index', {
          content: `${req.body.description} ![](${link})`,
          notes: await retrieveNotes(db),
        })
      }
    },
  )

//retrieves a picture by its name from MinIO and serves it to the client
 app.get('/img/:name', async (req, res) => {
    const stream = await minio.getObject(
      minioBucket,
      decodeURIComponent(req.params.name),
    )
    stream.pipe(res)
  })
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
  })
}

async function saveNote(db, note) {
  await db.insertOne(note)
}

async function retrieveNotes(db) {
  const notes = (await db.find().toArray()).reverse()
  return notes.map(it => {// converts all the notes to HTML before returning them
    return { ...it, description: marked(it.description) }
  })


}

start()
