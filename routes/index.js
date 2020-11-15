const express = require('express');
const router = express.Router();
const conn = require('../server');

router.get('/', (req,res) => {
var sql = "SELECT  * FROM tbl_slideshow_home INNER JOIN tbl_product ON tbl_slideshow_home.product_id=tbl_product.product_id;";
  var sql2 = "SELECT  * FROM tbl_slideshow_home INNER JOIN tbl_product_img ON tbl_slideshow_home.img_id=tbl_product_img.img_id;"
  let query = conn.query(sql, (err, results)=>{
    if(err) throw err;
    let query2 = conn.query(sql2, (err, results2)=>{
      if(err) throw err;
      res.render('index',{ res_product_img: results2, res_product: results});
    });
  });
   
})

module.exports = router;