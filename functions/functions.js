const models = require("../models");

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

//when deleting a product this will remove the associated materials from the material by product number table
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

//when deleting materials this will remove the material from the material by product number table
const deleteMaterialFromProducts = async (id) => {
    let material_id = id

    await models.MaterialByProdNums.destroy({
        where: {
            material_id: material_id
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//this will calculate the labor portion of the wholesale cost
const calculateLaborCost = (labor) => {

    //Calc labor per minute by diving $25 per hour by 60 minutes
    let RatePerMinute = (25 / 60)

    let laborCost = (labor * RatePerMinute)

    //client would like a minimum of $3 cost for all products
    if (laborCost <= 3) {
        let laborMin = (3)
        return laborMin
    } else {
        return laborCost
    }

}

const calculateWholesaleCosts = (labor, materialList) => {

    let laborCost = calculateLaborCost(labor)

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
        let laborMarkup = (laborCost * 1.1).toFixed(2)
        return laborMarkup     
    }

}


const updateWholesaleCost = (labor, materialList) => {

    let laborCost = calculateLaborCost(labor)

    if (materialList.length >= 1) {

        //get list of extended costs & add together
        let materialPriceList = materialList.map(item => {
            return (item.material_cost * item.material_unit_amount)
        })

        let totalMaterialCost = materialPriceList.reduce((total, amount) => total + amount)

        //double material costs for pricing & add to labor
        let costs = ((totalMaterialCost * 2) + laborCost)

        //markup by 10% for utilities - rounded to .00
        let totalWholesaleCosts = (costs * 1.1).toFixed(2)

        return totalWholesaleCosts

    } else {
        let laborMarkup = (laborCost * 1.1).toFixed(2)
        return laborMarkup
    }
}


module.exports = { addToMaterialsByProductNumber, calculateWholesaleCosts, updateWholesaleCost, deleteMaterialByProductNum, deleteMaterialFromProducts }  