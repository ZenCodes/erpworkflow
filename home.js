/**
 * Created by praba on 2/10/2016.
 */

var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Method call to read credential information to establish the database connection
var readcredential = require("./app/scripts/dboperations.js");
readcredential.FnReadCredentials();

//Lodaing static files like elements from app folder
app.use(express.static('app'));

//Receiving get request from index.html to render the home page of the application
app.get('/' ,function (req, res) {
  res.sendFile( "app/index.html" );
});

//Receiving post request from login card
app.post('/login-card', urlencodedParser, function (req, res) {
  //Loading JS file to call the login check function
  var logincall = require("./app/scripts/dboperations.js");
  //calling loginchcek function with connection,username and password to validate the user,here defined callback method to get the asynchronous response
  logincall.FnLoginDBCheck("login-card",req.body.username,req.body.password,function(returnval){
    if(returnval!="invalid")
    //Sending positive response(role name) back to the login card if it is valid user
      res.status(200).json({'returnval': returnval});
    else
    //Sending error response
      res.status(200).json({'returnval': "invalid"});
  });
});

app.post('/inwardregnoseq-service',urlencodedParser, function (req, res) {
/*Getting data from the vehicle page*/
  response = {
    Vehicle_Number:req.query.vehno,
    Vehicle_Name:req.query.vehname,
    Driver_Numebr:req.query.drivername,
    Driver_Name:req.query.driverno,
    Inward_Bill_Number:req.query.invoiceno,
    Inward_Register_Date:req.query.invoicedate
  };
  cond={Inward_Bill_Number:req.query.invoiceno};
  //console.log(JSON.stringify(response));
  //Loading JS file to call seq generation
  var FnInwardRegNoGenerationcall = require("./app/scripts/dboperations.js");
  /*Function call to generate sequence*/
  FnInwardRegNoGenerationcall.FnInwardRegNoGeneration("inwardregnoseq-service",response,cond,function(returnval){
    if(returnval=="succ")
    //Sending positive response seq created
      res.status(200).json({'returnval': "succ"});
    //sending flag which ensures if inward reg no already exists
    else if(returnval=="exists")
      res.status(200).json({'returnval': "exists"});
    //Sending error response
    else
      res.status(200).json({'returnval': "fail"});
  });

});
app.post('/itemsave-service',urlencodedParser, function (req, res) {
  /*receiving values from item page*/
  console.log(req.query.qtymeasure);
  console.log(req.query.unitmeasure);
  response = {
    Inward_Bill_Number:req.query.invoiceno,
    Inward_Register_Date:req.query.invoicedate,
    Supplier_ID:req.query.supplier,
    Product_ID:req.query.itemdes,
    Qty_Received:req.query.qtyreceived,
    Qty_Accepted:req.query.qtyreceived,
    unit:req.query.unit,
    Unit_Accepted:req.query.unit,
    Qty_measure:req.query.qtymeasure,
    Unit_measure:req.query.unitmeasure,
    Remarks:req.query.remark,
    new_Inward_Register_Number:'',
    state: 'Stores'
  };
  //importing js file to invoke the function
  var FnRegisterInwardItemDetailcall = require("./app/scripts/dboperations.js");
  //Invoking function to insert item data into the table
  FnRegisterInwardItemDetailcall.FnRegisterInwardItemDetail("itemsave-service",response,function(returnval){
    if(returnval!="not okay")
    //Sending positive response inward regno to the user
      res.status(200).json({'inwardregno': returnval});
    else
    //sending error resonse
      res.status(200).json({'inwardregno': returnval});
  });

});

//Function to fetch items in the respective states,according to the logged user role
app.post("/forwardflowitem-service",urlencodedParser,function(req,res){
  cond={state:req.query.status};
  //importing js file to invoke the function
  var FnForwardflowfetchcall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch IRN information under respective states
  FnForwardflowfetchcall.FnForwardFlowitemFetch("forwardflowitem-service",cond,function(returnval){
    //Response sending back to the respective page
    res.status(200).json(returnval);
  });
});


//Fetching items under particularIRN number which expanded by the user
app.post("/physicqualify-card",urlencodedParser,function(req,res){
  //console.log("In physic qualify service"+req.query.status);
  cond={new_Inward_Register_Number:req.query.inwardregno}
  cond1={state:req.query.status};
  //importing js file to invoke the function
  var FnExpandItemDetailcall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch the items data under particular IRN
  FnExpandItemDetailcall.FnExpanditemFetch("physicqualify-card",cond,cond1,function(returnval){
    //Response Sending back to the service componet
    res.status(200).json(returnval);
  });
});

