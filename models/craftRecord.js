
var mongoose = require('mongoose'); 
  
var itemSchema = new mongoose.Schema({ 
    servicekey : {type : String},
    record: [
        {
            _id : String
        }
    ]
}); 
  
  
module.exports = new mongoose.model('craftRecord', itemSchema, 'craftRecords'); 
