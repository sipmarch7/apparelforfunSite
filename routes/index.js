const express = require('express');
const router = express.Router();
const conn = require('../server');

router.get('/', (req,res) => {
  var sql = "SELECT * FROM tbl_product_img INNER JOIN tbl_product ON tbl_product.product_id=tbl_product_img.product_id WHERE slideshow=1;"
  let query = conn.query(sql, (err, results)=>{
    if(err) throw err;
    res.render('index',{ res_product_img: results });
  });
});

module.exports = router;