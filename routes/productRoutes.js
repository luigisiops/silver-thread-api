const express = require("express");
const router = express.Router();
//const models = require("../models");
const functions = require('../functions/functions')

router.get("/products", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
  });
});


router.post('/products', async (req, res) => {

  const product_name = req.body.product_name
  const product_num = req.body.product_num
  const labor = req.body.labor
  const category = req.body.category
  const materialList = req.body.materials
  const quantity = 0
  const quantity_painted_tree = 0
  const retail_price = 0

  const wholesale = await functions.calculateWholesaleCosts(labor, materialList)

  //Building product object:
  let product = models.Product.build({
    product_name: product_name,
    product_num: product_num,
    labor: labor,
    wholesale: wholesale,
    category: category,
    quantity: quantity,
    quantity_painted_tree: quantity_painted_tree,
    retail_price: retail_price
  })
  // Saving product object to the Product Database
  product.save().then((savedProduct) => {
    let product_id = savedProduct.dataValues.id

    //update materials by product num
    functions.addToMaterialsByProductNumber(product_id, materialList)

    //return saved product information
    res.status(200).json({ success: true, savedProduct: savedProduct });
  })
})

router.delete('/delete-product', async (req, res) => {
  const id = req.body.id

  await functions.deleteMaterialByProductNum(id)

  await models.Product.destroy({
    where: {
      id: id
    }
  }).then(() => {
    res.status(200).json({ success: true, deletedProduct: id });
  }).catch(() => {
    res.status(500).json({ success: false, message: 'error deleting product' })
  })
})

router.patch('/update-wholesale', async (req, res) => {
  const id = req.body.id
  const labor = req.body.labor
  const materialList = req.body.MaterialByProdNums

  const product_name = req.body.product_name
  const product_num = req.body.product_num
  const retail_price = req.body.retail_price
  const quantity = req.body.quantity
  const category = req.body.category
  const quantity_painted_tree = req.body.quantity_painted_tree

 const wholesale = await functions.updateWholesaleCost(labor, materialList)

  await models.Product.update({
    product_name: product_name,
    product_num: product_num,
    labor: labor,
    wholesale: wholesale,
    retail_price: retail_price,
    quantity: quantity,
    quantity_painted_tree: quantity_painted_tree,
    category: category
  }, {
    where: {
      id: id
    }
  }).then(() => {
    res.status(200).json({ success: true, updatedProduct: wholesale });
  }).catch(() => {
    res.status(500).json({ success: false })
  })

})


router.patch('/edit-product', async (req, res) => {
  const id = req.body.id

  const product_name = req.body.product_name
  const product_num = req.body.product_num
  const labor = req.body.labor
  const wholesale = req.body.wholesale
  const retail_price = req.body.retail_price
  const quantity = req.body.quantity
  const category = req.body.category
  const quantity_painted_tree = req.body.quantity_painted_tree

  await models.Product.update({
    product_name: product_name,
    product_num: product_num,
    labor: labor,
    wholesale: wholesale,
    retail_price: retail_price,
    quantity: quantity,
    quantity_painted_tree: quantity_painted_tree,
    category: category
  }, {
    where: {
      id: id
    }
  }).then((updatedProduct) => {
    res.status(200).json({ success: true, updatedProduct: updatedProduct });
  }).catch(() => {
    res.status(500).json({ success: false});
  })

})


router.get("/edit-product/:id", async (req, res) => {
  const product_id = parseInt(req.params.id)

  await models.Product.findOne({
    where: {
      'id': product_id
    },
    include: [{
      model: models.MaterialByProdNums,
      required: false,
      where: {
        'product_id': product_id
      }
    }]
  }).then((productListing) => {
    res.status(200).json(productListing);
  }).catch(() => {
    res.status(500).json({ success: false});
  })


});


module.exports = router;