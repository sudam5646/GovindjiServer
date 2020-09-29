
var mongoose = require('mongoose'); 
  
var itemSchema = new mongoose.Schema({ 
    image : {type : Object},
    name: { type: String } , 
    description: { type: String }, 
    price : { type: String },
    quantity : { type: String },

}); 
   
  
module.exports = new mongoose.model('item', itemSchema, 'items'); 