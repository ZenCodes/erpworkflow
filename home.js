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
    //Purchase_Type:req.query.purchasetype,
    Purchase_Type:req.query.purchasetypeflag,
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
  if(req.query.updatestate=="Approved")
  updaterolecolumn={Intent_Approved_By:req.query.loggedrole};
  if(req.query.updatestate=="Supplied")
  updaterolecolumn={Intent_Supplied_By:req.query.loggedrole};
  if(req.query.updatestate=="POCreated")
  updaterolecolumn={PO_Created_By:req.query.loggedrole};
  if(req.query.updatestate=="POSent")
  updaterolecolumn={PO_Created_By:req.query.loggedrole};
  if(req.query.updatestate=="Accepted")
  updaterolecolumn={Intent_Accepted_By:req.query.loggedrole};
  updatecolumn={Intent_State:req.query.updatestate};
  var Fnintentstateupdatecall = require("./app/scripts/dboperations.js");
  Fnintentstateupdatecall.FnIntentStateUpdate("intentstateupdate-service",cond,cond1,updatecolumn,updaterolecolumn,function(returnval){
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
   Supplier_ID:req.query.supplierid,
   Supplier_Name:req.query.suppliername,
    LandMark:req.query.landmark,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phone:req.query.phoneno,
    Mobile:req.query.mobileno,
    Email:req.query.emailid,
    Status:""

  };
  var FnAddSuppliercall = require("./app/scripts/dboperations.js");
  FnAddSuppliercall.FnAddSupplier("addsupplier-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/addpayment-service",urlencodedParser,function(req,res) {

  response = {
   Supplier_ID:req.query.supplierid,
   Account_No:req.query.accno,
   Bank_Name:req.query.bankname,
   Payment_Type:req.query.mode,
   Payment_Term:req.query.paymentterm,
   Bank_Address:req.query.address

  };
  var FnAddPaymentcall = require("./app/scripts/dboperations.js");
  FnAddPaymentcall.FnAddPayment("addpayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatesupplier-service",urlencodedParser,function(req,res) {

  response = {
   Supplier_ID:req.query.supplierid,
   Supplier_Name:req.query.suppliername,
    LandMark:req.query.landmark,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phone:req.query.phoneno,
    Mobile:req.query.mobileno,
    Email:req.query.emailid

  };
  var FnUpdateSuppliercall = require("./app/scripts/dboperations.js");
  FnUpdateSuppliercall.FnUpdateSupplier("updatesupplier-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatepayment-service",urlencodedParser,function(req,res) {

  response = {
   Supplier_ID:req.query.supplierid,
   Account_No:req.query.accno,
   Bank_Name:req.query.bankname,
   Payment_Type:req.query.mode,
   Payment_Term:req.query.paymentterm,
   Bank_Address:req.query.address

  };
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
  updatecolumn={Intent_State:'POCreated'};
  oldcolumn={Intent_State:'Approved'};
   var response={
    Supplier_Name:req.query.supplier,
    Intent_Register_Number:req.query.intentregno,
    Product_ID:req.query.itemdes,
    PO_Number:req.query.ponumber
   };

  var FnViewintentpromotecall = require("./app/scripts/dboperations.js");
  FnViewintentpromotecall.FnViewintentpromote("viewintentpromote-service",response,intentno,itemdes,updaterolecolumn,updatecolumn,oldcolumn,function(returnval){
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


//Function to update the supplier info req receives from the admin service
app.post("/addcustomer-service",urlencodedParser,function(req,res) {

  response = {
   Customer_ID:req.query.supplierid,
   Customer_Name:req.query.suppliername,
    LandMark:req.query.landmark,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phone:req.query.phoneno,
    Mobile:req.query.mobileno,
    Email:req.query.emailid

  };
  var FnAddCustomercall = require("./app/scripts/dboperations.js");
  FnAddCustomercall.FnAddCustomer("addcustomer-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/addcustomerpayment-service",urlencodedParser,function(req,res) {

  response = {
   Customer_ID:req.query.supplierid,
   Account_No:req.query.accno,
   Bank_Name:req.query.bankname,
   Payment_Type:req.query.mode,
   Payment_Term:req.query.paymentterm,
   Bank_Address:req.query.address

  };
  var FnAddcustomerPaymentcall = require("./app/scripts/dboperations.js");
  FnAddcustomerPaymentcall.FnAddcustomerPayment("addcustomerpayment-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});


//Function to update the supplier info req receives from the admin service
app.post("/updatecustomer-service",urlencodedParser,function(req,res) {

  response = {
   Customer_ID:req.query.supplierid,
   Customer_Name:req.query.suppliername,
    LandMark:req.query.landmark,
    Location:req.query.location,
    City:req.query.city,
    District:req.query.district,
    State:req.query.state,
    Country:req.query.country,
    Pincode:req.query.pincode,
    Phone:req.query.phoneno,
    Mobile:req.query.mobileno,
    Email:req.query.emailid

  };
  console.log(response);
  var FnUpdateCustomercall = require("./app/scripts/dboperations.js");
  FnUpdateCustomercall.FnUpdateCustomer("updatecustomer-service",response,function(returnval){
    res.status(200).json({'returnval': returnval});
  });

});

//Function to update the supplier info req receives from the admin service
app.post("/updatecustomerpayment-service",urlencodedParser,function(req,res) {
  console.log('in.............');
console.log(req.query.supplierid);
  response = {
   Customer_ID:req.query.supplierid,
   Account_No:req.query.accno,
   Bank_Name:req.query.bankname,
   Payment_Type:req.query.mode,
   Payment_Term:req.query.paymentterm,
   Bank_Address:req.query.address

  };
  console.log(response);
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
  var Fnapprovesupplierforpurchasecall = require("./app/scripts/dboperations.js");
  Fnapprovesupplierforpurchasecall.Fnapprovesupplierforpurchase("approvesupplierforpurchase-service",supplierid,function(returnval){
    res.status(200).json({'itemarr': returnval});
  });
});
//Node server running port number
app.listen(4000);

