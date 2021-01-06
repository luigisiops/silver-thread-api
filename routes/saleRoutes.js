const express = require("express")
const router = express.Router()
//const models = require("../models")
const { Op } = require("sequelize")
const functions = require('../functions/salesFunctions')

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
   let product_id = parseInt(req.body.productDetails.id)
   let product_number = req.body.productDetails.product_num
   let product_name = req.body.productDetails.product_name
   let product_category = req.body.productDetails.category
   let price_per_unit = req.body.productDetails.retail_price
   let quantity = parseInt(req.body.quantity)
   let discount = parseInt(req.body.discount)
   let shipping = parseFloat(req.body.shipping)
   let sold_to = req.body.sold_to
   let date_sold = req.body.date_sold
   let tax_rate = req.body.tax
   let sold_PTM = req.body.sold_PTM  

   let total_price = functions.calculateTotalPrice(quantity, price_per_unit, discount)
   let tax = (total_price * (tax_rate / 100)).toFixed(2)   

   await functions.adjustInventoryAfterSale(product_id, sold_PTM, quantity)

   let sale = await models.Sale.build({

      product_id: product_id,
      product_number: product_number,
      product_name: product_name,
      product_category: product_category,
      price_per_unit: price_per_unit,
      quantity: quantity,
      total_price: total_price,
      sold_to: sold_to,
      date_sold: date_sold,
      discount: discount,
      tax: tax,
      shipping: shipping,
      total_sales: 0,
      sold_PTM: sold_PTM

   })
   // Saving product object to the Product Database
   sale.save().then((savedProduct) => {
      res.status(200).json({ success: true, savedProduct: savedProduct });
   })
})

// update sale
router.put("/:id/updateASale", async (req, res) => {
   const id = parseInt(req.params.id)
   const product_id = parseInt(req.body.updated.product_id)
   const product_number = req.body.updated.product_number
   const product_name = req.body.updated.product_name
   const product_category = req.body.updated.product_category
   const price_per_unit = req.body.updated.price_per_unit
   const quantity = parseInt(req.body.updated.quantity)
   const total_price = req.body.updated.total_price
   const sold_to = req.body.updated.sold_to
   const sold_PTM = req.body.updated.sold_PTM
   const discount = req.body.updated.discount
   const tax = req.body.updated.tax
   const shipping = req.body.updated.shipping
   const date_sold = req.body.updated.date_sold

   const original_quantity = parseInt(req.body.original.quantity)
   const original_sold_PTM = req.body.original.sold_PTM

   if (quantity != original_quantity || sold_PTM != original_sold_PTM) {
      functions.adjustInventoryAfterEdit(product_id, quantity, sold_PTM, original_quantity, original_sold_PTM)
   } else {
      console.log("no change to inventory")
   }

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
         date_sold: date_sold,
         discount: discount,
         tax: tax,
         shipping: shipping,
         sold_PTM: sold_PTM
      },
      {
         where: {
            id: id,
         },
      }
   ).then((updatedSale) => {
      res.status(200).json({ success: true, updatedSale: updatedSale })
   }).catch(() => {
      res.status(500).json({ success: false })
   })
})

// delete a sale
router.delete("/:id/deleteASale", (req, res) => {
   const id = req.params.id
   const product_id = req.body.product_id
   const sold_PTM = req.body.sold_PTM
   const quantity = req.body.quantity

   functions.adjustInventoryAfterDelete(product_id, sold_PTM, quantity)

   models.Sale.destroy({
      where: {
         id: id,
      },
   }).then(() => {
      res.status(200).json({ success: true, updatedSale: id })
   }).catch(() => {
      res.status(500).json({ success: false })
   })
})


module.exports = router