//Function to update the specific item under particular IRN number when they made any change in quantity,remarks etc
app.post("/physicqualifyitem-card",urlencodedParser,function(req,res){
  cond1={
    new_Inward_Register_Number:req.body.inwardno}
  cond2={
    Supplier_ID:req.body.suppliername}
  cond3={
    Product_ID:req.body.itemdes}
  cond4={
    state:req.body.status}
  cond5={
    state:req.body.newstatus}
  newstatus=req.body.newstatus;
  val1={Unit_Accepted:req.body.containeraccepted};
  val2={Qty_Accepted:req.body.qtyaccepted};
  val3={Remarks:req.body.remark};
  val4={PO_Number:req.body.ponumber};
  val5={PO_Date:req.body.podate};

  var FnPhysicqualifyitemcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  FnPhysicqualifyitemcall.FnPhysicqualifyitem("physicqualifyitem-card",cond1,cond2,cond3,cond4,cond5,newstatus,val1,val2,val3,val4,val5,function(returnval){
    if(returnval=="updated")
    res.status(200).json({"flag":returnval});
    else if(returnval=="not updated")
    res.status(200).json({"flag":returnval});
  });

});


//Function calls when the user performing flow accept
app.post("/physicqualified-service",urlencodedParser,function(req,res){
  console.log("In physic update...."+req.query.inwardnumber+"  "+req.query.checkstatus+"  "+req.query.status);
  cond1={new_Inward_Register_Number:req.query.inwardnumber};
  cond2={state:req.query.checkstatus};
  cond3={state:"Old"+req.query.checkstatus};
  var updatestatus="Old"+req.query.checkstatus;
  //console.log(cond3);
  var qtyupdatestatus={state:req.query.checkstatus};
  val={state:req.query.status};
  updateflag=req.query.updateflag;
  var ponumber={"PO_Number":req.query.ponumber};

  var FnPhysicqualifiedServicecall = require("./app/scripts/dboperations.js");
  //Function which send non updated items to the service
  FnPhysicqualifiedServicecall.FnPhysicqualifiedService("physicqualified-service",cond1,cond2,cond3,updatestatus,qtyupdatestatus,val,updateflag,ponumber,function(returnval){
      res.status(200).json(returnval);
  });
});

//Before moving from one state to another state it will copy all the items to the old state
app.post("/physicinsertupdate-service",urlencodedParser,function(req,res){
  //console.log('inside'+req.query.inwardno);
  response = {
    Inward_Bill_Number:req.query.inwardno,
    Inward_Register_Date:req.query.inwarddate,
    PO_Number:req.query.ponumber,
    PO_Date:req.query.podate,
    Supplier_ID:req.query.supname,
    Product_ID:req.query.itemdes,
    Qty_Received:req.query.qtyreceived,
    Qty_Accepted:req.query.qtyaccepted,
    unit:req.query.containerreceived,
    Unit_Accepted:req.query.containeraccepted,
    Qty_measure:req.query.qtymeasure,
    Unit_measure:req.query.contmeasure,
    Remarks:req.query.remarks,
    new_Inward_Register_Number:req.query.inwardregno,
    state:req.query.state
  };
  var FnPhysicinsertupdatecall = require("./app/scripts/dboperations.js");
  //Function which send non updated item info
  FnPhysicinsertupdatecall.FnPhysicinsertupdate("physicinsertupdate-service",response,function(returnval){
  //Function which send response flag with inward no to the respective service
    res.status(200).json({"flag":returnval.flag,"inwardno":returnval.inwardno});
  });
});

//Function which updates item state from one flow to next level of flow state
app.post("/flowstateupdate-service",urlencodedParser,function(req,res){
  cond1={state:req.query.checkstatus};
  cond2={new_Inward_Register_Number:req.query.inwardnumber};
  val={state:req.query.status};
  retstatus=req.query.status;
  var FnFlowstateupdatecall = require("./app/scripts/dboperations.js");
  //Function call to update the flow state
  FnFlowstateupdatecall.FnFlowstateupdate("flowstateupdate-service",cond1,cond2,val,retstatus,function(returnval){
    console.log();
    res.status(200).json({"flag":returnval.flag,"state":returnval.state});
  });
});
//Function which read the item info after performed flowstate update
app.post("/backwardflowitem-service",urlencodedParser,function(req,res){
  //console.log('grn service...'+req.query.status);
  cond={state:req.query.status};
  cond1={new_Inward_Register_Number:req.query.inwardregno};
  var FnBackwardflowitemcall = require("./app/scripts/dboperations.js");
  //Invoking function to read the item info
  FnBackwardflowitemcall.FnBackwardflowitem("backwardflowitem-service",cond,cond1,function(returnval){
    res.status(200).json(returnval);
  });
});

