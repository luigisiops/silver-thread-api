const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = 8000
const router = express.Router()
const cors = require("cors")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const models = require("./models")
app.use(cors())

// routes
const salesRouter = require("./routes/sales")
app.use("/sales", salesRouter)
const materialByProdNumsRouter = require("./routes/materialByProdNums")
app.use("/sales", materialByProdNumsRouter) 
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
