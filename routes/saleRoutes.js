const express = require("express")
const router = express.Router()
const models = require("../models")
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
   let onsite_inv = parseInt(req.body.productDetails.quantity)
   let PTM_inv = parseInt(req.body.productDetails.quantity_painted_tree)


   let total_price = functions.calculateTotalPrice(quantity, price_per_unit, discount)
   let tax = (total_price * (tax_rate / 100)).toFixed(2)
   let total_sales = (total_price + tax + shipping)

   await functions.adjustInventoryAfterSale(product_id, sold_PTM, onsite_inv, PTM_inv, quantity)

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
      total_sales: total_sales

   })
   // Saving product object to the Product Database
   sale.save().then((savedProduct) => {
      res.status(200).json({ success: true, savedProduct: savedProduct });
   })
})

// update sale
router.put("/:id/updateASale", async (req, res) => {
   const id = parseInt(req.params.id)
   const product_id = parseInt(req.body.product_id)
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

   //calc

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
