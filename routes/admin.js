const express = require('express');
const router = express.Router();
const conn = require('../server');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

///image types accepted
const imageMimeTypes = ['image/jpeg','image/png'];
const uploadPath = path.join('public','/img/product');
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//// MAYBE DELETE?
const bodyParser = require('body-parser');
const { callbackPromise } = require('nodemailer/lib/shared');
router.use(bodyParser.urlencoded({ extended: true }));
///////////////

router.get('/', (req,res)=> {
    res.redirect('/');
});

//load page /productPhotos
router.get('/productPhotos', (req,res)=> {
    var sql = "SELECT * FROM tbl_product_img INNER JOIN tbl_product ON tbl_product_img.product_id=tbl_product.product_id;"
    var sql2 = "SELECT DISTINCT product_name FROM tbl_product;"
    var sql3 = "SELECT DISTINCT product_color FROM tbl_product;"
    let query = conn.query(sql, (err, images)=>{
        if (err) throw err;
        let query2 = conn.query(sql2, (err, products)=>{
            if (err) throw err;
            let query3 = conn.query(sql3, (err, colors)=>{
                if (err) throw err;
                res.render('productPhotos', {image: images, product: products, color: colors});
            });
        });
    });
});

//UPDATE the image selection to appear on tbl_product_img
router.post('/productPhotos/updateProductPhoto', (req,res)=>{
    let sql = "UPDATE tbl_product_img SET productImage='"+req.body.productImage+"', gallery='"+req.body.productGallery+"', slideshow='"+req.body.productSlideshow+"' WHERE img_id="+req.body.updateImage;
    let query = conn.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('../productPhotos');
    });
});

//DELETE photo from tbl_product_img AND file PENDING
router.post('/productPhotos/deleteProductPhoto', (req,res)=>{
    let sql0 = "SELECT img_loc FROM `tbl_product_img` WHERE img_id="+req.body.deleteImage;
    let query = conn.query(sql0, (err, results0)=>{
        if(err) throw err;
        var loc = results0[0].img_loc;
        loc = loc.replace("..","public");
        fs.unlink(loc, (err) => {if (err) throw err});
        let sql = "DELETE FROM tbl_product_img WHERE img_id="+req.body.deleteImage;
        let query = conn.query(sql, (err, results)=>{
            if(err) throw err;
            res.redirect('../productPhotos');
        });
    });
});

//ADD new photo to tbl_product_img AND file PENDING
router.post('/productPhotos/addProductPhoto', upload.single('photo'), (req,res)=>{
    // get product_id of that product and color compination from tbl_product
    if (req.file==null){
        res.redirect('../productPhotos');
    }else{
        var mimeType = req.file.mimetype.split('/');
        let imgType = mimeType[1];
        let sql0 = "SELECT product_id FROM `tbl_product` WHERE product_name='"+req.body.products+"' AND product_color='"+req.body.colors+"'";
        let query0 = conn.query(sql0, (err, id)=>{
            if(err) throw err;
            let product_id = id[0].product_id;
            // use that product_id to see how many images of that in tbl_product_img
            let sql1  = "SELECT COUNT(*) as count FROM tbl_product_img WHERE product_id="+product_id;
            let query1 = conn.query(sql1, (err, counts)=>{
                if(err) throw err;
                let img_count = counts[0].count;
                let img_loc = "../img/product/"+req.body.products+"_"+req.body.colors+"_"+img_count+"."+imgType;
                let sql2 = "INSERT INTO tbl_product_img (product_id, img_loc) VALUES ('"+product_id+"','"+img_loc+"')";
                let query2 = conn.query(sql2, (err, results)=>{
                    if(err) throw err;
                    console.log(req.file);
                    var oldFile = req.file.path;
                    var newFile = req.file.destination+"/"+req.body.products+"_"+req.body.colors+"_"+img_count+"."+imgType;
                    var rawData = fs.readFileSync(oldFile);
                    console.log(oldFile);
                    console.log(newFile);
                    console.log(rawData);
                    fs.writeFile(newFile, rawData, function(err){ 
                        if(err) console.log(err);
                    });
                    fs.unlink(oldFile, (err) => {if (err) throw err});
                    res.redirect('../productPhotos');
                });
            }); 
        }); 
    }
});

module.exports = router;
