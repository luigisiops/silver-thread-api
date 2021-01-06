const express = require("express");
const router = express.Router();
//const models = require("../models");
const functions = require('../functions/functions')

router.get("/materials", (req, res) => {
    models.Material.findAll().then((materials) => {
        res.status(200).json(materials);
    });
});

router.post('/materials', (req, res) => {

    const material_name = req.body.material_name
    const vendor = req.body.vendor
    const vendor_material_id = req.body.vendor_material_id
    const unit = req.body.unit
    const unit_price = req.body.unit_price
    const category = req.body.category

    //Building material object:

    let material = models.Material.build({
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
    }).catch(() => {
        res.status(500).json({success: false});
    })
})

router.delete('/delete-material', async (req, res) => {
    const id = req.body.id

    await functions.deleteMaterialFromProducts(id)

    models.Material.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({ success: true, deletedMaterial: id });
    }).catch(() => {
        res.status(500).json({ success: false, deletedMaterial: id });
    })
})

router.patch('/edit-material', (req, res) => {
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
    }).catch(() => {
        res.status(500).json({ success: false, updatedMaterial: id });
    })
})

module.exports = router;