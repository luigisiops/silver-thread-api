const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = 8000

// routes
const router = express.Router()
router.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const salesRouter = require("./routes/sales")
app.use("/sales", salesRouter)
const materialByProdNumsRouter = require("./routes/materialByProdNums")
app.use("/materialsByProdNumber", materialByProdNumsRouter)
const models = require('./models')
const materialRoutes = require('./routes/materialRoutes')
const productRoutes = require('./routes/productRoutes')



const cors = require('cors')
app.use(express.urlencoded())
app.use(express.json())



app.use(cors())

app.use('/', materialRoutes)
app.use('/', productRoutes)

app.get("/", (req,res) => {
    res.send('Hello to Silverthread Designs API');
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})
