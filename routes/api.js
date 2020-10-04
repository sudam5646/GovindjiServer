const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { Buffer } = require('buffer');
const Item = require('../models/item');
const {itemValidation} = require('../models/validations')
const xlsx2json = require('xlsx2json');
const excelToJson = require('convert-excel-to-json');

//*************************Storing Image in upload folder*******************/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage
  });

  const storageExcel = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Excelfolder');
    },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, 'excelFile.xlsx');
    }
  });

  const uploadExcel = multer({
    storage: storageExcel
  });
  
//**************************************************************** */

//*************Get request for all items****************************/
router.get('/items',function(req,res){
    console.log('Get request for all items');
    Item.find({})
    .exec(function(err,item){
      console.log("1");
        if(err){
            console.log("Error retriving items");
            console.log("2");
        }else{
            res.json(item);
            console.log("3");
        }
        console.log("4");
    })
    console.log("5");
});
//*******************************************************************/

//**********Post request for a item**********************************/
router.post('/item', upload.single('image'),(req,res) =>{
  const {error} = itemValidation(req.body);
            if (error) {
                res.json({ success: false, message: "All field are required" }); // Return error
            }else{
                  console.log(req.file);
                  var img = fs.readFileSync(req.file.path);
                  var encode_image = img.toString('base64');

                  var finalImage = {
                                  contentType : req.file.mimetype,
                                  path : req.file.path,
                                  image : new Buffer.from(encode_image,'base64')
                                };

                  console.log("Post a item ", req.body);
                  res.contentType(finalImage.contentType);
                  var newitem = new Item({
                                  name : req.body.name,
                                  description : req.body.description,
                                  price : req.body.price,
                                  quantity : req.body.quantity,
                                  image : finalImage,
                                });
                  try{
                        const savedItem = newitem.save();
                        res.json(savedItem);
                      }catch(err){
                                  res.status(400).send(err);
                                }
            }
})
//**************************************************************** */
// router.post('/excelitem',uploadExcel.single('file'),(req,res)=>{
//   const result = excelToJson({
//     sourceFile: './Excelfolder/excelFile.xlsx',
//     columnToKey: {
//       A: 'name',
//       B: 'description',
//       C: 'price',
//       D: 'quantity',
//       E: 'image'
//   }
// });
// result1 = [];
// finalResult = [];
// result1 = result['Sheet1']
// result1.forEach(element => {
//   if(element.name != 'name'){
//     finalResult.push(element);
//   }
// });
// console.log(finalResult)
// res.send(finalResult);
// })

//*************************Update request for a item***************/
router.put('/item/:id', upload.single('image'),function(req,res){
  console.log("Update a item");
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');

  var finalImage = {
    contentType : req.file.mimetype,
    path : req.file.path,
    image : new Buffer.from(encode_image,'base64')
  };
  Item.findByIdAndUpdate(req.params.id,
      {
          $set: { name : req.body.name,
            description : req.body.description,
            price : req.body.price,
            quantity : req.body.quantity,
            image : finalImage }
      },
          {
              new : true
          },
          function(err,updatedItem) {
              if(err) {
                  res.send("Error updating item");
              }else{
                  res.json(updatedItem);
              }
          
      });
});
//****************************************************************/

//******Get request for a item by its id**************************/
router.get('/item/:id',function(req,res){
  console.log('Get request one single item');
  Item.findById(req.params.id)
  .exec(function(err,item){
      if(err){
          console.log("Error retriving item");
      }else{
          res.json(item);
      }
  })
});
//************************************************************** */
module.exports = router;

