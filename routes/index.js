const server = require('express')
const app = server()


app.use(require('routes')(server,app))

const port = (process.env.PORT || 3003)

app.listen(port,()=>{
    console.log('run on port',port)
})
