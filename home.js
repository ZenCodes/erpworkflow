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


var createfile = require("./app/scripts/dboperations.js");
createfile.FnCreateFile(app,express);

//Lodaing static files like elements from app folder
app.use(express.static('app'));

//Receiving get request from index.html to render the home page of the application
app.get('/' ,function (req, res) {
  res.sendFile( "app/index.html" );
});


app.post('/mailservice-service',urlencodedParser, function (req, res) {
  var Fnmailservicecall = require("./app/scripts/dboperations.js");
  Fnmailservicecall.Fnmailservice("mailservice-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
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


//Receiving request to read the logged username
app.post('/usernameread-service', urlencodedParser, function (req, res) {
  // console.log(req.query.loggeduserid);
  //Loading JS file to call the login check function
  var usernamereadcall = require("./app/scripts/dboperations.js");
  //calling loginchcek function with connection,username and password to validate the user,here defined callback method to get the asynchronous response
  usernamereadcall.Fnusernameread("usernameread-service",req.query.loggeduserid,function(returnval){
      res.status(200).json(returnval);
  });
});

//Method to fetch the items
app.post("/itemlist-service",urlencodedParser,function(req,res){
  //console.log('itemlist service...');
  var wardflag=req.query.wardflag;
  var itemid=req.query.itemid;
  //cond={state:req.query.status};
  var FnFetchItemlistcall= require("./app/scripts/dboperations.js");
  FnFetchItemlistcall.FnFetchItemlist("itemlist-service",wardflag,itemid,function(returnval){
      res.status(200).json({'itemarr': returnval});
  });
});

//Method to fetch the items
app.post("/intenttypelist-service",urlencodedParser,function(req,res){
  //console.log('itemlist service...');
  //var wardflag=req.query.wardflag;
  var loggeduser=req.query.loggeduser;
  //cond={state:req.query.status};
  var FnFetchIntenttypelistcall= require("./app/scripts/dboperations.js");
  FnFetchIntenttypelistcall.FnFetchIntenttypelist("intenttypelist-service",loggeduser,function(returnval){
      res.status(200).json({'itemarr': returnval});
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
  //console.log(req.query.qtymeasure);
  //console.log(req.query.unitmeasure);
  if(req.query.ponumber=="others")
  statevalue='Purchase';
  else
  statevalue='Stores';
  response = {
    //Purchase_Type:req.query.purchasetype,
    Purchase_Type:req.query.purchasetypeflag,
    PO_Date:req.query.podate,
    PO_Number:req.query.ponumber,
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
    Created_by:req.query.createdby,
    state: statevalue
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
  state=req.query.status;
  roleid=req.query.roleid;
  empid=req.query.empid;
  //importing js file to invoke the function
  var FnForwardflowfetchcall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch IRN information under respective states
  FnForwardflowfetchcall.FnForwardFlowitemFetch("forwardflowitem-service",state,roleid,empid,function(returnval){
    //Response sending back to the respective page
    res.status(200).json(returnval);
  });
});


//Fetching items under particularIRN number which expanded by the user
app.post("/physicqualify-card",urlencodedParser,function(req,res){
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


//Fetching items under particularIRN number which expanded by the user
app.post("/physicqualifyexpanditemread-service",urlencodedParser,function(req,res){
  //console.log('req coming...'+req.query.inwardregno);
  var cond={Inward_Register_Number:req.query.inwardregno}
  var status={status:req.query.status}
  //console.log('coming...........');
  //importing js file to invoke the function
  var Fnphysicqualifyexpanditemreadcall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch the items data under particular IRN
  Fnphysicqualifyexpanditemreadcall.Fnphysicqualifyexpanditemread("physicqualifyexpanditemread-service",cond,status,function(returnval){
    //Response Sending back to the service componet
    res.status(200).json(returnval);
  });
});

app.post("/physicqualifyitem-card",urlencodedParser,function(req,res) {

  var inspectionstatus;
  if(req.body.inspectionstatus=="1")
  inspectionstatus="Approved";
  else
  inspectionstatus="Rejected";

  var  response={
    Created_By:req.body.createdby,
    Serial_No:req.body.serialno,
    Inward_Register_Number:req.body.inwardregno,
    Product_ID:req.body.productid,
    PO_Number:req.body.ponumber,
    PO_Date:req.body.podate,
    Supplier_ID:req.body.suppliername,
    Container_ID:req.body.containerid,
    Heat_Number:req.body.heatno,
    Quantity:req.body.qtyaccept,
    Quantity_Measure:req.body.qtymeasure,
    Remarks:req.body.remark,
    status:req.body.updatestatus,
    Inspection_Status:inspectionstatus
  };

  // console.log(response);

  var cond1={Inward_Register_Number:req.body.inwardregno};
  var cond2={status:req.body.updatestatus};
  var cond3={PO_Number:req.body.ponumber};
  var cond4={new_Inward_Register_Number:req.body.inwardregno};
  var cond5={state:req.body.status};
  var cond6={Container_ID:req.body.containerid};
  var cond7={Serial_No:req.body.serialno};

  // console.log(JSON.stringify(cond1)+"  "+JSON.stringify(cond2)+"  "+JSON.stringify(cond3)+"  "+JSON.stringify(cond4)+"  "+JSON.stringify(cond5)+"  "+JSON.stringify(cond6)+"  "+JSON.stringify(cond7));

  var FnPhysicqualifyitemcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  FnPhysicqualifyitemcall.FnPhysicqualifyitem("physicqualifyitem-card",response,cond1,cond2,cond3,cond4,cond5,cond6,cond7,function(returnval){
    if(returnval=="updated")
      res.status(200).json({"flag":returnval});
    else if(returnval=="exist")
      res.status(200).json({"flag":returnval});
    else if(returnval=="not updated")
      res.status(200).json({"flag":returnval});
  });
});

//Fetching items under IRN to update coil state while promotion
app.post("/readcontainercoil-service",urlencodedParser,function(req,res){
  var cond1={Inward_Register_Number:req.query.inwardregno}
  var cond2={status:req.query.checkstatus}

  //importing js file to invoke the function
  var Fnreadcontainercoilcall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch the items data under particular IRN
  Fnreadcontainercoilcall.Fnreadcontainercoil("readcontainercoil-service",cond1,cond2,function(returnval){
    //Response Sending back to the service componet
    res.status(200).json(returnval);
  });
});

//Fetching items under IRN to update coil state while promotion
app.post("/oldcontainerupdate-service",urlencodedParser,function(req,res){
  //var updatestatus = {status:req.query.updatestatus};
  //var checkstatus = {status:req.query.checkstatus};
 var response= {
  Inward_Register_Number : req.query.Inward_Register_Number,
  Product_ID : req.query.Product_ID,
  PO_Number : req.query.PO_Number,
  PO_Date : req.query.PO_Date,
  Supplier_ID : req.query.Supplier_ID,
  Container_ID : req.query.Container_ID,
  Heat_Number : req.query.Heat_Number,
  Quantity : req.query.Quantity,
  Quantity_Measure : req.query.Quantity_Measure,
  Remarks : req.query.Remarks,
  status : req.query.status,
  Inspection_Status :req.query.Inspection_Status,
  Created_By: req.query.createdby
  }
  var inwardregno={Inward_Register_Number:req.query.Inward_Register_Number};
  //var newupdatestatus={status:"Old"+req.query.checkstatus};
  //importing js file to invoke the function
  var Fnoldcontainerupdatecall = require("./app/scripts/dboperations.js");
  //Invoking function to fetch the items data under particular IRN
  Fnoldcontainerupdatecall.Fnoldcontainerupdate("oldcontainerupdate-service",response,inwardregno,function(returnval){
    //Response Sending back to the service componet
    res.status(200).json(returnval);
  });
});

/*Function to check all the items id heat no filled or not*/

app.post("/physicqualifyinwardacceptcheck-service",urlencodedParser,function(req,res) {
var inwardregno=req.query.inwardregno;
var checkstatus=req.query.checkstatus;
var status=req.query.status;
var repeatflag=req.query.repeatflag;
  var Fnphysicqualifyinwardacceptcheckcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnphysicqualifyinwardacceptcheckcall.Fnphysicqualifyinwardacceptcheck("physicqualifyinwardacceptcheck-service",inwardregno,status,checkstatus,repeatflag,function(returnval){
    if(returnval=="succ")
      res.status(200).json({"flag":returnval});
    else if(returnval=="fail")
      res.status(200).json({"flag":returnval});
  });
});

app.post("/oldphysicinsert-service",urlencodedParser,function(req,res) {
  var inwardregno=req.query.inwardregno;
  var checkstatus=req.query.checkstatus;
  var status=req.query.status;
  var createdby=req.query.createdby;
  var Fnoldphysicinsertcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnoldphysicinsertcall.Fnoldphysicinsert("oldphysicinsert-service",inwardregno,checkstatus,status,createdby,function(returnval){
    if(returnval=="succ")
      res.status(200).json({"flag":returnval});
    else if(returnval=="fail")
      res.status(200).json({"flag":returnval});
  });
});

app.post("/physicqualified-service",urlencodedParser,function(req,res) {
  var inwardregno=req.query.inwardregno;
  var checkstatus=req.query.checkstatus;
  var status=req.query.status;
  var createdby=req.query.createdby;
  var Fnphysicqualifiedcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnphysicqualifiedcall.Fnphysicqualified("physicqualified-service",inwardregno,checkstatus,status,createdby,function(returnval){
    res.status(200).json({"flag":returnval.flag,"state":returnval.state});
  });
});

app.post("/specificationitemread-service",urlencodedParser,function(req,res) {
  var inwardregno=req.query.inwardregno;
  var checkstatus=req.query.checkstatus;
  var productid=req.query.productid;
  var Fnspecificationitemreadcall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnspecificationitemreadcall.Fnspecificationitemread("specificationitemread-service",inwardregno,checkstatus,productid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post("/updatequalityparameter-service",urlencodedParser,function(req,res) {
  var response={
    Test_ID:"",
    Inward_register_Number:req.query.inwardregno,
    Container_ID:req.query.containerid,
    Quality_Parameter_Name:req.query.name,
    Min_Value:req.query.minvalue,
    Max_Value:req.query.maxvalue,
    Actual_Value:req.query.actualvalue,
    Remarks:req.query.remarks,
    Test_Date:req.query.testdate,
    Unit_Measure:req.query.measure
  };
  // console.log(response);
  var Fnupdatequalityparametercall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnupdatequalityparametercall.Fnupdatequalityparameter("updatequalityparameter-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post("/qualityparametersequenceupdate-service",urlencodedParser,function(req,res) {
  var Fnqualityparametersequenceupdatecall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnqualityparametersequenceupdatecall.Fnqualityparametersequenceupdate("qualityparametersequenceupdate-service",function(returnval){
    res.status(200).json(returnval);
  });
});

app.post("/qualityparameterdisplay-service",urlencodedParser,function(req,res) {
  var cond1={Inward_Register_Number:req.query.inwardregno};
  var cond2={Container_ID:req.query.containerid};
  var Fnqualityparameterdisplaycall = require("./app/scripts/dboperations.js");
  //Invoking function to update the item info
  Fnqualityparameterdisplaycall.Fnqualityparameterdisplay("qualityparameterdisplay-service",cond1,cond2,function(returnval){
    res.status(200).json(returnval);
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
    Invoice_Date:req.query.invoicedate,
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
    Created_by:req.query.createdby,
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
  if(rnflag==-1){
    res.status(200).json({"rnflag":"no match"});
  }
  else {
    irn = {new_Inward_Register_Number: req.query.irnno};
    invoice = {Inward_Bill_Numbe: req.query.invoiceno};
    item = {Product_ID: req.query.item};
    state = {state: req.query.state};

    var FnSearchItemscall = require("./app/scripts/dboperations.js");
    FnSearchItemscall.FnSearchItems("search-service", rnflag, invoiceflag, itemflag, cond, function (returnval) {
      res.status(200).json({"itemarr": returnval.itemarr, "rnflag": returnval.rnflag,"inflag":returnval.inflag,"itemflag":returnval.itemflag});
    });
  }
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

   var loggeduser=req.query.loggeduser;
  var itemdes=req.query.itemdes;
  response = {
    Intent_Register_Number:'',
    Due_Date:req.query.duedate,
    Intent_Date:req.query.intentdate,
    Product_ID:req.query.itemdes,
    Specification:req.query.specification,
    unit:req.query.unit,
    Unit_Measure:req.query.unitmeasure,
    Quantity:req.query.qtyreceived,
    Quantity_Measure:req.query.qtymeasure,
    Remarks:req.query.remark,
    state:req.query.state,
    PO_Number:'',
    Intent_Created_By:req.query.loggedrole,
    Intent_Created_By_ID:req.query.createdby,
    Intent_Created_By_Date:req.query.createddate,
    Intent_State:'',
    Item_Type_ID:''
  };
  var FnIntentItemWritecall = require("./app/scripts/dboperations.js");
  FnIntentItemWritecall.FnIntentItemWrite("intentitemwrite-service",response,loggeduser,itemdes,function(returnval){
    res.status(200).json({'intentregno': returnval});
  });
});
//Function to fetch intent item info
app.post('/intentitemread-service',urlencodedParser, function (req, res) {
  var loggeduser=req.query.loggeduser;
  var loggedrole=req.query.loggedrole;
  var state=req.query.state;
  var FnIntentItemReadcall = require("./app/scripts/dboperations.js");
  FnIntentItemReadcall.FnIntentItemRead("intentitemread-service",loggeduser,loggedrole,state,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
//Function fetches the expanded intent item info
app.post("/intentitemexpand-card",urlencodedParser,function(req,res){
  cond={Intent_Register_Number:req.query.intentregno}
  cond1={Product_ID:req.query.itemdes}
  var FnIntentExpandItemFetchcall = require("./app/scripts/dboperations.js");
  FnIntentExpandItemFetchcall.FnIntentExpandItemFetch("intentitemexpand-card",cond,cond1,function(returnval){
    res.status(200).json({"itemarr":returnval.itemarr});
  });
});

//Function to promote intent state to the next level
app.post("/intentstateupdate-service",urlencodedParser,function(req,res){
  console.log(req.query.intentregno);
  cond={Intent_Register_Number:req.query.intentregno}
  cond1={Product_ID:req.query.itemdes}
  //ponumber={PO_Number:req.query.pono}
  //updatecolumn={Intent_State:req.query.updatestate};
  //updaterolecolumn={Intent_Approved_By:req.query.loggedrole};
  if(req.query.updatestate=="Approved"){
  updaterolecolumn={Intent_Approved_By:req.query.loggedrole};
  updatebycolumn={Intent_Approved_By_ID:req.query.createdby};
  updatebydate={Intent_Approved_By_Date:req.query.createddate};
  }
  if(req.query.updatestate=="Supplied"){
  updaterolecolumn={Intent_Supplied_By:req.query.loggedrole};
  updatebycolumn={Intent_Supplied_By_ID:req.query.createdby};
  updatebydate={Intent_Supplied_By_Date:req.query.createddate};
  }
  if(req.query.updatestate=="POCreated"){
  updaterolecolumn={PO_Created_By:req.query.loggedrole};
  updatebycolumn={PO_Created_By_ID:req.query.createdby};
  updatebydate={PO_Created_By_Date:req.query.createddate};
  }
  if(req.query.updatestate=="POSent"){
  updaterolecolumn={PO_Sent_By:req.query.loggedrole};
  updatebycolumn={PO_Sent_By_ID:req.query.createdby};
  updatebydate={PO_Sent_By_Date:req.query.createddate};
  }
  if(req.query.updatestate=="Accepted"){
  updaterolecolumn={Intent_Accepted_By:req.query.loggedrole};
  updatebycolumn={Intent_Accepted_By_ID:req.query.createdby};
  updatebydate={Intent_Accepted_By_Date:req.query.createddate};
  }  
  updatecolumn={Intent_State:req.query.updatestate};
  var Fnintentstateupdatecall = require("./app/scripts/dboperations.js");
  Fnintentstateupdatecall.FnIntentStateUpdate("intentstateupdate-service",cond,cond1,updatecolumn,updaterolecolumn,updatebycolumn,updatebydate,function(returnval){
    res.status(200).json(returnval);
  });
});

//Function to fetch intent item info
app.post('/intentsupplyitemread-service',urlencodedParser, function (req, res) {
  var loggeduser=req.query.loggeduser;
  var intentstate=req.query.intentstate;
  var state=req.query.state;
  var FnIntentSupplyItemReadcall = require("./app/scripts/dboperations.js");
  FnIntentSupplyItemReadcall.FnIntentSupplyItemRead("intentsupplyitemread-service",loggeduser,intentstate,state,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function for writing item info...req receives from admin service
app.post("/additem-service",urlencodedParser,function(req,res) {
//console.log(req.query.itemid);
  response = {
    //Item_Optional_Supplier_ID:req.query.itemoptionalsupplier,
    //Item_Supplier_ID:req.query.itemsupplier,
    Item_ID:req.query.itemid,
    Item_Name:req.query.itemname,
    Item_Description:req.query.itemdes,
    Container:req.query.container,
    UOM:req.query.quantity,
    Item_Group_ID:req.query.itemgroup,
    Item_Type_ID:req.query.itemtype,
    Store_Location_ID:req.query.storeslocation,
    Item_Purchase_Type_ID:req.query.itemflag
    //Purchase_Type_Flag:req.query.itemflag

  };
  //console.log(response);
  var FnAddItemWritecall = require("./app/scripts/dboperations.js");
  FnAddItemWritecall.FnAddItemWrite("additem-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});


//Function for writing item info...req receives from admin service
app.post("/additemsupplier-service",urlencodedParser,function(req,res) {

  response = {
    Item_Supplier_ID:req.query.supplierid,
    Item_ID:req.query.itemid,
    Item_Supplier_price:req.query.price

  };
  //console.log(response);
  var FnAddItemWritecall = require("./app/scripts/dboperations.js");
  FnAddItemWritecall.FnAddItemWriteSupplier("additemsupplier-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});


//Function for writing item info...req receives from admin service
app.post("/additemcustomer-service",urlencodedParser,function(req,res) {

  response = {
    Item_Customer_ID:req.query.supplierid,
    Item_ID:req.query.itemid

  };
  console.log(response);
  var FnAddItemCustomerWritecall = require("./app/scripts/dboperations.js");
  FnAddItemCustomerWritecall.FnAddItemWriteCustomer("additemcustomer-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to fetch item type info req receives from admin service
app.post('/additempurchasetype-service',urlencodedParser, function (req, res) {

  var FnAddItemPurchasetypecall = require("./app/scripts/dboperations.js");
  FnAddItemPurchasetypecall.FnAddItemPurchasetype("additempurchasetype-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
//Function to fetch item type info req receives from admin service
app.post('/additemread-service',urlencodedParser, function (req, res) {

  var FnAddItemReadcall = require("./app/scripts/dboperations.js");
  FnAddItemReadcall.FnAddItemRead("additemread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
//Function to fetch item group  info req receives from admin service
app.post('/additemgroupread-service',urlencodedParser, function (req, res) {

  var FnAddItemgroupReadcall = require("./app/scripts/dboperations.js");
  FnAddItemgroupReadcall.FnAddItemgroupRead("additemgroupread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch supplier info req receives from admin service
app.post('/itemsupplierread-service',urlencodedParser, function (req, res) {
  var itemid=req.query.itemid;
  var FnItemsupplierReadcall = require("./app/scripts/dboperations.js");
  FnItemsupplierReadcall.FnItemsupplierRead("itemsupplierread-service",itemid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch supplier info req receives from admin service
app.post('/containerread-service',urlencodedParser, function (req, res) {

  var FnContainerReadcall = require("./app/scripts/dboperations.js");
  FnContainerReadcall.FnContainerRead("containerread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch supplier info req receives from admin service
app.post('/unitread-service',urlencodedParser, function (req, res) {

  var FnUnitReadcall = require("./app/scripts/dboperations.js");
  FnUnitReadcall.FnUnitRead("unitread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/addsearchitem-service',urlencodedParser, function (req, res) {
  if(req.query.itemid!="")
  {
    cond={"Item_ID":req.query.itemid}
  }
  if(req.query.itemname!="")
  {
    cond={"Item_Name":req.query.itemname}
  }
  var items;
  var type;
  var FnAddsearchItemcall = require("./app/scripts/dboperations.js");
  FnAddsearchItemcall.FnAddsearchItem("addsearchitem-service",cond,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to update the item info req receives from the admin service
app.post("/additemupdate-service",urlencodedParser,function(req,res) {
    cond={"Item_ID":req.query.itemid}
  response = {
    //Item_Optional_Supplier_ID:req.query.itemoptionalsupplier,
    //Item_Supplier_ID:req.query.itemsupplier,
    //Purchase_Type_Flag:req.query.itemflag,
    Item_ID:req.query.itemid,
    Item_Name:req.query.itemname,
    Item_Description:req.query.itemdes,
    Container:req.query.container,
    UOM:req.query.quantity,
    Item_Group_ID:req.query.itemgroup,
    Item_Type_ID:req.query.itemtype,
    Store_Location_ID:req.query.storeslocation,
    Item_Purchase_Type_ID:req.query.itemflag

  };
  var FnAddItemUpdatecall = require("./app/scripts/dboperations.js");
  FnAddItemUpdatecall.FnAddItemUpdate("additemupdate-service",cond,response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/addsupplier-service",urlencodedParser,function(req,res) {

  response = {
    Supplier_ID: req.query.supplierid,
    Supplier_Name: req.query.suppliername,
    Alias_Name: req.query.aliasname,
    Address1: req.query.address1,
    Address2: req.query.address2,
    Doorno: req.query.doorno,
    Streetno: req.query.streetno,
    Street_Name: req.query.streetname,
    Location: req.query.location,
    City: req.query.city,
    District: req.query.district,
    State: req.query.state,
    Country: req.query.country,
    Pincode: req.query.pincode,
    Phoneno: req.query.phoneno,
    Mobileno: req.query.mobileno,
    Email: req.query.emailid,
    Faxno: req.query.faxno,
    Website: req.query.website,
    Status: 'New'

  };
  var FnAddSuppliercall = require("./app/scripts/dboperations.js");
  FnAddSuppliercall.FnAddSupplier("addsupplier-service", response, function (returnval) {
    res.status(200).json({'returnval': returnval.msg,'id':returnval.id});
  });

});

//Function to add the customer contac info
app.post("/supplieraddcontact-service",urlencodedParser,function(req,res) {
  response = {
    Supplier_ID:req.query.supplierid,
    Designation:req.query.designation,
    Mobile_No:req.query.mobileno,
    Email_ID:req.query.emailid
  };
  var Fnsupplieraddcontactcall = require("./app/scripts/dboperations.js");
  Fnsupplieraddcontactcall.Fnsupplieraddcontact("supplieraddcontact-service",response,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/supplierreadcontact-service",urlencodedParser,function(req,res) {
  supplierid = {
    Supplier_ID:req.query.supplierid
  };
  //console.log("In customer read...."+req.query.customerid);
  var Fnsupplierreadcontactcall = require("./app/scripts/dboperations.js");
  Fnsupplierreadcontactcall.Fnsupplierreadcontact("supplierreadcontact-service",supplierid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/suppliertaxadd-service",urlencodedParser,function(req,res) {
  response = {
    Supplier_ID:req.query.supplierid,
    TIN:req.query.tin,
    CST:req.query.cst,
    PAN:req.query.pan,
    TAN:req.query.tan,
    CIN:req.query.cin
  };
  var Fnsuppliertaxaddcall = require("./app/scripts/dboperations.js");
  Fnsuppliertaxaddcall.Fnsuppliertaxadd("suppliertaxadd-service",response,function(returnval){
    res.status(200).json({"returnval":returnval});
  });
});

//Function to add the customer contac info
app.post("/supplierexciseadd-service",urlencodedParser,function(req,res) {
  response = {
    Supplier_ID:req.query.supplierid,
    Reg_No:req.query.regno,
    Ecc_No:req.query.eccno,
    Range:req.query.range,
    Division:req.query.division,
    Commission:req.query.commission,
    Service_Tax:req.query.servicetax
  };
  var Fnsupplierexciseaddcall = require("./app/scripts/dboperations.js");
  Fnsupplierexciseaddcall.Fnsupplierexciseadd("supplierexciseadd-service",response,function(returnval){
    res.status(200).json({"returnval":returnval});
  });
});


//Function to update the supplier info req receives from the admin service
app.post("/addpayment-service",urlencodedParser,function(req,res) {

  response = {
    Supplier_ID:req.query.supplierid,
    Account_Name:req.query.accountname,
    Account_No:req.query.accountno,
    Account_Type:req.query.accounttype,
    Payment_Type:req.query.paymenttype,
    Bank_Name:req.query.bankname,
    Branch:req.query.branch,
    IFSC_Code:req.query.ifsccode,
    MICR_Code:req.query.micrcode,
    Swift_Code:req.query.swiftcode,
    Payment_Term:req.query.paymentterm

  };
  var FnAddPaymentcall = require("./app/scripts/dboperations.js");
  FnAddPaymentcall.FnAddPayment("addpayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });
});

//Function to add the customer contac info
app.post("/suppliertaxread-service",urlencodedParser,function(req,res) {
  supplierid = {
    Supplier_ID:req.query.supplierid
  };

  var Fnsuppliertaxreadcall = require("./app/scripts/dboperations.js");
  Fnsuppliertaxreadcall.Fnsuppliertaxread("suppliertaxread-service",supplierid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/supplierexciseread-service",urlencodedParser,function(req,res) {
  supplierid = {
    Supplier_ID:req.query.supplierid
  };
  var Fnsupplierexcisereadcall = require("./app/scripts/dboperations.js");
  Fnsupplierexcisereadcall.Fnsupplierexciseread("supplierexciseread-service",supplierid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});


//Function to update the supplier info req receives from the admin service
app.post("/updatesupplier-service",urlencodedParser,function(req,res) {

  response = {
    Supplier_ID:req.query.supplierid,
    Supplier_Name:req.query.suppliername,
    Alias_Name:req.query.aliasname,
    Address1:req.query.address1,
    Address2:req.query.address2,
    Doorno:req.query.doorno,
    Streetno:req.query.streetno,
    Street_Name:req.query.streetname,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phoneno:req.query.phoneno,
    Mobileno:req.query.mobileno,
    Email:req.query.emailid,
    Faxno:req.query.faxno,
    Website:req.query.website
  };
  //console.log(response);
  var FnUpdateSuppliercall = require("./app/scripts/dboperations.js");
  FnUpdateSuppliercall.FnUpdateSupplier("updateSupplier-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });


});

//Function to update the supplier info req receives from the admin service
app.post("/supplierupdatetax-service",urlencodedParser,function(req,res) {

  response = {
    Supplier_ID:req.query.supplierid,
    TIN:req.query.tin,
    CST:req.query.cst,
    PAN:req.query.pan,
    TAN:req.query.tan,
    CIN:req.query.cin
  };
  //console.log(response);
  var FnSupplierUpdatetaxcall = require("./app/scripts/dboperations.js");
  FnSupplierUpdatetaxcall.FnSupplierUpdatetax("supplierupdatetax-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/supplierupdateexcise-service",urlencodedParser,function(req,res) {
  response = {
    Supplier_ID:req.query.supplierid,
    Reg_No:req.query.regno,
    Ecc_No:req.query.eccno,
    Range:req.query.range,
    Division:req.query.division,
    Commission:req.query.commission,
    Service_Tax:req.query.servicetax
  };
  //console.log(response);
  var FnSupplierUpdateexcisecall = require("./app/scripts/dboperations.js");
  FnSupplierUpdateexcisecall.FnSupplierUpdateexcise("supplierupdateexcise-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatepayment-service",urlencodedParser,function(req,res) {
  response = {
    Supplier_ID:req.query.supplierid,
    Account_Name:req.query.accountname,
    Account_No:req.query.accountno,
    Account_Type:req.query.accounttype,
    Payment_Type:req.query.paymenttype,
    Bank_Name:req.query.bankname,
    Branch:req.query.branch,
    IFSC_Code:req.query.ifsccode,
    MICR_Code:req.query.micrcode,
    Swift_Code:req.query.swiftcode,
    Payment_Term:req.query.paymentterm
  };
  //console.log(response);
  //console.log(response);
  var FnUpdatePaymentcall = require("./app/scripts/dboperations.js");
  FnUpdatePaymentcall.FnUpdatePayment("updatepayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readsupplierinfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Supplier_ID":req.query.supplierid}
  }
  if(req.query.suppliername!="")
  {
    cond={"Supplier_Name":req.query.suppliername}
  }
  var items;
  var type;
  var Fnreadsupplierinfocall = require("./app/scripts/dboperations.js");
  Fnreadsupplierinfocall.Fnreadsupplier("readsupplierinfo-service",cond,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readpaymentinfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Supplier_ID":req.query.supplierid}
  }

  var items;
  var type;
  var Fnreadpaymentinfocall = require("./app/scripts/dboperations.js");
  Fnreadpaymentinfocall.Fnreadpayment("readpaymentinfo-service",cond,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readiteminfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Item_Supplier_ID":req.query.supplierid}
  }
  var items;
  var type;
  var Fnreaditeminfocall = require("./app/scripts/dboperations.js");
  Fnreaditeminfocall.Fnreaditeminfo("readiteminfo-service",cond,req.query.supplierid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/itemstoresread-service',urlencodedParser, function (req, res) {
  var Fnitemstoresreadcall = require("./app/scripts/dboperations.js");
  Fnitemstoresreadcall.Fnitemstoresread("itemstoresread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the role info for the intent items while creating intent
app.post('/intentroleread-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentno;
  console.log(intentno);
  var Fnintentrolereadcall = require("./app/scripts/dboperations.js");
  Fnintentrolereadcall.Fnintentroleread("intentroleread-service",intentno,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});


//Function to fetch the role info for the intent items while creating intent
app.post('/promoteroleread-service',urlencodedParser, function (req, res) {
  var intentno={Intent_Register_Number:req.query.intentno};
  console.log(intentno);
  var Fnpromoterolereadcall = require("./app/scripts/dboperations.js");
  Fnpromoterolereadcall.Fnpromoteroleread("promoteroleread-service",intentno,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the outward items to generate report based on the date
app.post('/outwarditemfetch',urlencodedParser, function (req, res) {
  var outdate={"Out_Date":req.query.outdate};
  console.log(outdate);
  var Fnoutwarditemfetchcall = require("./app/scripts/dboperations.js");
  Fnoutwarditemfetchcall.Fnoutwarditemfetch("outwarditemfetch",outdate,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the outward items to generate report based on the from and to date
app.post('/outwarditemfromtofetch',urlencodedParser, function (req, res) {
  var fromdate=req.query.fromdate;
  var todate=req.query.todate;
  var Fnoutwarditemfromtofetchcall = require("./app/scripts/dboperations.js");
  Fnoutwarditemfromtofetchcall.Fnoutwarditemfromtofetch("outwarditemfromtofetch",fromdate,todate,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the intent items to create PO
app.post('/intentpoitemread-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;

  var Fnintentpoitemreadcall = require("./app/scripts/dboperations.js");
  Fnintentpoitemreadcall.Fnintentpoitemread("intentpoitemread-service",intentno,itemdes,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});


//Function to create po for item in an intent
app.post('/itempocreate-service',urlencodedParser, function (req, res) {
  var supplier=req.query.supplier;
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;

  var response={
    Supplier_Name:req.query.supplier,
    Intent_Register_Number:req.query.intentregno,
    Product_ID:req.query.itemdes,
    PO_Number:''
  };

  var Fnitempocreatecall = require("./app/scripts/dboperations.js");
  Fnitempocreatecall.Fnitempocreate("itempocreate-service",response,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});


//Function to fetch intent item info
app.post('/intentviewitemread-service',urlencodedParser, function (req, res) {
  var loggeduser=req.query.loggeduser;
  var loggedrole=req.query.loggedrole;

  var FnIntentViewItemReadcall = require("./app/scripts/dboperations.js");
  FnIntentViewItemReadcall.FnIntentViewItemRead("intentViewitemread-service",loggeduser,loggedrole,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function fetches the expanded intent view item info
app.post("/intentviewitemexpand-card",urlencodedParser,function(req,res){
  cond={Intent_Register_Number:req.query.intentregno}
  var FnIntentviewExpandItemFetchcall = require("./app/scripts/dboperations.js");
  FnIntentviewExpandItemFetchcall.FnIntentviewExpandItemFetch("intentviewitemexpand-card",cond,function(returnval){
    res.status(200).json({"itemarr":returnval.itemarr});
  });
});

//Function fetches the expanded intent view item info
app.post("/viewintentpocreate-service",urlencodedParser,function(req,res){

  var FnIntentviewPocreatecall = require("./app/scripts/dboperations.js");
  FnIntentviewPocreatecall.FnIntentviewPocreate("viewintentpocreate-service",function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});


//Function fetches the expanded intent view item promote
app.post("/viewintentpromote-service",urlencodedParser,function(req,res){
//console.log('promote');
  intentno={Intent_Register_Number:req.query.intentregno};
  itemdes={Product_ID:req.query.itemdes};
  updaterolecolumn={PO_Created_By:'Purchase manager'};
  updateroleid={PO_Created_By_ID:req.query.createdby};
  updatedate={PO_Created_By_Date:req.query.createddate};
  updatecolumn={Intent_State:'POCreated'};
  oldcolumn={Intent_State:'Approved'};
  // createdby={Created_By:req.query.createdby};
  var response={
    Supplier_Name:req.query.supplier,
    Intent_Register_Number:req.query.intentregno,
    Product_ID:req.query.itemdes,
    Created_By:req.query.createdby,
    PO_Number:req.query.ponumber
   };

  var FnViewintentpromotecall = require("./app/scripts/dboperations.js");
  FnViewintentpromotecall.FnViewintentpromote("viewintentpromote-service",response,intentno,itemdes,updaterolecolumn,updateroleid,updatedate,updatecolumn,oldcolumn,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

app.post("/posequpdate-service",urlencodedParser,function(req,res){
  ponumber=req.query.ponumber;
  var Fnupdateposeqcall = require("./app/scripts/dboperations.js");
  Fnupdateposeqcall.Fnupdateposeq("posequpdate-service",ponumber,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/customeraddcontact-service",urlencodedParser,function(req,res) {
  response = {
    Customer_ID:req.query.customerid,
    Designation:req.query.designation,
    Mobile_No:req.query.mobileno,
    Email_ID:req.query.emailid
  };
  var Fncustomeraddcontactcall = require("./app/scripts/dboperations.js");
  Fncustomeraddcontactcall.Fncustomeraddcontact("customeraddcontact-service",response,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/customerreadcontact-service",urlencodedParser,function(req,res) {
  customerid = {
    Customer_ID:req.query.customerid
  };
  console.log("In customer read...."+req.query.customerid);
  var Fncustomerreadcontactcall = require("./app/scripts/dboperations.js");
  Fncustomerreadcontactcall.Fncustomerreadcontact("customerreadcontact-service",customerid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/customertaxadd-service",urlencodedParser,function(req,res) {
  response = {
    Customer_ID:req.query.customerid,
    TIN:req.query.tin,
    CST:req.query.cst,
    PAN:req.query.pan,
    TAN:req.query.tan,
    CIN:req.query.cin
  };
  var Fncustomertaxaddcall = require("./app/scripts/dboperations.js");
  Fncustomertaxaddcall.Fncustomertaxadd("customertaxadd-service",response,function(returnval){
    res.status(200).json({"returnval":returnval});
  });
});

//Function to add the customer contac info
app.post("/customerexciseadd-service",urlencodedParser,function(req,res) {
  response = {
    Customer_ID:req.query.customerid,
    Reg_No:req.query.regno,
    Ecc_No:req.query.eccno,
    Range:req.query.range,
    Division:req.query.division,
    Commission:req.query.commission,
    Service_Tax:req.query.servicetax
  };
  var Fncustomerexciseaddcall = require("./app/scripts/dboperations.js");
  Fncustomerexciseaddcall.Fncustomerexciseadd("customerexciseadd-service",response,function(returnval){
    res.status(200).json({"returnval":returnval});
  });
});

//Function to update the supplier info req receives from the admin service
app.post("/addcustomer-service",urlencodedParser,function(req,res) {

  response = {
    Category:req.query.category,
   Customer_ID:req.query.supplierid,
   Customer_Name:req.query.suppliername,
   Alias_Name:req.query.aliasname,
   Address1:req.query.address1,
   Address2:req.query.address2,
   Doorno:req.query.doorno,
   Streetno:req.query.streetno,
   Street_Name:req.query.streetname,
   Location:req.query.location,
   City:req.query.city,
   District:req.query.district,
   State:req.query.state,
   Country:req.query.country,
   Pincode:req.query.pincode,
   PhoneNo1:req.query.phoneno,
   Mobileno:req.query.mobileno,
   Email:req.query.emailid,
   Faxno:req.query.faxno,
   Website:req.query.website,
   Status:'Created'

  };
  var FnAddCustomercall = require("./app/scripts/dboperations.js");
  FnAddCustomercall.FnAddCustomer("addcustomer-service",response,function(returnval){
    res.status(200).json({'returnval': returnval.msg,'id':returnval.id});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/addcustomerpayment-service",urlencodedParser,function(req,res) {

  response = {
   Customer_ID:req.query.customerid,
   Account_Name:req.query.accountname,
   Account_No:req.query.accountno,
   Account_Type:req.query.accounttype,
   Payment_Type:req.query.paymenttype,
   Bank_Name:req.query.bankname,
   Branch:req.query.branch,
   IFSC_Code:req.query.ifsccode,
   MICR_Code:req.query.micrcode,
   Swift_Code:req.query.swiftcode,
   Payment_Term:req.query.paymentterm

  };
  var FnAddcustomerPaymentcall = require("./app/scripts/dboperations.js");
  FnAddcustomerPaymentcall.FnAddcustomerPayment("addcustomerpayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to add the customer contac info
app.post("/taxread-service",urlencodedParser,function(req,res) {
  customerid = {
    Customer_ID:req.query.customerid
  };

  var Fntaxreadcall = require("./app/scripts/dboperations.js");
  Fntaxreadcall.Fntaxread("taxread-service",customerid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to add the customer contac info
app.post("/exciseread-service",urlencodedParser,function(req,res) {
  customerid = {
    Customer_ID:req.query.customerid
  };
  var Fnexcisereadcall = require("./app/scripts/dboperations.js");
  Fnexcisereadcall.Fnexciseread("exciseread-service",customerid,function(returnval){
    res.status(200).json({"itemarr":returnval});
  });
});

//Function to update the supplier info req receives from the admin service
app.post("/updatecustomer-service",urlencodedParser,function(req,res) {

  response = {
    Category:req.query.category,
    Customer_ID:req.query.supplierid,
    Customer_Name:req.query.suppliername,
    Alias_Name:req.query.aliasname,
    Address1:req.query.address1,
    Address2:req.query.address2,
    Doorno:req.query.doorno,
    Streetno:req.query.streetno,
    Street_Name:req.query.streetname,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phoneno:req.query.phoneno,
    Mobileno:req.query.mobileno,
    Email:req.query.emailid,
    Faxno:req.query.faxno,
    Website:req.query.website
  };
  //console.log(response);
  var FnUpdateCustomercall = require("./app/scripts/dboperations.js");
  FnUpdateCustomercall.FnUpdateCustomer("updatecustomer-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatetax-service",urlencodedParser,function(req,res) {

  response = {
    Customer_ID:req.query.customerid,
    TIN:req.query.tin,
    CST:req.query.cst,
    PAN:req.query.pan,
    TAN:req.query.tan,
    CIN:req.query.cin
  };
  //console.log(response);
  var FnUpdatetaxcall = require("./app/scripts/dboperations.js");
  FnUpdatetaxcall.FnUpdatetax("updatetax-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updateexcise-service",urlencodedParser,function(req,res) {
  response = {
    Customer_ID:req.query.customerid,
    Reg_No:req.query.regno,
    Ecc_No:req.query.eccno,
    Range:req.query.range,
    Division:req.query.division,
    Commission:req.query.commission,
    Service_Tax:req.query.servicetax
  };
  //console.log(response);
  var FnUpdateexcisecall = require("./app/scripts/dboperations.js");
  FnUpdateexcisecall.FnUpdateexcise("updateexcise-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatecustomerpayment-service",urlencodedParser,function(req,res) {
  response = {
    Customer_ID:req.query.customerid,
    Account_Name:req.query.accountname,
    Account_No:req.query.accountno,
    Account_Type:req.query.accounttype,
    Payment_Type:req.query.paymenttype,
    Bank_Name:req.query.bankname,
    Branch:req.query.branch,
    IFSC_Code:req.query.ifsccode,
    MICR_Code:req.query.micrcode,
    Swift_Code:req.query.swiftcode,
    Payment_Term:req.query.paymentterm
  };
  //console.log(response);
  //console.log(response);
  var FnUpdatecustomerPaymentcall = require("./app/scripts/dboperations.js");
  FnUpdatecustomerPaymentcall.FnUpdatecustomerPayment("updatecustomerpayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to fetch supplier info req receives from admin service
app.post('/itemcustomerread-service',urlencodedParser, function (req, res) {
  //console.log("In");
  var itemid=req.query.itemid;
  var FnItemcustomerReadcall = require("./app/scripts/dboperations.js");
  FnItemcustomerReadcall.FnItemcustomerRead("itemcustomerread-service",itemid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readcustomerinfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Customer_ID":req.query.supplierid}
  }
  if(req.query.suppliername!="")
  {
    cond={"Customer_Name":req.query.suppliername}
  }
  var items;
  var type;
  var Fnreadcustomerinfocall = require("./app/scripts/dboperations.js");
  Fnreadcustomerinfocall.Fnreadcustomer("readcustomerinfo-service",cond,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readcustomerpaymentinfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Customer_ID":req.query.supplierid}
  }

  var items;
  var type;
  var Fnreadcustomerpaymentinfocall = require("./app/scripts/dboperations.js");
  Fnreadcustomerpaymentinfocall.Fnreadcustomerpayment("readcustomerpaymentinfo-service",cond,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

//Function to fetch the searched item info using id or name according to the search type
app.post('/readcustomeriteminfo-service',urlencodedParser, function (req, res) {
  if(req.query.supplierid!="")
  {
    cond={"Item_Customer_ID":req.query.supplierid}
  }
  var items;
  var type;
  var Fnreadcustomeriteminfocall = require("./app/scripts/dboperations.js");
  Fnreadcustomeriteminfocall.Fnreadcustomeriteminfo("readcustomeriteminfo-service",cond,req.query.supplierid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
app.post('/purchaseorder-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;
  var Fnpurchaseordercall = require("./app/scripts/dboperations.js");
  Fnpurchaseordercall.Fnpurchaseorder("purchaseorder-service",intentno,itemdes,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
app.post('/purchaseorderitem-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;
  var Fnpurchaseorderitemcall = require("./app/scripts/dboperations.js");
  Fnpurchaseorderitemcall.Fnpurchaseorderitem("purchaseorderitem-service",intentno,itemdes,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
app.post('/purchaseorderitemtax-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;
  var Fnpurchaseorderitemtaxcall = require("./app/scripts/dboperations.js");
  Fnpurchaseorderitemtaxcall.Fnpurchaseorderitemtax("purchaseorderitemtax-service",intentno,itemdes,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
app.post('/purchaseorderitemprice-service',urlencodedParser, function (req, res) {
  var intentno=req.query.intentregno;
  var itemdes=req.query.itemdes;
  var Fnpurchaseorderitempricecall = require("./app/scripts/dboperations.js");
  Fnpurchaseorderitempricecall.Fnpurchaseorderitemprice("purchaseorderitemprice-service",intentno,itemdes,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/customersupplier-service',urlencodedParser, function (req, res) {
  var itemid=req.query.itemid;
  var itemtype=req.query.itemtype;
  var Fncustomersuppliercall = require("./app/scripts/dboperations.js");
  Fncustomersuppliercall.Fncustomersupplier("customersupplier-service",itemid,itemtype,function(returnval){
    res.status(200).json({'itemarr': returnval.itemarr,'returntype':returnval.returntype});
  });
});

app.post('/deleteitemsupplier-service',urlencodedParser, function (req, res) {
  var itemid=req.query.itemid;
  var supplierid=req.query.supplierid;
  var Fndeleteitemsuppliercall = require("./app/scripts/dboperations.js");
  Fndeleteitemsuppliercall.Fndeleteitemsupplier("deleteitemsupplier-service",itemid,supplierid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/updateitempricesupplier-service',urlencodedParser, function (req, res) {
  var itemid=req.query.itemid;
  var supplierid=req.query.supplierid;
  var supplierprice=req.query.supplierprice;
  var Fnupdateitempricesuppliercall = require("./app/scripts/dboperations.js");
  Fnupdateitempricesuppliercall.Fnupdateitempricesupplier("updateitempricesupplier-service",itemid,supplierid,supplierprice,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});


app.post('/deleteitemcustomer-service',urlencodedParser, function (req, res) {
  var itemid=req.query.itemid;
  var customerid=req.query.customerid;
  var Fndeleteitemcustomercall = require("./app/scripts/dboperations.js");
  Fndeleteitemcustomercall.Fndeleteitemcustomer("deleteitemcustomer-service",itemid,customerid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/readsuppliertoapprove-service',urlencodedParser, function (req, res) {
  var Fnreadsuppliertoapprovecall = require("./app/scripts/dboperations.js");
  Fnreadsuppliertoapprovecall.Fnreadsuppliertoapprove("readsuppliertoapprove-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/approvesupplierforpurchase-service',urlencodedParser, function (req, res) {
  var supplierid=req.query.supplierid;
  var status=req.query.status;
  var Fnapprovesupplierforpurchasecall = require("./app/scripts/dboperations.js");
  Fnapprovesupplierforpurchasecall.Fnapprovesupplierforpurchase("approvesupplierforpurchase-service",supplierid,status,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/readcustomertoapprove-service',urlencodedParser, function (req, res) {
  var Fnreadcustomertoapprovecall = require("./app/scripts/dboperations.js");
  Fnreadcustomertoapprovecall.Fnreadcustomertoapprove("readcustomertoapprove-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/approvecustomerforsales-service',urlencodedParser, function (req, res) {
  var customerid=req.query.customerid;
  var status=req.query.status;
  var Fnapprovecustomerforsalescall = require("./app/scripts/dboperations.js");
  Fnapprovecustomerforsalescall.Fnapprovecustomerforsales("approvecustomerforsales-service",customerid,status,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/retestitemread-service',urlencodedParser, function (req, res) {

  var Fnretestitemreadcall = require("./app/scripts/dboperations.js");
  Fnretestitemreadcall.Fnretestitemread("retestitemread-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/resenditemtoquality-service',urlencodedParser, function (req, res) {
  var inwardregno={new_Inward_Register_Number:req.query.inwardregno};
  var updatestate={state:req.query.updatestate};
  var checkstate={state:req.query.checkstate};
  var Fnresenditemtoqualitycall = require("./app/scripts/dboperations.js");
  Fnresenditemtoqualitycall.Fnresenditemtoquality("resenditemtoquality-service",inwardregno,updatestate,checkstate,function(returnval){
    res.status(200).json(returnval);
  });
});


app.post('/customerinforead-service',urlencodedParser, function (req, res) {
  var customerid={Customer_ID:req.query.customerid};
  var Fncustomerinforeadcall = require("./app/scripts/dboperations.js");
  Fncustomerinforeadcall.Fncustomerinforead("customerinforead-service",req.query.customerid,function(returnval){
    res.status(200).json(returnval);
  });
});


app.post('/supplierinforead-service',urlencodedParser, function (req, res) {
  var supplierid={Supplier_ID:req.query.supplierid};
  var Fnsupplierinforeadcall = require("./app/scripts/dboperations.js");
  Fnsupplierinforeadcall.Fnsupplierinforead("supplierinforead-service",req.query.supplierid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/passwordchange-service',urlencodedParser, function (req, res) {
  var empid={Emp_ID:req.query.empid};
  var oldpass={Password:req.query.oldpassword};
  var newpass={Password:req.query.newpassword};
  var Fnpasswordchangecall = require("./app/scripts/dboperations.js");
  Fnpasswordchangecall.Fnpasswordchange("passwordchange-service",empid,oldpass,newpass,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/resetpassword-service',urlencodedParser, function (req, res) {
  var empid={Emp_ID:req.query.empid};
  var newpass={Password:req.query.newpassword};
  var Fnresetpasswordcall = require("./app/scripts/dboperations.js");
  Fnresetpasswordcall.Fnresetpassword("resetpassword-service",empid,newpass,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/verifymail-service',urlencodedParser, function (req, res) {
  var empid={Employee_ID:req.query.empid};
  var Fnverifymailcall = require("./app/scripts/dboperations.js");
  Fnverifymailcall.Fnverifymail("verifymail-service",empid,req.query.code,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/readdepartment-service',urlencodedParser, function (req, res) {
  
  var Fnreaddepartmentcall = require("./app/scripts/dboperations.js");
  Fnreaddepartmentcall.Fnreaddepartment("readdepartment-service",function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/readrole-service',urlencodedParser, function (req, res) {
  
  var Fnreadrolecall = require("./app/scripts/dboperations.js");
  Fnreadrolecall.Fnreadrole("readrole-service",function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/readdepartment-service',urlencodedParser, function (req, res) {
  
  var Fnreaddepartmentcall = require("./app/scripts/dboperations.js");
  Fnreaddepartmentcall.Fnreaddepartment("readdepartment-service",function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/userinfo-service',urlencodedParser, function (req, res) {
  response = {
   Employee_Name:req.query.employeename,
   Date_Of_Birth:req.query.dob,
   Sex:req.query.sex,
   Age:req.query.age,
   Street_Name:req.query.streetname,
   Location:req.query.location,
   City:req.query.city,
   District:req.query.district,
   State:req.query.state,
   Country:req.query.country,
   // Pincode:req.query.pincode,
   Phone:req.query.phoneno,
   Mobile:req.query.mobileno,
   Email:req.query.emailid,
   Status:'Created'
 }

  
  var Fnuserinfocall = require("./app/scripts/dboperations.js");
  Fnuserinfocall.Fnuserinfo("userinfo-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/useraccount-service',urlencodedParser, function (req, res) {
  
  response = {
    Employee_ID:req.query.employeeid,
    Account_Name:req.query.accountname,
    Account_Number:req.query.accountno,
    Account_Type:req.query.accounttype,
    Bank_Name:req.query.bankname,
    Branch:req.query.branch,
    IFSC_Code:req.query.ifsccode
      };

  var Fnuseraccountcall = require("./app/scripts/dboperations.js");
  Fnuseraccountcall.Fnuseraccount("useraccount-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/userrole-service',urlencodedParser, function (req, res) {  
 
  var Fnuserrolecall = require("./app/scripts/dboperations.js");
  Fnuserrolecall.Fnuserrole("userrole-service",req.query.employeeid,req.query.departmentname,req.query.rolename,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/readusertoapprove-service',urlencodedParser, function (req, res) {
  var Fnreadusertoapprovecall = require("./app/scripts/dboperations.js");
  Fnreadusertoapprovecall.Fnreadusertoapprove("readusertoapprove-service",function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});


app.post('/userinforead-service',urlencodedParser, function (req, res) {
  var employeeid={Employee_ID:req.query.employeeid};
  var Fnuserinforeadcall = require("./app/scripts/dboperations.js");
  Fnuserinforeadcall.Fnuserinforead("userinforead-service",req.query.employeeid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/approveuser-service',urlencodedParser, function (req, res) {
  var employeeid=req.query.employeeid;
  var status=req.query.status;
  var Fnapproveusercall = require("./app/scripts/dboperations.js");
  Fnapproveusercall.Fnapproveuser("approveuser-service",employeeid,status,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});

app.post('/updateuserinfo-service',urlencodedParser, function (req, res) {
  response = {
   Employee_Name:req.query.employeename,
   Date_Of_Birth:req.query.dob,
   Sex:req.query.sex,
   Age:req.query.age,
   Street_Name:req.query.streetname,
   Location:req.query.location,
   City:req.query.city,
   District:req.query.district,
   State:req.query.state,
   Country:req.query.country,
   // Pincode:req.query.pincode,
   Phone:req.query.phoneno,
   Mobile:req.query.mobileno,
   Email:req.query.emailid,
   Status:'Created'
 }

  
  var Fnupdateuserinfocall = require("./app/scripts/dboperations.js");
  Fnupdateuserinfocall.Fnupdateuserinfo("updateuserinfo-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/updateuseraccount-service',urlencodedParser, function (req, res) {
  
  response = {
    Employee_ID:req.query.employeeid,
    Account_Name:req.query.accountname,
    Account_Number:req.query.accountno,
    Account_Type:req.query.accounttype,
    Bank_Name:req.query.bankname,
    Branch:req.query.branch,
    IFSC_Code:req.query.ifsccode
      };

  var Fnupdateuseraccountcall = require("./app/scripts/dboperations.js");
  Fnupdateuseraccountcall.Fnupdateuseraccount("updateuseraccount-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/updateuserrole-service',urlencodedParser, function (req, res) {  
 
  var Fnupdateuserrolecall = require("./app/scripts/dboperations.js");
  Fnupdateuserrolecall.Fnupdateuserrole("updateuserrole-service",req.query.employeeid,req.query.departmentname,req.query.rolename,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/userread-service',urlencodedParser, function (req, res) {
  var employeeid={Employee_ID:req.query.employeeid};
  var Fnuserreadcall = require("./app/scripts/dboperations.js");
  Fnuserreadcall.Fnuserread("userread-service",req.query.employeeid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/usersearch-service',urlencodedParser, function (req, res) {
  var employeename={Employee_Name:req.query.employeename};
  var Fnusersearchcall = require("./app/scripts/dboperations.js");
  Fnusersearchcall.Fnusersearch("usersearch-service",req.query.employeename,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/useraccount1-service',urlencodedParser, function (req, res) {
  var employeeid={Employee_ID:req.query.employeeid};
  var Fnuseraccount1call = require("./app/scripts/dboperations.js");
  Fnuseraccount1call.Fnuseraccount1("useraccount1-service",req.query.employeeid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/role-service',urlencodedParser, function (req, res) {
  var employeeid={Employee_ID:req.query.employeeid};
  var Fnrolecall = require("./app/scripts/dboperations.js");
  Fnrolecall.Fnrole("role-service",req.query.employeeid,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/createdepartment-service',urlencodedParser, function (req, res) {
  var response={
    Department_ID:req.query.departmentid,
    Department_Name:req.query.departmentname
  };

  var Fncreatedepartmentcall = require("./app/scripts/dboperations.js");
  Fncreatedepartmentcall.Fncreatedepartment("createdepartment-service",response,function(returnval){
    res.status(200).json(returnval);
  });
});

app.post('/createrole-service',urlencodedParser, function (req, res) {
  var response={
    Role_ID:req.query.roleid,
    Role_Name:req.query.rolename
  };

  var Fncreaterolecall = require("./app/scripts/dboperations.js");
  Fncreaterolecall.Fncreaterole("createrole-service",response,function(returnval){
    res.status(200).json(returnval);
  });  
});

//Node server running port number
app.listen(4000);

