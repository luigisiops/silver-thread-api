const express = require("express");
const router = express.Router();
const models = require("../models");



router.get("/materials", (req, res) => {
  models.Material.findAll().then((materials) => {
    res.status(200).json(materials);
});
});

router.post('/materials', (req,res) => {

    const material_name = req.body.material_name
    const vendor = req.body.vendor
    const vendor_material_id = req.body.vendor_material_id
    const unit = req.body.unit
    const unit_price = req.body.unit_price
    const category = req.body.category
    
    //Building material object:
    
    let material = models.Material.build ({
        material_name: material_name,
        vendor: vendor,
        vendor_material_id: vendor_material_id,
        unit: unit,
        unit_price: unit_price,
        category: category    
    })
    // Saving material object to the Material Database
    material.save().then((savedMaterial) => {              
        res.status(200).json(savedMaterial);
    })
})

router.delete('/delete-material',(req,res) => {
    const id = req.body.id
    console.log(id)

    models.Material.destroy ({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({ success: true, deletedMaterial: id });
    })
})

// router.get("/edit-material", (req, res) => {
//     models.Material.findAll().then((materials) => {
//       res.status(200).json(materials);
//   });
//   });

router.patch('/edit-material', (req,res) => {
    const id = req.body.id

    const material_name = req.body.material_name
    const vendor = req.body.vendor
    const vendor_material_id = req.body.vendor_material_id
    const unit = req.body.unit
    const unit_price = req.body.unit_price
    const category = req.body.category

    models.Material.update({
        material_name: material_name,
        vendor: vendor,
        vendor_material_id: vendor_material_id,
        unit: unit,
        unit_price: unit_price,
        category: category 
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({ success: true, updatedMaterial: id });
    })

})

module.exports = router;