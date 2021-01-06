const express = require("express")
const app = express()
// const bodyParser = require("body-parser")
const PORT = 8000
const router = express.Router()
const cors = require("cors")
// const models = require("./models")
global.models = require("./models")

const cookieParser = require('cookie-parser')
const session = require('express-session')


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(
   session({
      key:"userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie: {
         expires: 60 * 60 * 24
      }
   })
)


// routes
const loginRouter = require("./routes/loginRoutes")
app.use("/login", loginRouter)

const registerRouter = require("./routes/registerRoutes")
app.use("/register", registerRouter)

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
