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
  const category = req.body.category
  const materialList = req.body.materials

  const wholesale = await calculateWholesaleCosts(labor, materialList)

  //Building product object:

  let product = models.Product.build({
    product_name: product_name,
    product_num: product_num,
    labor: labor,
    wholesale: wholesale,
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
  let RatePerMinute = (25 / 60)

  let laborCost = (labor * RatePerMinute)

  if (materialList.length >= 1) {

    //get list of extended costs
    let materialPriceList = materialList.map(item => {
      return (item.unit_price * item.material_unit_amount)
    })

    //add all material costs together
    let totalMaterialCost = materialPriceList.reduce((total, amount) => total + amount)

    //double material costs for pricing & add with labor
    let costs = ((totalMaterialCost * 2) + laborCost)

    //markup by 10% for utilities - rounded to .00
    let totalWholesaleCosts = (costs * 1.1).toFixed(2)

    return totalWholesaleCosts

  } else {
    //client would like a minimum of $3 labor cost for all products
    if (laborCost <= 3) {
      let laborMarkup = (3 * 1.1).toFixed(2)
      return laborMarkup
    } else {
      let laborMarkup = (laborCost * 1.1).toFixed(2)
      return laborMarkup
    }
  }

}


const addToMaterialsByProductNumber = (id, materials) => {

  //build materials object
  let addMaterials = materials.map(item => {
    return {
      product_id: parseInt(id),
      ProductId: parseInt(id),
      material_id: parseInt(item.material_id),
      MaterialId: parseInt(item.material_id),
      material_name: item.material_name,
      material_unit_amount: parseInt(item.material_unit_amount),
      material_cost: (item.unit_price)
    }
  })

  //add all to material by product number table
  models.MaterialByProdNums.bulkCreate(addMaterials, { returning: false })
    .then((savedAddMaterials) => {
      console.log('saved material by product')
    })

}


router.delete('/delete-product', async (req, res) => {
  const id = req.body.id

  await deleteMaterialByProductNum(id)

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

const deleteMaterialByProductNum = async (id) => {
  let product_id = id

  await models.MaterialByProdNums.destroy({
    where: {
      product_id: product_id
    }
  }).then(() => {
    return true
  }).catch(() => {
    return false
  })

}

//fix calcWholesale and use that function
const updateWholesaleCost = (labor, materialList) => {
  //Calc labor per minute by diving $25 per hour by 60 minutes
  let RatePerMinute = (25 / 60)

  let laborCost = (labor * RatePerMinute)

  if (materialList.length >= 1) {

    //get list of extended costs
    let materialPriceList = materialList.map(item => {
      return (item.material_cost * item.material_unit_amount)
    })

    //add all material costs together
    let totalMaterialCost = materialPriceList.reduce((total, amount) => total + amount)

    //double material costs for pricing & add with labor
    let costs = ((totalMaterialCost * 2) + laborCost)

    //markup by 10% for utilities - rounded to .00
    let totalWholesaleCosts = (costs * 1.1).toFixed(2)

    return totalWholesaleCosts

  } else {
    //client would like a minimum of $3 labor cost for all products
    if (laborCost <= 3) {
      let laborMarkup = (3 * 1.1).toFixed(2)
      return laborMarkup
    } else {
      let laborMarkup = (laborCost * 1.1).toFixed(2)
      return laborMarkup
    }
  }
}

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

 const wholesale = await updateWholesaleCost(labor, materialList)
  console.log(wholesale)

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
  }).then(() => {
    res.status(200).json({ success: true, updatedProduct: id });
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
  });

});


module.exports = router;