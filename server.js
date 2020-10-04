const express = require('express');
const connectDB = require('./DB/connection');

const bodyParser = require('body-parser');
const path = require('path');
const port = (process.env.PORT || 5000);
// const cors = require('cors');
connectDB();

const api = require('./routes/api');
const CraftRecords = require('./routes/craftRecord');
const OrderRecords = require('./routes/orderRecords');
 
const app = express();

app.use(express.static(path.join(__dirname,'dist')));

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
// app.use(cors())
//mongoose.connect("mongodb+srv://sudamwagh:chhatrpati1630@cluster0.sr1oh.mongodb.net/Govindji?retryWrites=true&w=majority");
app.use('/api',api);
app.use('/craftrecords',CraftRecords);
app.use('/orderrecords',OrderRecords);

app.listen(port,function(){
    console.log('Server running on localhost : ' + port);
});
