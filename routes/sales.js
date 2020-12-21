const express = require("express")
const router = express.Router()
const models = require("../models")

// get all sales
router.get("/getAllSales", async (req, res) => {
   let sales = await models.Sale.findAll({})
   res.send(sales)
})

// add new sale
// need to add req.body stuff but i couldnt figure it out without getting error that the stuff was undefined
router.post("/addNewSale", async (req, res) => {
   let newSale = await models.Sale.create({
      product_id: 12,
      product_num: 12,
      product_category: "category",
      quantity: 12,
      total_price: 12,
   })

   res.send("new sale added")
})

// delete a sale
// need to add req.body as well using id stored in the state
router.delete("/deleteASale", async (req, res) => {
   const deletedSale = await models.Sale.findOne({
      where: {
         id: 3,
      },
   })
   await deletedSale.destroy()
   res.send("sale deleted")
})

router.post
module.exports = router