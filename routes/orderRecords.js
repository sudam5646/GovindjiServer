const express = require('express');
const router = express.Router();
const OrderRecord = require('../models/orderRecords');
const {orderValidation} = require('../models/validations')

//****Get request for all users there orders*********************/
router.get('/users',function(req,res){
    console.log('Get request for all items');
    OrderRecord.find({})
    .exec(function(err,orderrecords){
        if(err){
            console.log("Error retriving items");
        }else{
            res.json(orderrecords);
        }
    })
});
//***************************************************************/

//*********Get request for single user and its record by ServiceKey*/
router.get('/user/:servicekey',function(req,res){
    console.log('Get request for one single User by servicekey');
    OrderRecord.findOne({servicekey:req.params.servicekey})
    .exec(function(err,user){
        if(err){
            console.log("Error retriving user");
        }else{
            res.json(user);
            console.log(user)
            }
    })
});
//******************************************************************/

//****Put request for item delevered********************************/
router.put('/orderdeleivered/:servicekey',async function(req,res){
    console.log("Item delevered");
    OrderRecord.findOne({servicekey : req.body.servicekey}, async(err,user) => {
        if (err) {
            res.json({ success: false, message: err }); // Return error
        }else{
            var newrecord = user.record;
            req.body.record.forEach(requestElement => {
                newrecord.forEach(databaseElement => {
                    if(requestElement._id == databaseElement._id){
                        databaseElement.itemDeleivered = true;
                        databaseElement.dateOfDelevery = Date();
                    }
                });
            });
            OrderRecord.findOneAndUpdate({servicekey:req.params.servicekey},
                {
                    $set: {
                        servicekey : req.body.servicekey,
                        record : this.newrecord
                    }
                },
                    {
                        new : true
                    },
                    function(err,updatedUser) {
                        console.log("order 3");
                        if(err) {
                            res.send("Error updating user");
                        }else{
                            console.log("4");
                            updatedUser = user;
                            updatedUser.save();
                            res.json(user);
                        }
                })
        
    }
    })

            
    })
//****************************************************************/

//****Put request for place the order*****************************/
router.put('/placeorder/:servicekey/:id',async function(req,res){
    const {error} = orderValidation(req.body);
            if (error) {
                res.json({ success: false, message: "All field are required" }); // Return error
            }else{
                console.log("Update a order record");
    OrderRecord.findOne({servicekey : req.body.servicekey}, async(err,user) => {
        if (err) {
            res.json({ success: false, message: err }); // Return error
    }else{
        if (!user) {  
            console.log("order 1"); 
            var newrecord = [];
            console.log("stringify run");
            req.body.record.dateOfOrder = Date();
            req.body.record.itemDeleivered = false;
            newrecord.push(req.body.record);
            console.log(req.body.record);
            newOrderRecord = new OrderRecord({
                servicekey : req.body.servicekey,
                record : newrecord
            })
            const saveduser = await newOrderRecord.save();
            console.log('saveduser',saveduser);
            res.json(saveduser);
        }else{
            console.log("order 2");
            var newrecord = user.record;
            req.body.record.dateOfOrder = Date();
            req.body.record.itemDeleivered = false;
            newrecord.push(req.body.record);
            OrderRecord.findOneAndUpdate({servicekey:req.params.servicekey},
                {
                    $set: {
                        servicekey : req.body.servicekey,
                        record : this.newrecord
                    }
                },
                    {
                        new : true
                    },
                    function(err,updatedUser) {
                        console.log("order 3");
                        if(err) {
                            res.send("Error updating user");
                        }else{
                            console.log("4");
                            updatedUser = user;
                            updatedUser.save();
                            res.json(user);
                        }
                })
        }
    }
    })

            }
    })
//****************************************************************/

//***************Delete request for cancel the order************/
router.delete('/cancelorder/:servicekey',function(req,res){
    console.log("Cancel the order");
    OrderRecord.findOne({servicekey : req.body.servicekey}, async(err,user) => {
        if (err) {
                res.json({ success: false, message: err }); // Return error
        }else{
            if (!user) {
                        res.send("user is not registered");
            }else{
                var newrecord = user.record;
                newrecord.forEach(element => {
                    if(element._id == req.body.record._id){
                        newrecord.pop(element);
                    }
                });
                OrderRecord.findOneAndUpdate({servicekey:req.params.servicekey},
                    {
                        $set: {
                            servicekey : req.body.servicekey,
                            record : this.newrecord
                        }
                    },
                        {
                            new : true
                        },
                        function(err,updatedUser) {
                            if(err) {
                                res.send("Error updating user");
                            }else{
                                updatedUser = user;
                                updatedUser.save();
                                res.json(user);
                            }
                    })
            }
        }
    })
});
//************************************************************* */

module.exports = router;
