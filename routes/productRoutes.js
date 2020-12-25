const express = require("express");
const router = express.Router();
const models = require("../models");



router.get("/products", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
  });
});

router.post('/products', (req,res) => {

    const product_name = req.body.product_name
    const product_number = req.body.product_number
    const labor = req.body.labor
    const wholesale = req.body.wholesale
    const retail_price = req.body.retail_price
    const quantity = req.body.quantity
    const category = req.body.category
    
    //Building product object:
    
    let product = models.Product.build ({
        product_name: product_name,
        product_number: product_number,
        labor: labor,
        wholesale: wholesale,
        retail_price: retail_price,
        quantity: quantity,
        category: category    
    })
    // Saving product object to the Product Database
    product.save().then((savedProduct) => {
      res.status(200).json({ success: true, savedProduct: savedProduct });
    })
})

router.get("/delete-product", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
});
});

router.delete('/delete-product',(req,res) => {
  const id = req.body.id

  models.Product.destroy ({
      where: {
          id: id
      }
  }).then(() => {
      res.status(200).json({ success: true, deletedProduct: id });
  })
})

router.get("/edit-product", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
});
});

router.patch('/edit-product', (req,res) => {
  const id = req.body.id

  const product_name = req.body.product_name
  const product_number = req.body.product_number
  const labor = req.body.labor
  const wholesale = req.body.wholesale
  const cost_plus_markup = req.body.cost_plus_markup
  const retail_price = req.body.retail_price
  const quantity = req.body.quantity
  const category = req.body.category


  models.Product.update({
    product_name: product_name,
    product_number: product_number,
    labor: labor,
    wholesale: wholesale,
    cost_plus_markup: cost_plus_markup,
    retail_price: retail_price,
    quantity: quantity,
    category: category 
  }, {
      where: {
          id: id
      }
  }).then(() => {
      res.status(200).json({ success: true, updatedProduct: id });
  })

})


module.exports = router;