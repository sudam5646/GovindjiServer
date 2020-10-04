
var mongoose = require('mongoose'); 
  
var itemSchema = new mongoose.Schema({ 
    servicekey : {type : String},
    record: [
        {
            _id : String,
            orderQuantity : String,
            itemDeleivered : Boolean,
            dateOfOrder : Date,
            dateOfDelevery : Date
        }
    ]
}); 
  
  
module.exports = new mongoose.model('orderRecord', itemSchema, 'orderRecords'); 
