const express = require("express")
const app = express()
// const bodyParser = require("body-parser")
const PORT = 8000
const router = express.Router()
const cors = require("cors")
const models = require("./models")


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// routes
const salesRouter = require("./routes/saleRoutes")
app.use("/sales", salesRouter)
const materialByProdNumsRouter = require("./routes/materialByProdNumsRoutes")
app.use("/materialByProdNums", materialByProdNumsRouter) 

const materialRoutes = require("./routes/materialRoutes")
const productRoutes = require("./routes/productRoutes")
app.use("/", materialRoutes)
app.use("/", productRoutes)

app.get("/", (req, res) => {
   res.send("Hello to Silverthread Designs API")
})

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`)
})
