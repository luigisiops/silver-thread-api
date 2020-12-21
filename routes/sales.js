const express = require("express")
const router = express.Router()
const models = require("../models")

// get all sales
router.get("/getAllSales", async (req, res) => {
   let sales = await models.Sale.findAll({})
   res.send(sales)
})

// add new sale
router.post("/addNewSale", async (req, res) => {
   await models.Sale.create({
      product_id: req.body.product_id,
      product_num: req.body.product_num,
      product_category: req.body.product_category,
      quantity: req.body.quantity,
      total_price: req.body.total_price,
   })

   res.send("new sale added")
})

// delete a sale
router.delete("/deleteASale", async (req, res) => {
   const deletedSale = await models.Sale.findOne({
      where: {
         id: req.body.id,
      },
   })
   await deletedSale.destroy()
   res.send("sale deleted")
})

router.post
module.exports = router