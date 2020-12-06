const express = require('express');
const router = express.Router();
const conn = require('../server');

router.get('/', (req,res) => {
    var sql = "SELECT * FROM tbl_product_img INNER JOIN tbl_product ON tbl_product_img.product_id=tbl_product.product_id WHERE gallery=1;"
    let query = conn.query(sql, (err, results)=>{
        if (err) throw err;
        res.render('gallery', {product: results});
    });
});

module.exports = router;