//Function to generate seq for outward items
app.post('/outwardseq-service',urlencodedParser, function (req, res) {
  cond={"Invoice_No":req.query.invoiceno};
  var FnOutwardSeqcall = require("./app/scripts/dboperations.js");
  FnOutwardSeqcall.FnOutwardSeq("outwardseq-service",cond,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to store outward items
app.post('/outwarditem-service',urlencodedParser, function (req, res) {
  response = {
    Outward_Register_Number:'',
    Out_Date:req.query.outdate,
    Out_Time:req.query.outtime,
    Customer_Name:req.query.customername,
    Invoice_No:req.query.invoiceno,
    City:req.query.city,
    Vehicle_No:req.query.vehicleno,
    Transport_Name:req.query.transportname,
    Driver_Name:req.query.drivername,
    Driver_No:req.query.driverno,
    Owner_Name:req.query.ownername,
    Owner_Phone:req.query.ownerphone,
    Pan_No:req.query.panno,
    Product_ID:req.query.itemdes,
    Quantity:req.query.quantity,
    Weight:req.query.weight,
    state:'outward'
  };
  var FnOutwardItemSavecall = require("./app/scripts/dboperations.js");
  FnOutwardItemSavecall.FnOutwardItemSave("outwarditem-service",response,function(returnval){
    res.status(200).json({'outwardregno': returnval});
  });
});

app.post("/search-service",urlencodedParser,function(req,res){
  //console.log('SEARCH SERVICE');
  var rnflag;
  var invoiceflag;
  var itemflag;

  if(req.query.irnno!=""){
    if((req.query.irnno).indexOf('IRN')!=-1){
      rnflag="0";
      cond={new_Inward_Register_Number:req.query.irnno};
    }
    else if((req.query.irnno).indexOf('ORN')!=-1){
      cond={Outward_Register_Number:req.query.irnno};
      rnflag="1";
    }
    else {
      rnflag = "-1";
      //res.status(200).json({"rnflag":"no match"});
    }
  }
  // console.log(rnflag);
  if(req.query.invoiceno!=""){
    cond={Inward_Bill_Number:req.query.invoiceno};
    invoiceflag="1";
  }
  if(req.query.item!=""){
    cond={Product_ID:req.query.item};
    itemflag="1";
  }
  //if(rnflag!="0"||rnflag!="1"){
    //res.status(200).json({"rnflag":"no match"});
  //}
  //else {
    irn = {new_Inward_Register_Number: req.query.irnno};
    invoice = {Inward_Bill_Numbe: req.query.invoiceno};
    item = {Product_ID: req.query.item};
    state = {state: req.query.state};

    var FnSearchItemscall = require("./app/scripts/dboperations.js");
    FnSearchItemscall.FnSearchItems("search-service", rnflag, invoiceflag, itemflag, cond, function (returnval) {
      res.status(200).json({"itemarr": returnval.itemarr, "rnflag": returnval.rnflag});
    });
  //}
});

app.post("/searchexpand-card",urlencodedParser,function(req,res){
  //console.log("In physic qualify service"+req.query.status);
  cond={new_Inward_Register_Number:req.query.inwardregno}
  var FnSearchExpandItemFetchcall = require("./app/scripts/dboperations.js");
  FnSearchExpandItemFetchcall.FnSearchExpandItemFetch("searchexpand-card",cond,function(returnval){
    res.status(200).json({"itemarr":returnval.itemarr,"statecount":returnval.statecount,"state":returnval.state});
  });
});

app.post("/outwardsearchexpand-card",urlencodedParser,function(req,res){
  //console.log("In physic qualify service"+req.query.status);
  cond={Outward_Register_Number:req.query.inwardregno}
  var n=0;
  var state="";
  var temp="";

  var FnOutwardSearchExpandItemFetchcall = require("./app/scripts/dboperations.js");
  FnOutwardSearchExpandItemFetchcall.FnOutwardSearchExpandItemFetch("outwardsearchexpand-card",cond,function(returnval){
    res.status(200).json({"itemarr":returnval.itemarr});
  });
});

//Function to generate seq for outward items
app.post('/intentseq-service',urlencodedParser, function (req, res) {

  var FnIntentitemSeqcall = require("./app/scripts/dboperations.js");
  FnIntentitemSeqcall.FnIntentitemSeq("intentseq-service",function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to store outward items
app.post('/intentitemwrite-service',urlencodedParser, function (req, res) {
  //console.log('intet....');
  response = {
    Intent_Register_Number:'',
    Intent_Date:req.query.intentdate,
    Product_ID:req.query.itemdes,
    Specification:req.query.specification,
    unit:req.query.unit,
    Unit_Measure:req.query.unitmeasure,
    Quantity:req.query.qtyreceived,
    Quantity_Measure:req.query.qtymeasure,
    Remarks:req.query.remark,
    state:'intent'
  };
  var FnIntentItemWritecall = require("./app/scripts/dboperations.js");
  FnIntentItemWritecall.FnIntentItemWrite("intentitemwrite-service",response,function(returnval){
    res.status(200).json({'intentregno': returnval});
  });
});

app.post('/intentitemread-service',urlencodedParser, function (req, res) {
  var FnIntentItemReadcall = require("./app/scripts/dboperations.js");
  FnIntentItemReadcall.FnIntentItemRead("intentitemread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post("/intentitemexpand-card",urlencodedParser,function(req,res){
  //console.log("In physic qualify service"+req.query.status);
  cond={Intent_Register_Number:req.query.intentregno}

  var FnIntentExpandItemFetchcall = require("./app/scripts/dboperations.js");
  FnIntentExpandItemFetchcall.FnIntentExpandItemFetch("intentitemexpand-card",cond,function(returnval){
    res.status(200).json({"itemarr":returnval.itemarr});
  });
});

//Node server running port number
app.listen(4000);

