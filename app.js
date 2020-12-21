const express = require("express")
const app = express()
const models = require('./models')
const materialRoutes = require('./routes/materialRoutes')
const productRoutes = require('./routes/productRoutes')



const cors = require('cors')
app.use(express.urlencoded())
app.use(express.json())


const PORT = 8000

app.use(cors())

app.use('/', materialRoutes)
app.use('/', productRoutes)

app.get("/", (req,res) => {
    res.send('Hello to Silverthread Designs API');
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})