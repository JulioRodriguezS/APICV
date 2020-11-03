const server = require('express')
const app = server()
const cors = require('cors')
const bodyParser = require('body-parser')

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(server.urlencoded({extended:false }))

//routes
require('./routes')(app,server)

app.set('port', (process.env.PORT || 3003))
const port = app.get('port')
app.listen(port, ()=>{console.log('connected on port: ', port)})
