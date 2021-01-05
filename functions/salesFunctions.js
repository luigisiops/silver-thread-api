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


const updatePtmInventory = async (inventoryAdj, product_id) => {   

   models.Product.increment(
      'quantity_painted_tree', { by: inventoryAdj, 
          where: { 
             id: product_id
            }
         }
         ).catch(() => {
            console.log('error adjusting number')
         })
}


const updateOnsiteInventory = async (inventoryAdj, product_id) => {
   models.Product.increment(
      'quantity', { by: inventoryAdj, 
          where: { 
             id: product_id
            }
         }
         ).catch(() => {
            console.log('error adjusting number')
         })
}


const adjustInventoryAfterSale = async (product_id, sold_PTM, onsite_inv, PTM_inv, quantity) => {

   //need to check for zero or null
   if (sold_PTM) {
      let inventoryAdj = (-quantity)
      await updatePtmInventory(inventoryAdj, product_id)

   } else {
      let inventoryAdj = (-quantity)
      await updateOnsiteInventory(inventoryAdj, product_id)
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

   if (product) {
      if (sold_PTM) {
         let inventoryAdj = quantity
         await updatePtmInventory(inventoryAdj, product_id)

      } else {

         let inventoryAdj = quantity
         await updateOnsiteInventory(inventoryAdj, product_id)
      }
   } else {
      console.log('product no longer exists')
   }
}

const adjustInventoryAfterEdit = async (product_id, quantity, sold_PTM, original_quantity, original_sold_PTM) => {

   //get current inventory for product
   let product = await models.Product.findOne({
      where: {
         id: product_id
      }
   }).then((foundProduct) => {
      return foundProduct
   })

   //if the product exists make the adjustments
   if (product) {
      if (sold_PTM != original_sold_PTM) {
         if (original_sold_PTM) {
            //if original sold PTM is true the origin sale was from PTM
            //add original_quantity to PTM
            //subtract quantity from onsite
            await updatePtmInventory(original_quantity, product_id)
            await updateOnsiteInventory((-quantity), product_id)

         } else {
            //if original sold PTM was false the origina sale was from onsiete
            //add original-quantity to onsite
            //subtract quantity from PTM
            await updatePtmInventory((-quantity), product_id)
            await updateOnsiteInventory(original_quantity, product_id)
         }

         
         //if sold at different locations 
         //add original_quantity to original_sold_PTM
         //subtract quantity from sold_PTM

      } else {
         if (sold_PTM) {
            //both sales were PTM - find difference and ajust PTM inventory
            let inventoryAdj = (quantity - original_quantity)
            await updatePtmInventory(inventoryAdj, product_id)

         } else {
            //quantity - original_quantity to get difference
            //adjust onsite inventory
            let inventoryAdj = (quantity - original_quantity)
            await updateOnsiteInventory(inventoryAdj, product_id)
         
         }
      }
   }  else {
      console.log('product no longer exists')
   }


}

module.exports = { calculateTotalPrice, adjustInventoryAfterSale, adjustInventoryAfterDelete, adjustInventoryAfterEdit }