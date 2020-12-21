const express = require("express")
const app = express()
const cors = require("cors")
const models = require("./models")
const bodyParser = require("body-parser")
const PORT = 8000

// routes
const router = express.Router()
router.use(bodyParser.json())
const salesRouter = require("./routes/sales")
app.use("/sales", salesRouter)
const materialByProdNumsRouter = require("./routes/materialByProdNums")
app.use("/materialsByProdNumber", materialByProdNumsRouter)


app.use(cors())

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`)
})


