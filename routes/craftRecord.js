const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CraftRecord = require('../models/craftRecord');
const {craftValidation} = require('../models/validations')

//******************** */
mongoose.Promise = global.Promise;
//****Get request for all users there orders and craftRecords*****/
router.get('/users',function(req,res){
    console.log('Get request for all items');
    CraftRecord.find({})
    .exec(function(err,craftrecords){
        if(err){
            console.log("Error retriving items");
        }else{
            res.json(craftrecords);
        }
    })
});
//************************************************************* */

//*********Get request for single user and its record by ServiceKey*/
router.get('/user/:servicekey',function(req,res){
    console.log('Get request for one single User by servicekey');
    CraftRecord.findOne({servicekey:req.params.servicekey})
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

//****Put request for addToCart************************************/
router.put('/addtocart/:servicekey',async function(req,res){
    const {error} = craftValidation(req.body);
            if (error) {
                res.json({ success: false, message: "All field are required" }); // Return error
            }else{
                console.log("Update a user");
    console.log(req.body.servicekey);
    CraftRecord.findOne({servicekey : req.body.servicekey}, async(err,user) => {
        if (err) {
                res.json({ success: false, message: err }); // Return error
        }else{
            if (!user) {
                        var newrecord = [];
                        console.log("stringify run");
                        newrecord.push(req.body.record);
                        console.log(req.body.record);
                    newCraftRecord = new CraftRecord({
                        servicekey : req.body.servicekey,
                        record : newrecord
                    })
                    const saveduser = await newCraftRecord.save();
                    console.log('saveduser',saveduser);
                    res.json(saveduser);
            }else{
                var newrecord = user.record;
                newrecord.push(req.body.record);
                CraftRecord.findOneAndUpdate({servicekey:req.params.servicekey},
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
                                console.log(user.record[0].name);
                                res.json(user);
                            }
                    })
            }
        }
    })

            }
    })
//****************************************************************/

//****Put request for place the order*****************************/
router.put('/placeorder/:servicekey/:id',async function(req,res){
    const {error} = craftValidation(req.body);
            if (error) {
                res.json({ success: false, message: "All field are required" }); // Return error
            }else{
                console.log("Update a order record");
    CraftRecord.findOne({servicekey : req.body.servicekey}, async(err,user) => {
        if (err) {
            res.json({ success: false, message: err }); // Return error
    }else{
        if (!user) {  
            console.log("order 1"); 
            var newrecord = [];
            console.log("stringify run");
            newrecord.push(req.body.record);
            newrecord[0].orderFlag = 1;
            console.log(req.body.record);
            newCraftRecord = new CraftRecord({
                servicekey : req.body.servicekey,
                record : newrecord
            })
            const saveduser = await newCraftRecord.save();
            console.log('saveduser',saveduser);
            res.json(saveduser);
        }else{
            console.log("order 2");
            var newrecord = user.record;
            req.body.record.orderFlag = 1;
            newrecord.push(req.body.record);
            CraftRecord.findOneAndUpdate({servicekey:req.params.servicekey},
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
module.exports = router;
