const express = require("express");
const router = express.Router();
const models = require("../models");



router.get("/products", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
  });
});


router.post('/products', async (req, res) => {

  const product_name = req.body.product_name
  const product_num = req.body.product_num
  const labor = req.body.labor
  const retail_price = req.body.retail_price
  const quantity = req.body.quantity
  const category = req.body.category
  const materialList = req.body.materials

  const wholesale = await calculateWholesaleCosts(labor, materialList)

  //Building product object:

  let product = models.Product.build({
    product_name: product_name,
    product_num: product_num,
    labor: labor,
    wholesale: wholesale,
    retail_price: retail_price,
    quantity: quantity,
    category: category
  })
  // Saving product object to the Product Database
  product.save().then((savedProduct) => {
    let product_id = savedProduct.dataValues.id

    //update materials by product num
    addToMaterialsByProductNumber(product_id, materialList)

    //return saved product information
    res.status(200).json({ success: true, savedProduct: savedProduct });
  })
})

//Function to calculate wholesale cost
const calculateWholesaleCosts = (labor, materialList) => {
  //Calc labor per minute by diving $25 per hour by 60 minutes
  let laborPerMinute = (25 / 60)

  //labor in minutes (user input) * cost per minute
  let laborCost = (labor * laborPerMinute)

  if (materialList.length >= 1) {  

    //get list of extended costs
    let materialPriceList = materialList.map(item => {
      return (item.unit_price * item.material_unit_amount)
    })

    //add all material costs together
    let totalMaterialCost = materialPriceList.reduce((total, amount) => total + amount)

    //double material costs for pricing
    let materialMarkup = (totalMaterialCost * 2)

    let costs = (materialMarkup + laborCost)

    //markup by 10% for utilities - rounded to .00
    let totalWholesaleCosts = (costs * 1.1).toFixed(2)

    return totalWholesaleCosts
    
  } else {
    let laborMarkup = (laborCost * 1.1).toFixed(2)

    return laborMarkup
  }

}


const addToMaterialsByProductNumber = (id, materials) => {

  //build materials object
  let addMaterials = materials.map(item => {
    return {
      product_id: id,
      material_id: item.material_id,
      material_name: item.material_name,
      material_unit_amount: item.material_unit_amount,
      material_cost: (item.material_unit_amount * item.unit_price)
    }
  })

  //add all to material by product number table
  models.MaterialByProdNums.bulkCreate(addMaterials, { returning: true })
    .then((savedAddMaterials) => {
      console.log('saved material by product')
    })

}

router.get("/delete-product", (req, res) => {
  models.Product.findAll().then((products) => {
    res.status(200).json(products);
  });
});

router.delete('/delete-product', (req, res) => {
  const id = req.body.id

  models.Product.destroy({
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

router.patch('/edit-product', (req, res) => {
  const id = req.body.id

  const product_name = req.body.product_name
  const product_num = req.body.product_num
  const labor = req.body.labor
  const wholesale = req.body.wholesale
  const cost_plus_markup = req.body.cost_plus_markup
  const retail_price = req.body.retail_price
  const quantity = req.body.quantity
  const category = req.body.category


  models.Product.update({
    product_name: product_name,
    product_num: product_num,
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