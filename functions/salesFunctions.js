const models = require("../models");

const calculateTotalPrice = (quantity, price_per_unit, discount) => {
   
    if (discount > 0) {
       let total_price = (quantity * price_per_unit * (1 - (discount / 100))).toFixed(2)
       return total_price
    } else {
       let total_price = (quantity * price_per_unit).toFixed(2)
       return total_price
    }
 }

const adjustInventoryAfterSale = async (product_id, sold_PTM, onsite_inv, PTM_inv, quantity) => {

    if (sold_PTM) {
       let newPtmInv = (PTM_inv - quantity)    
       
       await models.Product.update({
          quantity_painted_tree: newPtmInv,         
        }, {
          where: {
            id: product_id
          }
        }).then((updatedProduct) => {
          console.log(updatedProduct)
        }) 
 
    } else {
       let newOnsiteInv = (onsite_inv - quantity)  
       
       await models.Product.update({
          quantity: newOnsiteInv,         
        }, {
          where: {
            id: product_id
          }
        }).then((updatedProduct) => {
          console.log(updatedProduct)
        }) 
    }
 }

 const adjustInventoryAfterDelete = async (product_id, sold_PTM, quantity) => {

  //get current inventory for product
  let product = await models.Product.findOne({
     where: {
        id: product_id
     }
  }).then((foundProduct) => {
     return foundProduct
  })

  console.log(product.dataValues)

  if (sold_PTM) {

     let newQuantity = (product.dataValues.quantity_painted_tree + quantity)
     //call function to update PTM inventory

  } else {

     let newQuantity = (product.dataValues.quantity + quantity)
     //call function to update Onsite Inventory

  }


}

 module.exports = { calculateTotalPrice, adjustInventoryAfterSale, adjustInventoryAfterDelete  }