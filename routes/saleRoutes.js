const express = require("express")
const router = express.Router()
const models = require("../models")
const { Op } = require("sequelize")

// get all sales
router.get("/getAllSales/:start/:end", async (req, res) => {
   let start = req.params.start
   let end = req.params.end

   let sales = await models.Sale.findAll({
      where: {
         date_sold: {
            [Op.between]: [start, end],
         },
      },
   })
   res.send(sales)
})

// add new sale
router.post("/addNewSale", async (req, res) => {
   await models.Sale.create({
      product_id: req.body.product_id,
      product_number: req.body.product_number,
      product_name: req.body.product_name,
      product_category: req.body.product_category,
      price_per_unit: req.body.price_per_unit,
      quantity: req.body.quantity,
      total_price: req.body.total_price,
      sold_to: req.body.sold_to,
      date_sold: req.body.date_sold,
      discount: req.body.discount,
      tax: req.body.tax,
      shipping: req.body.shipping,
   })

   res.send("new sale added")
})

// update sale
router.put("/:id/updateASale", async (req, res) => {
   const id = req.params.id
   const product_id = req.body.product_id
   const product_number = req.body.product_number
   const product_name = req.body.product_name
   const product_category = req.body.product_category
   const price_per_unit = req.body.price_per_unit
   const quantity = req.body.quantity
   const total_price = req.body.total_price
   const sold_to = req.body.sold_to
   const discount = req.body.discount
   const tax = req.body.tax
   const shipping = req.body.shipping

   console.log(id)
   await models.Sale.update(
      {
         product_id: product_id,
         product_number: product_number,
         product_name: product_name,
         product_category: product_category,
         price_per_unit: price_per_unit,
         quantity: quantity,
         total_price: total_price,
         sold_to: sold_to,
         discount: discount,
         tax: tax,
         shipping: shipping,
      },
      {
         where: {
            id: id,
         },
      }
   ).then(() => {
      res.status(200).json({ success: true, updatedSale: id })
   })
})

// delete a sale
router.delete("/:id/deleteASale", (req, res) => {
   const id = req.params.id
   models.Sale.destroy({
      where: {
         id: id,
      },
   }).then(() => {
      res.status(200).json({ success: true, updatedSale: id })
   })
})

module.exports = router
