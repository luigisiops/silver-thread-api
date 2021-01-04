const express = require("express")
const router = express.Router()
const models = require("../models")

router.post('/add-material', (req, res) => {   
   let product_id = req.body.product_id
   let material_unit_amount = req.body.material_unit_amount
   let material_id = req.body.material.id
   let material_name = req.body.material.material_name
   let material_cost = req.body.material.unit_price

   let material = models.MaterialByProdNums.build({
      product_id: product_id,
      ProductId: product_id,
      material_id: material_id,
      material_name: material_name,
      material_unit_amount: material_unit_amount,
      material_cost: material_cost

   })
   material.save().then((savedMaterial) => {
      res.status(200).json(savedMaterial);
   })
})

router.delete("/delete/:id", (req, res) => {
   let id = req.params.id

   models.MaterialByProdNums.destroy({
      where: {
         id: id
      }
   }).then(() => {
      res.status(200).json({ success: true, deletedProduct: id });
   }).catch(() => {
      res.status(500).json({ success: false, message: 'error deleting product' })
   })

})

module.exports = router
