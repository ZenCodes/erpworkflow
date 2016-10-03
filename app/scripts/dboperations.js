/**
 * Created by praba on 2/10/2016.
 */
var mysql      = require('mysql');
var email   = require("emailjs/email");
var fs = require('fs');
var htmlToPdf = require('html-to-pdf');
var logfile;

var credential=[];
var emailcredential=[];
//Fetching credential information
exports.FnReadCredentials=function() {
  require('fs').readFile('./app/config/credentials.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    credential = JSON.parse(data);
    exports.FnEmailReadCredentials();
    exports.FnDBConnection();
    //console.log(obj);
  });
}

//Fetching credential information
exports.FnEmailReadCredentials=function() {
  require('fs').readFile('./app/config/emailcredential.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    emailcredential = JSON.parse(data);
    
    //console.log(obj);
  });
}

exports.FnCreateFile=function(app,express) {
logfile = fs.createWriteStream('./app/config/logfile.log', {flags: 'a'});

// app.use(express.logger({stream: logfile}));

app.get('/', function(req, res){
  fs.createReadStream('./app/config/logfile.log').pipe(res);
});
}


//Create mysql connection using credential parameters
var connection;
exports.FnDBConnection=function(){
  //Creating mysql connection using following connection parameters
  connection = mysql.createConnection({
    host     : credential[0].host,
    port     : credential[0].port,
    user     : credential[0].user,
    password : credential[0].password,
    database : credential[0].database
  });

  connection.connect(function(err){
    if(!err) {
      console.log("Database is connected ... \n\n");
      //Calling function to fetch all the tables from config files
      exports.FnReadConfig();
    } else {
      logfile.write('db connection:'+err);
      console.log("Error connecting database ... \n\n"+err);
    }
  });
}


exports.Fnpurchaseordercreatepdf=function(pagename,response,callback) {


  var content = "<table width='700px'><tr><td><img src='./app/images/logo.jpg' height='100px' width='100px'></td><td><h1>Purchase Order</h1></td></tr></table><br><br><br><br>"
  content += "<table width='700px' border='1'><tr><td>"+response.cmpname+"</td><td align='right'>Po Date</td><td>"+response.podate+"</td></tr><tr><td>"+response.cmpaddr1+"</td><td align='right'>Po Number</td><td>"+response.ponumber+"</td></tr>"
  content += "<tr><td>"+response.cmpaddr2+"</td></tr><tr><td>"+response.cmpemail+"</td></tr><tr><td>"+response.cmpphone+"</td></tr></table><br><br><br><br><br>"

  content += "<table width='700px' border='1'><tr><td>To</td></tr></table><table style='margin-left:5%'><tr style='margin-left:5%'><td>xyz company</td></tr>"
  content += "<tr style='margin-left:5%'><td>"+response.suppliername+"</td></tr><tr style='margin-left:5%'><td>"+response.location+"</td></tr>"
  content += "<tr style='margin-left:5%'><td>"+response.email+"</td></tr><tr style='margin-left:5%'><td>"+response.mobileno+"</td></tr></table><br><br><br><br>"


  content += "<table width='700px' border='1'><tr><td>S.No</td><td>Item description</td><td>Qty</td><td>UOM</td><td>Rate</td><td>Amount</td></tr>"
  content += "<tr><td>1</td><td>"+response.productid+"</td><td>"+response.quantity+" "+response.qtymeasure+"</td><td>"+response.unit+" "+response.unitmeasure+"</td><td>"+response.itemsupplierprice+"</td><td>"+response.total+"</td></tr></table><br><br><br><br>"

  content += "<table style='margin-left:65%'><tr><td>Total :</td><td><img src='public/rupee.png' width='5px' height='5px'>"+response.total+"</td></tr><tr><td>Excess Duty (12.5%):</td><td><img src='public/rupee.png' width='5px' height='5px'>"+response.exduty+"</td></tr>"
  content += "<tr><td>VAT (5%):</td><td><img src='public/rupee.png' width='5px' height='5px'>"+response.vat+"</td></tr><tr><td>CST (2%):</td><td><img src='public/rupee.png' width='5px' height='5px'>"+response.cst+"</td></tr>"
  content += "<tr><td colspan='2'>---------------------------------------</td></tr><tr><td>Grand Total :</td><td><img src='public/rupee.png' width='5px' height='5px'>"+response.grandtot+"</td></tr></table>";


    htmlToPdf.convertHTMLString(content, './app/images/Purchaseorder.pdf',
    function (error, success) {
       if (error) {
        response.flag=0;
            console.log('Oh noes! Errorz!');
            console.log(error);
        } else {
          response.flag=1;
          console.log('Converted');
          // res.status(200).json({'returnval': 'converted'});   
          return callback('converted');  
        }
    });
    // if(response.flag==1)
    // return callback('converted'); 
}


exports.Fnpurchaseordersendmail=function(pagename,response,callback) {    

// console.log(JSON.stringify(response));   

var server  = email.server.connect({
   user:    emailcredential[0].email,
   password:emailcredential[0].password,
   host:    "smtp.gmail.com",
   ssl:     true

});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "Purchase Order",
   from:    response.cmpemail,
   to:      response.email,   
   subject: "PO Test",
   attachment:
   [{
    filename: 'Purchaseorder.pdf',
    path: './app/images/Purchaseorder.pdf',
    type: 'application/pdf'
   }]
}, function(err, message) { console.log(err || message); });
  return callback('mail sent');
}


//Fetch all config tables
var obj=[];
exports.FnReadConfig=function() {
  require('fs').readFile('./app/config/dbconfig.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
     obj = JSON.parse(data);
    //console.log(obj);
  });
}

//Method invoked from login-card ,to validate the user and returns role name to the login-card
exports.FnLoginDBCheck=function(pagename,username,password,callback){

  //To fetch tables for this card from dbconfig file
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var returnval;
  var rolename;
  var username={"Emp_ID":username};
  var password={"Password":password};
  //Fetching JOB_DESC of tthe logged user
  connection.query('SELECT * FROM '+ Config_tables[0] +' WHERE ? and ? ',[username,password], function(err, rows) {
    if(!err)
    {
     // console.log(rows);
      if(rows.length>0)
      {
         var depid={'Department_ID':rows[0].Department_ID};
         var roleid=rows[0].Role_ID;
       //  console.log(depid);
         //Fetching Department of the logged user and identifying the role
         connection.query('SELECT * FROM '+ Config_tables[1] +' WHERE ? ',[depid], function(err, rows) {
          if(!err){
         //   console.log(rows);
            if(rows.length>0)
            {
              var depname=rows[0].Department_Name;
              var Role_Name=depname+" "+roleid;
              var cond={"Role_Name":Role_Name};
           //   console.log(cond);
              connection.query('SELECT * FROM '+ Config_tables[2] +' WHERE ? ',[cond], function(err, rows) {
             //   console.log(rows);
                if(!err){
                  if(rows.length>0){
                    rolename=rows[0].Role_Name;
                    //console.log(rolename);
                    //Return logged user's rolename to the login card if it is a valid user
                    return callback(rolename);
                  }
                }
                else
                  console.log('error'+err);
              });
            }
          }
          else
            console.log("error...."+err);
        });
      }
      else
      {
        logfile.write('\nno user');
        //If the logged user is not exist it returns invalid flag to the login card
        return callback("invalid");
        }
    }
    else
    {
      console.log(err);
    }
  });

}

//Method to fetch the logged user name
exports.Fnusernameread=function(pagename,userid,callback){

  //To fetch tables for this card from dbconfig file
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
var queryy="SELECT Employee_Name FROM MD_HR_Employee where Employee_ID='"+userid+"'";
console.log(queryy);
connection.query(queryy, function (err, rows) {
if(!err){
  console.log(rows);
  return callback(rows);
}
else{
  console.log(err);
  return callback('fail');
}
});

}


//Method to fetch the item names from master table according to the logged user role
exports.FnFetchIntenttypelist=function(pagename,loggeduser,callback) {
var queryy="SELECT Item_Type_Name from MD_Item_Type where Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Department_ID=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"') or Intent_Owner=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"'))";
connection.query(queryy, function (err, rows) {
if(!err){
  return callback(rows);
}
else
  return callback('fail');
});
}

//Method to fetch the item names from master table according to the logged user role
exports.FnFetchItemlist=function(pagename,wardflag,itemid,callback) {

  var queryy="";
  var loggeduser=itemid;
  var Config_tables=[];
  var Config_columns=[];
  var Config_columnvalue=[];
  //Loop which fetch table name,column names and default values from config file
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
      Config_columnvalue=obj[i].columnvalues;
    }
  }
 // console.log(wardflag+"  "+itemid)
  //Condition which form the query for the currently logged role
  if(wardflag=="0"){
    //console.log("0");
  queryy="SELECT mi.Item_ID,mi.Item_Name,mi.Item_Description,mi.Item_Type_ID,mi.Container,mi.UOM,mi.Item_Group_ID,mi.Item_Purchase_Type_ID,oi.Item_Supplier_ID from MD_Item mi join OD_Item oi on(mi.Item_ID=oi.Item_ID) and oi.Item_Supplier_ID='"+itemid+"' and mi.Item_Type_ID not in('FG')";
  //queryy="SELECT * FROM "+ Config_tables[0] +" WHERE "+ Config_columns[1]+"='"+itemid+"' AND "+Config_columns[0] +" NOT IN('"+Config_columnvalue[0]+"')";
  //console.log(queryy);
  }
  //Condition which form the query for the currently logged role
  else if(wardflag=="1"){
    //console.log("1");
    queryy="SELECT mi.Item_ID,mi.Item_Name,mi.Item_Description,mi.Item_Type_ID,mi.Container,mi.UOM,mi.Item_Group_ID,mi.Item_Purchase_Type_ID,oi.Item_Customer_ID from MD_Item mi join OD_Item oi on(mi.Item_ID=oi.Item_ID) and oi.Item_Customer_ID='"+itemid+"' and mi.Item_Type_ID  in('FG')";
    //queryy="SELECT * FROM "+ Config_tables[0] +" WHERE "+ Config_columns[0] +" IN('"+Config_columnvalue[0]+"')";
  }
  //Condition which form the query for the currently logged role
  else if(wardflag=="2"){
    //console.log("2");
    if(itemid=="all")
    queryy="SELECT * FROM MD_Item";
    else if(itemid=="sale")
    queryy="SELECT * from MD_Item where Item_Type_ID in('FG')";
    else if(itemid=="purchase")
    queryy="SELECT * from MD_Item where Item_Type_ID not in('FG')";
    }
  else if(wardflag=="3")
  {
    //console.log("3");
    //console.log("inside");
    queryy="SELECT * from MD_Item where Item_Type_ID in(SELECT Item_Type_ID from MD_Item_Type where Item_Type_Name='"+itemid+"') and Item_Purchase_Type_ID='0'";
    //console.log(queryy);
    //queryy="SELECT * from MD_Item where Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Department_ID=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"') or Intent_Owner=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and Item_Purchase_Type_ID='0'";
    //console.log(queryy);
  }
  else if(wardflag=="4"){
    //console.log("4");
    queryy="SELECT * FROM MD_Item WHERE Item_Purchase_Type_Id='1'";
  }
  //Query which fetches items for the corresponding role who logged in
  connection.query(queryy, function (err, rows) {
    if (!err) {
    var itemarr = [];
    for (var i = 0; i < rows.length; i++) {
      var obj = {"itemid": "", "itemname": "", "itemdes": "","itemtype":"","container":"","uom":"","itemgroup":"","itempurchasetype":"","purchasetypeflag":""};
      obj.itemid = rows[i].Item_ID;
      obj.itemname = rows[i].Item_Name;
      obj.itemdes = rows[i].Item_Description;
      obj.itemtype = rows[i].Item_Type_ID;
      obj.container = rows[i].Container;
      obj.uom = rows[i].UOM;
      obj.itemgroup = rows[i].Item_Group_ID;
      //obj.itempurchasetype = rows[i].Item_Purchase_Type_ID;
      obj.purchasetypeflag = rows[i].Item_Purchase_Type_ID;
      itemarr.push(obj);
    }
    //console.log(JSON.stringify(itemarr));
     //  Response sending back to the server if it have the items
     if(itemarr.length>0)
       return callback(itemarr);

      else
       return callback("no items");
    }
    //else
      //console.log(err);
  });
}

//Function which generates the sequence no for the inward item entry
exports.FnInwardRegNoGeneration=function(pagename,response,cond,callback){
  //Fetching tables from config file
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
  }


  //Fetching inward bill no if it is new it will insert data otherwise it wont
  // connection.query('SELECT '+ Config_columns[0] +' FROM '+ Config_tables[0] +' WHERE ?',[cond],function(error,rows) {
    // if(!error)
    // {
      //console.log(rows.length);
      // if(rows.length==0)
      // {
        //Inserting vehicle info to the table
        connection.query('INSERT INTO '+Config_tables[0]+' set ?', [response], function(error) {
          if(!error){
            dummyno = {
              dummy_column : 1
            };
            //Generating inward sequence no
            connection.query('INSERT INTO '+Config_tables[1]+' set ?',[dummyno],function(err,result){
              if(!err)
              {
                console.log('seq generated!');
              }
            });
            //res.status(200).json({'returnval': "succ"});
            //Sending succ flag as created seq successfully
            return callback("succ");
          }
          else{
            // console.log(error);
            //res.status(200).json({'returnval': "fail"});
            return callback("fail");
          }
        });
      // }
      // else
      // {
        //res.status(200).json({'returnval': "exists"});
        //Sending exists flag as seq no already there
        // return callback("exists");
      // }
    // }
    // else
    // {
      //console.log("yes..."+error);
      //res.status(200).json({'returnval': "fail"});
      // return callback("fail");
    // }
  // });
}

//Function which generate batch no 
exports.FnGeneratebatchno=function(pagename,heatno,callback){
  //Fetching tables from config file
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }   
  }

  // var heatno={"Heat_No":heatno};
  var qur="SELECT * FROM OD_Heat_To_Batch WHERE Heat_No='"+heatno+"'";
  console.log(qur);
  //Generating and updating batch number
  connection.query(qur,function(err,rows,result){
  if(!err)
  {
    if(rows.length>0){
    return callback(rows[0].Batch_No);
    }
    else
    {
    connection.query('SELECT Batch_No FROM Auto_Batch_Number',function(err,rows,result){
    if(rows.length>0){
      var batchno=parseInt(rows[0].Batch_No)+1;
      var newbatchno={"Batch_No":batchno};
      connection.query('UPDATE Auto_Batch_Number SET ?',[newbatchno],function(err,rows,result){
        return callback(batchno);
      });
    }
    // return callback("no match");
    });
    }
  }
  else
  {
    return callback("not okay");
  }
  });
   
}

//Function which register the Inward items
exports.FnRegisterInwardItemDetail=function(pagename,response,callback){
  //Fetching tables from config file
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }   
  }
  //Fetching inward register no and adding IRN to this no
  connection.query('SELECT '+Config_columns[0]+' FROM '+Config_tables[0]+' ORDER BY Inward_Register_Number DESC LIMIT 1', function(err, rows, fields) {
    if(!err)
    {
      var idd="IRN"+rows[0].Inward_Register_Number;
      //			 console.log(idd);
      response.new_Inward_Register_Number=idd;
      //Inserting item info to the table
      connection.query('INSERT into '+Config_tables[1]+' set ?',[response],function(err,result){
        if(!err)
        {
          //console.log("Inserted!"+idd);
          //On successful registeration generating inward reg no as response
          return callback(idd);
          //res.status(200).json({'inwardregno': idd});
        }
        else{
          //On failing insert operation error message revert
        // console.log("Not Inserted!"+err);
          return callback("not okay");
          //res.status(200).json({'inwardregno': 'not okay'});
        }
      });
    }
  });
}

//Function which fetches the forward flow items
exports.FnForwardFlowitemFetch=function(pagename,state,roleid,empid,callback){
  //Fetching tables for this page
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
    //console.log(Config_tables);
  }
  // console.log(Config_columns[0]+"  "+state);
  if(roleid=="2")
  var queryy="SELECT * from OD_Sales_Inward_Material where Product_ID in(SELECT Item_name from MD_Item where Store_Location_ID in (SELECT  Store_Location_ID FROM `MD_Stores_Mapping` WHERE Employee_ID='"+empid+"')) and state='"+state+"' ORDER BY "+Config_columns[0]+" DESC";
  else
  var queryy="SELECT  * FROM OD_Sales_Inward_Material WHERE state='"+state+"' ORDER BY "+Config_columns[0]+" DESC";
  
  // console.log(queryy);
  //Query which fetch the item under specific IRN Number
  connection.query(queryy,function(err, rows, fields) {
    /*var itemarr=[];
    for(var i=0;i<rows.length;i++)
    {
      var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","state":"","inwardregno":""};

      obj.inwardno=rows[i].Inward_Bill_Number;
      obj.inwarddate=rows[i].Inward_Register_Date;
      obj.ponumber=rows[i].PO_Number;
      obj.podate=rows[i].PO_Date;
      obj.state=rows[i].state;
      obj.inwardregno=rows[i].new_Inward_Register_Number;
      itemarr.push(obj);
    }*/
    if(!err){
      //Sending response items under the IRN number
      if(rows.length>0)
      return callback(rows);
      else
      return callback("no items");
      //res.status(200).json(itemarr);
    }
  });
}

//Function fetches expanded card item info
exports.FnExpanditemFetch=function(pagename,cond,cond1,callback){
  //Fetches tables for this page
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  //console.log(JSON.stringify(cond)+" "+JSON.stringify(cond1));
  //Query fetches item info under the specific IRN Number with desired state
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond,cond1], function(err, rows) {
    if(!err)
    {
      var itemarr=[];
      //console.log(rows.length);
      //if(rows.length>0){

      for(var i=0;i<rows.length;i++)
      {
        var obj={"purchasetypeflag":"","inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","containerreceived":"","containeraccepted":"","contmeasure":"","qtymeasure":"","ctrreceived":"","qtyyreceived":""};
        obj.purchasetypeflag=rows[i].Purchase_Type;
        obj.inwardno=rows[i].Inward_Bill_Number;
        obj.inwarddate=rows[i].Inward_Register_Date;
        obj.ponumber=rows[i].PO_Number;
        obj.podate=rows[i].PO_Date;
        obj.supname=rows[i].Supplier_ID;
        obj.itemdes=rows[i].Product_ID;
        obj.qtyreceived=(rows[i].Qty_Received)+(rows[i].Qty_measure);
        obj.qtyaccepted=rows[i].Qty_Accepted;
        obj.qtymeasure=rows[i].Qty_measure;
        obj.containerreceived=(rows[i].unit)+(rows[i].Unit_measure);
        obj.containeraccepted=rows[i].Unit_Accepted;
        obj.contmeasure=rows[i].Unit_measure;
        obj.remarks=rows[i].Remarks;
        obj.ctrreceived=rows[i].unit;
        obj.qtyyreceived=rows[i].Qty_Received;
        itemarr.push(obj);
      }

      //console.log(JSON.stringify(itemarr));
      //Item Response sending back to the server
      return callback(itemarr);
    //}
    //else
      //return callback("no items");
    //}
    //else{
    }
  });
}

//Function fetches expanded card item info
exports.Fnphysicqualifyexpanditemread=function(pagename,cond,status,callback) {
  //Fetches tables for this page
  var Config_tables = [];
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
    }
  }
  //console.log(JSON.stringify(cond));
  connection.query('SELECT * FROM OD_Inward_Material_Inspection where ? and ?',[cond,status], function(err, rows) {
    if(!err){
      //console.log(JSON.stringify(rows));
        if(rows.length>0) {
          return callback(rows);
        }
        else
        return callback("no items");
    }
    else
    console.log(err);
  });

}

//Function fetches the item info and update the status of the specific item
exports.FnPhysicqualifyitem=function(pagename,response,cond1,cond2,cond3,cond4,cond5,cond6,cond7,batchresponse,callback) {
  //fetching tables for this page
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  connection.query('SELECT * from OD_Inward_Material_Inspection WHERE ? and ? and ? ',[cond1,cond2,cond6], function(err, rows) {
    if(rows.length>0) {
      connection.query('SELECT * from OD_Inward_Material_Inspection WHERE ? and ? and ? and ?', [cond1, cond2, cond6, cond7], function (err, rows) {
        if(rows.length>0) {
          // console.log('same serial no');
          connection.query('UPDATE OD_Inward_Material_Inspection SET ? WHERE  ? and ? and ? and ?', [response, cond1, cond2, cond6,cond7], function (err, result) {
            if (!err)
              return callback("updated");
            else {
              console.log(err);
              return callback("not updated");
            }
          });
        }
        else
        {
          // console.log('diff serial no');
          return callback("exist");
        }
      });
    }
    else{
      connection.query('INSERT INTO OD_Inward_Material_Inspection SET ? ', [response], function (err, result) {
        if (!err) {
          connection.query('UPDATE OD_Sales_Inward_Material SET ? where ? and ?', [cond3, cond4, cond5], function (err, result) {
            if (!err){
              connection.query('INSERT INTO OD_Heat_To_Batch SET ? ', [batchresponse], function (err, result) {
              return callback("updated");
              });
            }
            else {
              console.log("error!" + err);
              return callback("not updated");
            }
          });
        }
        else {
          console.log(err);
          return callback("not updated");
        }
      });
    }
  });

}

//Function fetches expanded card item info
exports.Fnreadcontainercoil=function(pagename,cond1,cond2,callback) {
  //Fetches tables for this page
  var Config_tables = [];
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
    }
  }
  //console.log(JSON.stringify(cond));
  connection.query('SELECT * FROM OD_Inward_Material_Inspection where ? and ?',[cond1,cond2], function(err, rows) {
    if(!err){
      //console.log(JSON.stringify(rows));
      if(rows.length>0) {
        return callback(rows);
      }
      else
        return callback("no items");
    }
    else
      console.log(err);
  });

}


exports.Fnoldcontainerupdate=function(pagename,response,inwardregno,callback) {
  //fetching tables for this page
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  connection.query('INSERT INTO OD_Inward_Material_Inspection SET ?',[response], function (err, rows) {
    if (!err)
    {
      //connection.query('UPDATE OD_Inward_Material_Inspection SET ? WHERE ? and ?',[newupdatestatus,inwardregno,checkstatus], function (err, rows) {
      //if(!err){
        return callback("succ");
      //}
      //  else
      //  return callback("fail");
      //});
    }
    else {
      // console.log(err);
      return callback("fail");
    }
  });

}

exports.Fnphysicqualifyinwardacceptcheck=function(pagename,inwardregno,status,checkstatus,repeatflag,callback) {
  //fetching tables for this page
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  if(repeatflag=="1") {
    var queryy = "select * from OD_Sales_Inward_Material where new_Inward_Register_Number='" + inwardregno + "' and state='" + status + "' and unit=(select count(*) from OD_Inward_Material_Inspection where Inward_Register_Number='" + inwardregno + "' and status='" + checkstatus + "')";
    //console.log(queryy);
    connection.query(queryy, function (err, rows) {
      if (rows.length > 0)
        return callback("succ");
      else
        return callback("fail");
    });
  }
  if(repeatflag=="0"){
    var queryy = "select * from OD_Inward_Material_Inspection where Inward_Register_Number='" + inwardregno + "' and status='" + checkstatus + "'";
    //console.log(queryy);
    connection.query(queryy, function (err, rows) {
      if(!err) {
        //console.log(rows.length);
        if (rows.length > 0)
          return callback("succ");
        else
          return callback("fail");
      }
      else
      console.log(err);
    });
  }
}

exports.Fnoldphysicinsert=function(pagename,inwardregno,checkstatus,status,createdby,callback) {
  var queryy="select * from OD_Sales_Inward_Material where new_Inward_Register_Number='" + inwardregno + "' and state='" + checkstatus + "'";
  //console.log(queryy);
  connection.query(queryy, function (err, rows) {
  //console.log(rows);
    if(!err){
    var response= {
      Created_By:createdby,
      Purchase_Type: rows[0].Purchase_Type,
      Inward_Bill_Number: rows[0].Inward_Bill_Number,
      Inward_Register_Date: rows[0].Inward_Register_Date,
      PO_Number: rows[0].PO_Number,
      PO_Date: rows[0].PO_Date,
      Supplier_ID: rows[0].Supplier_ID,
      Product_ID: rows[0].Product_ID,
      Qty_Received: rows[0].Qty_Received,
      Qty_Accepted: rows[0].Qty_Accepted,
      unit: rows[0].unit,
      Unit_Accepted: rows[0].Unit_Accepted,
      Qty_measure: rows[0].Qty_measure,
      Unit_measure: rows[0].Unit_measure,
      Remarks: rows[0].Remarks,
      new_Inward_Register_Number: rows[0].new_Inward_Register_Number,
      state: "Old"+rows[0].state
    }
      //console.log(response);
    connection.query('insert into OD_Sales_Inward_Material set ?',[response], function (err, rows) {
      if(!err)
        return callback("succ");
      else
        return callback("fail");
    });
  }
  else
  console.log(err);

  });
}

exports.Fnphysicqualified=function(pagename,inwardregno,checkstatus,status,createdby,callback) {
  var queryy="update OD_Sales_Inward_Material set Unit_Accepted=(select count(*) from OD_Inward_Material_Inspection where Inward_Register_Number='" + inwardregno + "' and status='" + status + "' and Inspection_Status='Approved'),Qty_Accepted=(select sum(Quantity) from OD_Inward_Material_Inspection where Inward_Register_Number='" + inwardregno + "' and status='" + status + "' and Inspection_Status='Approved'),state='"+status+"',Created_by='"+createdby+"' where new_Inward_Register_Number='" + inwardregno + "' and state='" + checkstatus + "' ";
  //console.log(queryy);
  connection.query(queryy, function (err, rows) {
    if(!err) {
      //var queryy1="UPDATE OD_Inward_Material_Inspection SET status='"+status+"' where Inward_Register_Number='"+inwardregno+"' and status='"+checkstatus+"'";
      //connection.query(queryy1, function (err, rows) {
      //if(!err){
      return callback({"flag": "updated", "state": status});
    }
      //}
    else
      {
        console.log(err);
        return callback({"flag": "not updated"});
      }

      });

  //});
}

exports.Fnspecificationitemread=function(pagename,inwardregno,checkstatus,productid,callback) {
  //var queryy="SELECT * FROM MD_Quality_Parameter";
  /*var queryy="select * from MD_Quality_Parameter where Quality_Parameter_ID in"+
  "(select Quality_Parameter_ID from OD_Item_Quality_Parameter where Item_ID="+
    "(select Item_ID from MD_Item where Item_Name="+
    "(SELECT Product_ID from OD_Sales_Inward_Material where new_Inward_Register_Number='"+inwardregno+"' and state='"+checkstatus+"')))";*/
  var queryy="select distinct (select Quality_Parameter_Name from MD_Quality_Parameter m where m.Quality_Parameter_ID=o.Quality_Parameter_ID) as Quality_Parameter_Name,Min_Value,Max_Value,Unit_Measure,Quality_Flag from OD_Item_Quality_Parameter o where Quality_Parameter_ID in"+
    "(select Quality_Parameter_ID from OD_Item_Quality_Parameter where Item_ID=(select Item_ID from MD_Item where Item_Name=(SELECT Product_ID from OD_Sales_Inward_Material where new_Inward_Register_Number='"+inwardregno+"' and state='"+checkstatus+"'))) and Item_ID=(select Item_ID from MD_Item where Item_Name='"+productid+"')";
  // console.log(queryy);
  connection.query(queryy, function (err, rows) {
    if(!err)
    {
      if(rows.length>0){
        logfile.write('\nQuality parameter read: Items found');
        return callback(rows);
      }
      else{
        logfile.write('\nQuality parameter read: no items found ');
        return callback("no items");
      }
    }
    else
      logfile.write('\nQuality parameter read: '+err);

  });
}


exports.Fnupdatequalityparameter=function(pagename,response,callback) {

  connection.query('SELECT Test_ID FROM MD_Quality_Test_ID',function (err, rows) {
    if(!err) {
      response.Test_ID=rows[0].Test_ID;
      connection.query('INSERT INTO OD_Inward_Material_Quality_Test SET ?', [response], function (err, rows) {
        if (!err) {
          logfile.write('\nQuality parameter update: success');
          return callback("succ");
        }
        else {
         // console.log(err);
          logfile.write('\nQuality parameter update: fail'+err);
          return callback("fail");
        }
      });
    }
  });
}

exports.Fnqualityparametersequenceupdate=function(pagename,callback) {

  connection.query('SELECT Test_ID FROM MD_Quality_Test_ID',function (err, rows) {
    if(!err) {
      var response={Test_ID:parseInt(rows[0].Test_ID)+1};
      connection.query('UPDATE MD_Quality_Test_ID SET ?',[response],function (err, rows) {
        if (!err) {
          logfile.write('\nQuality parameter test id update: success');
          return callback("succ");
        }
        else{
          logfile.write('\nQuality parameter test id update: fail');
          return callback("fail");
        }
      });
    }
    else
    console.log(err);
  });
}

exports.Fnqualityparameterdisplay=function(pagename,cond1,cond2,callback) {

  connection.query('SELECT * FROM OD_Inward_Material_Quality_Test WHERE ? and ?',[cond1,cond2],function (err, rows) {
    if(!err) {
      if (rows.length > 0){
        logfile.write('\nQuality parameter display: items found');
        return callback(rows);
      }

      else{
        logfile.write('\nQuality parameter display: no items');
        return callback("no items");
      }
    }
    else{
      logfile.write('\nQuality parameter display: '+err);
    console.log(err);
  }
    });
}


//Function which reads the item info after updating to the next state
exports.FnBackwardflowitem=function(pagename,cond,cond1,callback){
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond,cond1], function(err, rows, fields) {
    var itemarr=[];
    /*for(var i=0;i<rows.length;i++)
    {
      var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","state":"","inwardregno":""};
      obj.inwardno=rows[i].Inward_Bill_Number;
      obj.inwarddate=rows[i].Inward_Register_Date;
      obj.ponumber=rows[i].PO_Number;
      obj.podate=rows[i].PO_Date;
      obj.state=rows[i].state;
      obj.inwardregno=rows[i].new_Inward_Register_Number;

      itemarr.push(obj);
    }*/
    if(!err){
      return callback(rows);
    }
    else
      return callback("no items");
  });
}

//Function for outward seq no generation
exports.FnOutwardSeq=function(pagename,cond,callback) {
// console.log(cond);
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
    //console.log(Config_tables);
  }
  dummyno = {
    dummy_column : 1
  };

  //Fetching inward bill no if it is new it will insert data otherwise it wont
  connection.query('SELECT '+ Config_columns[0] +' FROM '+ Config_tables[1] +' WHERE ?',[cond],function(error,rows) {
    if (!error) {
      //console.log(rows.length);
      if (rows.length == 0) {

        connection.query('INSERT INTO ' + Config_tables[0] + ' SET ?', [dummyno], function (err, result) {
          if (!err) {
            //console.log('seq generated!');
            return callback("succ");
            //res.status(200).json({'returnval': "succ"});
          }
          else {
            //res.status(200).json({'returnval': "fail"});
            return callback("fail");
          }
        });
      }
      else
        return callback("exists");
    }
  });
}

//Function to save outwardslip items
exports.FnOutwardItemSave=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
    //console.log(Config_tables);
  }
  connection.query('SELECT '+Config_columns[0]+' FROM '+Config_tables[0]+' ORDER BY '+Config_columns[0]+' DESC LIMIT 1', function(err, rows, fields) {
    if(!err)
    {
      var idd="ORN"+rows[0].Outward_Register_Number;

      response.Outward_Register_Number=idd;
      //console.log( response.Outward_Register_Number);
      connection.query('insert into '+Config_tables[1]+' set ?',[response],function(err,result){
        if(!err)
        {
          //console.log("Inserted!"+idd);
          return callback(idd);
          //res.status(200).json({'outwardregno': idd});
        }
        else{
          //console.log("Not Inserted!"+idd+err);
          return callback("not okay");
          //res.status(200).json({'outwardregno': 'not okay'});
        }
      });
    }
  });
}

//Function to fetch search items
exports.FnSearchItems=function(pagename,rnflag,invoiceflag,itemflag,cond,callback) {
  //console.log(rnflag+" "+invoiceflag+" "+itemflag);
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
  }
  var inflag;
  var itflag;
  if(rnflag=="0"||invoiceflag=="1"||itemflag=="1"){
    //console.log('inward');
    connection.query('SELECT distinct '+Config_columns[0]+','+Config_columns[1]+','+Config_columns[2]+' FROM '+Config_tables[0]+' WHERE ?',[cond], function(err, rows, fields) {
      var itemarr=[];
      for(var i=0;i<rows.length;i++)
      {
        var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","state":"","inwardregno":""};
        obj.inwardno=rows[i].Inward_Bill_Number;
        obj.inwarddate=rows[i].Inward_Register_Date;
        obj.ponumber=rows[i].PO_Number;
        obj.podate=rows[i].PO_Date;
        obj.state=rows[i].state;
        obj.inwardregno=rows[i].new_Inward_Register_Number;
        itemarr.push(obj);
      }
      if(!err){
        //console.log(JSON.stringify(itemarr));
        if(itemarr.length==0)
        {
          if(invoiceflag=="1") {

            cond = {"Invoice_No": cond.Inward_Bill_Number};
          }
          if(itemflag=="1")
          {

            cond={"Product_ID":cond.Product_ID};
          }
          if(invoiceflag=="1"||itemflag=="1") {
            connection.query('SELECT distinct ' + Config_columns[3] + ',' + Config_columns[4] + ',' + Config_columns[5] + ' FROM ' + Config_tables[1] + ' WHERE ?', [cond], function (err, rows, fields) {
              var itemarr = [];
              rnflag = "1";
              if (!err) {
                for (var i = 0; i < rows.length; i++) {
                  var obj = {
                    "inwardno": "",
                    "inwarddate": "",
                    "ponumber": "",
                    "podate": "",
                    "state": "",
                    "inwardregno": ""
                  };
                  obj.inwardno = rows[i].Invoice_No;
                  obj.inwarddate = rows[i].Out_Date;
                  //obj.ponumber=rows[i].PO_Number;
                  //obj.podate=rows[i].PO_Date;
                  obj.state = rows[i].state;
                  obj.inwardregno = rows[i].Outward_Register_Number;
                  itemarr.push(obj);
                }
                //console.log(JSON.stringify(itemarr));
                //res.status(200).json({"itemarr":itemarr,"rnflag":rnflag});
                if(itemarr.length==0&&invoiceflag=="1")
                //inflag="no items";
                return callback({"itemarr": itemarr, "rnflag": rnflag,"inflag":"no items","itemflag":""});
                else if(itemarr.length==0&&itemflag=="1")
                  //itflag="no items";
                return callback({"itemarr": itemarr, "rnflag": rnflag,"inflag":"","itemflag":"no items"});
                else
                  return callback({"itemarr": itemarr, "rnflag": rnflag,"inflag":"","itemflag":""});

              }
              else
                console.log("Item not in outward" + err);
            });
          }
          else
            return callback({"itemarr": itemarr, "rnflag": rnflag,"inflag":"","itemflag":""});
        }
        else {
          //res.status(200).json({"itemarr":itemarr,"rnflag":rnflag});
          return callback({"itemarr":itemarr,"rnflag":rnflag,"inflag":"","itemflag":""});
        }
      }
      else
        console.log("Item not in inward"+err);
    });
  }
  else if(rnflag=="1"){

    connection.query('SELECT distinct '+Config_columns[3]+','+Config_columns[4]+','+Config_columns[5]+' FROM '+Config_tables[1]+' WHERE ?',[cond], function(err, rows, fields) {
      var itemarr=[];
      if(!err){
        for(var i=0;i<rows.length;i++)
        {
          var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","state":"","inwardregno":""};
          obj.inwardno=rows[i].Invoice_No;
          obj.inwarddate=rows[i].Out_Date;
          //obj.ponumber=rows[i].PO_Number;
          //obj.podate=rows[i].PO_Date;
          obj.state=rows[i].state;
          obj.inwardregno=rows[i].Outward_Register_Number;
          itemarr.push(obj);
        }
        //console.log(JSON.stringify(itemarr));
        //res.status(200).json({"itemarr":itemarr,"rnflag":rnflag});
        return callback({"itemarr":itemarr,"rnflag":rnflag,"inflag":"","itemflag":""});
      }
      else
        console.log(err);
    });
  }
}

//Function to fetch searched IRN no items
exports.FnSearchExpandItemFetch=function(pagename,cond,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }
  var n=0;
  var state="";
  var temp="";
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond], function(err, rows) {
    if(!err)
    {
      var itemarr=[];
      for(var i=0;i<rows.length;i++)
      {
        var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","state":""};
        obj.inwardno=rows[i].Inward_Bill_Number;
        obj.inwarddate=rows[i].Inward_Register_Date;
        obj.ponumber=rows[i].PO_Number;
        obj.podate=rows[i].PO_Date;
        obj.supname=rows[i].Supplier_ID;
        obj.itemdes=rows[i].Product_ID;
        obj.qtyreceived=(rows[i].unit+rows[i].Unit_measure)+" / "+(rows[i].Qty_Received+rows[i].Qty_measure);
        obj.qtyaccepted=(rows[i].Unit_Accepted+rows[i].Unit_measure)+" / "+(rows[i].Qty_Received+rows[i].Qty_measure);
        obj.remarks=rows[i].Remarks;
        obj.state=rows[i].state;
        if(temp!=rows[i].state){
          temp=rows[i].state;
          n=n+1;
        }
        itemarr.push(obj);
      }
      return callback({"itemarr":itemarr,"statecount":n,"state":temp});
    }
    else{
    }
  });
}

//Function fetches the expended outward search card item info
exports.FnOutwardSearchExpandItemFetch=function(pagename,cond,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond], function(err, rows) {
    if(!err)
    {
      var itemarr=[];
      for(var i=0;i<rows.length;i++)
      {
        var obj={"itemdes":"","quantity":"","weight":""};
        obj.itemdes=rows[i].Product_ID;
        //obj.qtyordered=rows[i].Qty;
        obj.quantity=rows[i].Quantity;
        obj.weight=rows[i].Weight;        //console.log(rows[i].state);
        itemarr.push(obj);
      }
      return callback({"itemarr":itemarr});
    }
    else{
      console.log(err);
    }
  });

}

//Function for outward seq no generation
exports.FnIntentitemSeq=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }
  dummyno = {
    dummy_column : 1
  };

  connection.query('INSERT INTO '+Config_tables[0]+' SET ?',[dummyno],function(err,result){
    if(!err)
    {
      // console.log('seq generated!');
      return callback("succ");
    }
    else
    {
      return callback("fail");
    }
  });
}

//Function which write intent item info
exports.FnIntentItemWrite=function(pagename,response,loggeduser,itemdes,callback) {
 var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
  }
var query="SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID =  '"+loggeduser+"' AND department_ID = (SELECT DISTINCT department_ID FROM MD_Item m JOIN OD_Intent_Item_Type o USING ( Item_Type_ID ) WHERE m.Item_Name =  '"+itemdes+"' ) ";
console.log('..........................................................................');
console.log(query);
  connection.query(query,function(err,rows,result){
   if(response.state!='spot'){
   if(rows.length==0){
     response.state='external';
   }
   else{
     response.state='internal';
   }
   }

  //console.log(response.state+"  "+response.PO_Number);
  connection.query('SELECT '+Config_columns[0]+' FROM '+Config_tables[0]+' ORDER BY '+Config_columns[0]+' DESC LIMIT 1', function(err, rows, fields) {
    if(!err)
    {
      //console.log(response.state);
      var idd="INT"+rows[0].Intent_Register_Number;
      if(response.state=='external'){
        response.Intent_State='Created';
      }
      else if(response.state=='internal')
        response.Intent_State='Created';
      else if(response.state=='spot')
        response.Intent_State='SpotCreated';
        response.Intent_Register_Number=idd;
        //console.log(response.Product_ID);
      var queryy1="SELECT Item_Type_ID from MD_Item where Item_Name='"+response.Product_ID+"'";
      connection.query(queryy1,function(err,rows,result){
        //console.log(JSON.stringify(rows));
      if(rows.length>0){
        for(var i=0;i<rows.length;i++)
      response.Item_Type_ID=rows[i].Item_Type_ID;
        //console.log(response.Item_Type_ID);
      connection.query('insert into '+Config_tables[1]+' set ?',[response],function(err,result){
        if(!err)
        {
          return callback(idd);
        }
        else{
          return callback("not okay");
        }
      });
    }
    else
      console.log(err);
    });
    }
  });
});
}

//Function which fetch the intent item info
exports.FnIntentItemRead=function(pagename,loggeduser,loggedrole,state,callback) {
  var queryy;
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
      Config_columns = obj[i].columns;
    }
  }

    var itemarr=[];

      if(loggedrole=="Purchase manager")
        //queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved','POCreated') and os.state='external' order by os.Intent_Register_Number DESC";
        queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where (os.Intent_State in('Approved','POCreated','POSent') and os.state='external') or (os.Intent_State in('SpotCreated') and os.state='spot') order by os.Intent_Register_Number DESC";
      else if(loggedrole=="Stores manager")
        //queryy="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where (os.Intent_State in('Approved','Supplied') and os.state='internal')";
        queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved','Supplied') and os.Item_Type_ID in(select distinct Item_Type_ID from OD_Stores_Intent_Items where (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='external') or (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='internal')) or (os.Intent_State in('Approved') and os.state='internal') order by os.Intent_Register_Number DESC";
      else
        queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Created','Supplied') and os.Item_Type_ID in(select distinct Item_Type_ID from OD_Stores_Intent_Items where (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='external') or (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='internal')) order by os.Intent_Register_Number DESC";

      console.log(queryy);

      connection.query(queryy,function(err, rows, fields) {

      if(!err){
        //console.log('coming..');
        for(var i=0;i<rows.length;i++)
        {
          var obj={"duedate":"","Itemno":"","intentregno":"","intentdate":"","state":"","itemdes":"","quantity":"","unit":"","intentstate":"","itemid":"","itemlocation":""};
          obj.itemno=rows[i].Intent_Register_Number+rows[i].Item_ID;
          obj.intentregno=rows[i].Intent_Register_Number;
          obj.intentdate=rows[i].Intent_Date;
          obj.itemdes=rows[i].Product_ID;
          obj.unit=rows[i].unit+" "+rows[i].Unit_Measure;
          obj.quantity=rows[i].Quantity+" "+rows[i].Quantity_Measure;
          obj.intentstate=rows[i].Intent_State;
          obj.state=rows[i].state;
          obj.itemid=rows[i].Item_ID;
          obj.itemlocation=rows[i].Store_Location_Name;
          obj.duedate=rows[i].Due_Date;
          itemarr.push(obj);
        }
        //console.log(JSON.stringify(itemarr));
       return callback(itemarr);
      }
      else
        console.log(err);
    });
    //}
    //return callback(itemarr);
  //});
}


//Function which fetch the intent item info
exports.FnIntentSupplyItemRead=function(pagename,loggeduser,intentstate,state,callback) {
  /*var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
      Config_columns = obj[i].columns;
    }
  }*/
   // var queryy="select distinct Intent_Register_Number,Intent_Date from OD_Stores_Intent_Items where Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"') )";

    //var queryy="select distinct Intent_Register_Number,Intent_Date from OD_Stores_Intent_Items where (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='external') or (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Owner=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='internal') and Intent_State='"+state+"' and state='"+state+"'";

      //var queryy="select distinct Intent_Register_Number,Intent_Date from OD_Stores_Intent_Items where Intent_State='"+intentstate+"' and state='"+state+"'";

    //var queryy="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State='"+intentstate+"' and os.state='"+state+"'";

    var queryy="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved','POCreated') and state='external'))";

    var queryy1="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved') and state='internal'))";

     // console.log(queryy);
    //cond={"state":state};
    //connection.query('SELECT distinct '+Config_columns[0]+','+Config_columns[1]+' FROM '+Config_tables[0]+' WHERE ? ORDER BY '+Config_columns[0]+' DESC',[cond], function(err, rows, fields) {
      connection.query(queryy,function(err, rows, fields) {
      var itemarr=[];
     if(!err){
        //console.log('coming..');
        for(var i=0;i<rows.length;i++)
        {
          var obj={"Itemno":"","intentregno":"","intentdate":"","state":"","itemdes":"","quantity":"","unit":"","intentstate":"","itemid":"","itemlocation":""};
          obj.itemno=rows[i].Intent_Register_Number+rows[i].Item_ID;
          obj.intentregno=rows[i].Intent_Register_Number;
          obj.intentdate=rows[i].Intent_Date;
          obj.itemdes=rows[i].Product_ID;
          obj.unit=rows[i].unit+" "+rows[i].Unit_Measure;
          obj.quantity=rows[i].Quantity+" "+rows[i].Quantity_Measure;
          obj.intentstate=rows[i].Intent_State;
          obj.state=rows[i].state;
          obj.itemid=rows[i].Item_ID;
          obj.itemlocation=rows[i].Store_Location_Name;
          itemarr.push(obj);
        }
        //console.log(JSON.stringify(itemarr));
       return callback(itemarr);
      }
      else
        console.log(err);
    });

}

//Function fetches the expanded intent item card info
exports.FnIntentExpandItemFetch=function(pagename,cond,cond1,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond,cond1], function(err, rows) {
    if(!err)
    {
      var itemarr=[];
      for(var i=0;i<rows.length;i++)
      {
        var obj={"intentstate":"","specification":"","itemdes":"","quantity":"","qtymeasure":"","unit":"","unitmeasure":"","remark":"","createdby":"","state":""};
        obj.itemdes=rows[i].Product_ID;
        obj.specification=rows[i].Specification;
        obj.quantity=rows[i].Quantity;
        obj.qtymeasure=rows[i].Quantity_Measure;
        obj.unit=rows[i].unit;
        obj.unitmeasure=rows[i].Unit_Measure;
        obj.remark=rows[i].Remarks;
        obj.intentstate=rows[i].Intent_State;
        obj.state=rows[i].state;
        /*if(rows[i].state=='internal')
        obj.state='No';
        if(rows[i].state=='external')
        obj.state='Yes';*/
        obj.createdby=rows[i].Intent_Created_By;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback({"itemarr":itemarr});
    }
    else{
      console.log(err);
    }
  });

}

//Function to promote intent
exports.FnIntentStateUpdate=function(pagename,cond,cond1,updatecolumn,updaterolecolumn,updatebycolumn,updatebydate,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  //console.log(updaterolecolumn);

  //console.log(JSON.stringify(ponumber)+" "+JSON.stringify(updatecolumn)+" "+JSON.stringify(updaterolecolumn)+" "+JSON.stringify(cond)+" "+JSON.stringify(cond1));
  connection.query('UPDATE OD_Stores_Intent_Items SET ? , ? , ? ,? WHERE ? and ?',[updatecolumn,updaterolecolumn,updatebycolumn,updatebydate,cond,cond1], function(err, rows) {
    if(!err)
    {
      //console.log('updated');
       return callback({"returnval":"succ"});

    }
    else{
      //console.log(err);
      return callback({"returnval":"fail"});
    }
  });

}

//Function to write item info added from admin page
exports.FnAddItemWrite=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  cond={Item_ID:response.Item_ID}
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond],function(err, rows, fields) {
    if(!err) {
      if(rows.length==0) {
        connection.query('INSERT INTO '+Config_tables[0]+' SET ?', [response], function (err, result) {
          if (!err) {
            return callback("succ");
          }
          else {
            // console.log("Not Inserted!"+err);
            return callback("fail");
          }
        });
      }
      else{
        return callback("duplicate entry");
	  }
    }
  });
}


//Function to write item info added from admin page
exports.FnAddItemWriteSupplier=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  cond={Item_ID:response.Item_ID}
  cond1={Item_Supplier_ID:response.Item_Supplier_ID}
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? AND ?',[cond,cond1],function(err, rows, fields) {
    if(!err) {
      if(rows.length==0) {
        connection.query('INSERT INTO '+Config_tables[0]+' SET ?', [response], function (err, result) {
          if (!err) {
            return callback("succ");
          }
          else {
            // console.log("Not Inserted!"+err);
            return callback("fail");
          }
        });
      }
      else{
        return callback("duplicate entry");
	  }
    }
  });
}


//Function to write item info added from admin page
exports.FnAddItemWriteCustomer=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  cond={Item_ID:response.Item_ID}
  cond1={Item_Customer_ID:response.Item_Customer_ID}
  connection.query('SELECT * FROM OD_Item WHERE ? AND ?',[cond,cond1],function(err, rows, fields) {
    if(!err) {
      if(rows.length==0) {
        connection.query('INSERT INTO OD_Item SET ?', [response], function (err, result) {
          if (!err) {
            return callback("succ");
          }
          else {
            // console.log("Not Inserted!"+err);
            return callback("fail");
          }
        });
      }
      else{
        return callback("duplicate entry");
    }
    }
  });
}


//Function fetches itemtype info
exports.FnAddItemPurchasetype=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+'',function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"purchasetypeid":"","purchasetypename":""};
        obj.purchasetypeid=rows[i].Purchase_Type_ID;
        obj.purchasetypename=rows[i].Purchase_Type_Name;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback(itemarr);
    }
    else
      console.log(err);
  });

}
//Function fetches itemtype info
exports.FnAddItemRead=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+'',function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"itemtypeid":"","itemtypename":""};
        obj.itemtypeid=rows[i].Item_Type_ID;
        obj.itemtypename=rows[i].Item_Type_Name;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback(itemarr);
    }
    else
      console.log(err);
  });

}
//Function fetches group type info
exports.FnAddItemgroupRead=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+'',function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"itemgroupid":"","itemgroupname":""};
        obj.itemgroupid=rows[i].Item_Group_ID;
        obj.itemgroupname=rows[i].Item_Group_Name;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback(itemarr);
    }
    else
      console.log(err);
  });
  //console.log(Config_tables);

}

//Function fetches supplier info
exports.FnItemsupplierRead=function(pagename,itemid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  // console.log('itemid.....'+itemid);
  var queryy="SELECT * FROM "+Config_tables[0]+" where Status='Approved' and Supplier_ID not in(SELECT Item_Supplier_ID from OD_Item where Item_ID='"+itemid+"')";
  //console.log(queryy);
  connection.query(queryy,function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"itemsupplierid":"","itemsuppliername":""};
        obj.itemsupplierid=rows[i].Supplier_ID;
        obj.itemsuppliername=rows[i].Supplier_Name;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback(itemarr);
    }
    else
      console.log(err);
  });
  //console.log(Config_tables);

}

//Function fetches supplier info
exports.FnContainerRead=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="SELECT * FROM MD_Container";
  //console.log(queryy);
  connection.query(queryy,function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      return callback(rows);

    }
    else
      console.log(err);
  });
  //console.log(Config_tables);

}


//Function fetches supplier info
exports.FnUnitRead=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="SELECT * FROM MD_Unit";
  //console.log(queryy);
  connection.query(queryy,function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      return callback(rows);
    }
    else
      console.log(err);
  });
  //console.log(Config_tables);

}

//Function fecthes searched item info
exports.FnAddsearchItem=function(pagename,cond,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"storeslocation":"","itemoptionalsupplier":"","itemsupplier":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""};
        //obj.itemoptionalsupplier=rows[i].Item_Optional_Supplier_ID;
        //obj.itemsupplier=rows[i].Item_Supplier_ID;
        obj.itemid=rows[i].Item_ID;
        obj.itemname=rows[i].Item_Name;
        obj.itemdes=rows[i].Item_Description;
        obj.container=rows[i].Container;
        obj.quantity=rows[i].UOM;
        obj.itemgroup=rows[i].Item_Group_ID;
        obj.itemtype=rows[i].Item_Type_ID;
        obj.purchasetype=rows[i].Item_Purchase_Type_ID;
        obj.storeslocation=rows[i].Store_Location_ID;
        itemarr.push(obj);
      }
        return callback(itemarr);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
  }

//Function which updates item info
exports.FnAddItemUpdate=function(pagename,cond,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('UPDATE '+Config_tables[0]+' SET ? WHERE ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnAddSupplier=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  response.Status=Config_columnvalues[0];
  /*connection.query('INSERT INTO ' + Config_tables[0] + ' SET ?', [response], function (err, result) {
        if(!err)
          return callback("succ");
        else
          return callback("fail");
  });*/
  connection.query('SELECT ID FROM MD_Supplier_Sequence',function(err,rows) {
    if(rows.length>0) {
      response.Supplier_ID=response.Supplier_ID+rows[0].ID;
      var newid=parseInt(rows[0].ID)+1;
      var updateval={"ID":newid};
      connection.query('INSERT INTO ' + Config_tables[0] + ' SET ?', [response], function (err, result) {
        if (!err) {
          connection.query('UPDATE MD_Supplier_Sequence set ?', [updateval], function (err, result) {
            if(!err)
            return callback({"msg":"succ","id":response.Supplier_ID});
            //return callback("succ");
            else
            return callback("fail");
          });
        }
        else {
          return callback("fail");
        }
      });

    }
  });
}

//Function which update customer contact info
exports.Fnsupplieraddcontact=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Supplier_Contact SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });
}

//Function which update supplier contact info
exports.Fnsupplierreadcontact=function(pagename,supplierid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Supplier_Contact WHERE ?',[supplierid],function(err,rows){
    if(rows.length>0)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });
}

//Function which add customer tax info
exports.Fnsuppliertaxadd=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Supplier_Tax SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function which add customer excise info
exports.Fnsupplierexciseadd=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Supplier_Excise SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}


//Function which addpayment info
exports.FnAddPayment=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO '+Config_tables[0]+' SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnUpdateSupplier=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Supplier_ID:response.Supplier_ID};
  connection.query('UPDATE MD_Purchase_Supplier SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnSupplierUpdatetax=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Supplier_ID:response.Supplier_ID};
  //console.log(cond);
  connection.query('Update MD_Supplier_Tax SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnSupplierUpdateexcise=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Supplier_ID:response.Supplier_ID};
  //console.log(cond);
  connection.query('Update MD_Supplier_Excise SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function which addpayment info
exports.FnUpdatePayment=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Supplier_ID:response.Supplier_ID};
  //console.log(cond);
  //console.log(response);
  connection.query('UPDATE MD_Supplier_Payment SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function fecthes searched item info
exports.Fnreadsupplier=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Purchase_Supplier WHERE ?',[cond],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){

        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}

//Function fecthes searched item info
exports.Fnsuppliertaxread=function(pagename,supplierid,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Supplier_Tax WHERE ?',[supplierid],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){

        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}

//Function fecthes searched item info
exports.Fnsupplierexciseread=function(pagename,supplierid,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Supplier_Excise WHERE ?',[supplierid],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){

        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}

//Function fecthes searched item info
exports.Fnreadpayment=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Supplier_Payment WHERE ?',[cond],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){
        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}
  //Function fecthes searched item info
  exports.Fnreaditeminfo=function(pagename,cond,id,callback) {
    //console.log(pagename+"  "+JSON.stringify(cond));
    var Config_tables=[];
    for(var i=0;i<obj.length;i++){
      if(obj[i].name==pagename){
        Config_tables=obj[i].value;
      }
    }
    var querry="SELECT distinct m.Item_Name,o.Item_Supplier_ID,Item_ID FROM MD_Item m JOIN OD_Item o USING (Item_ID) WHERE o.Item_Supplier_ID ='"+id+"'";
    //console.log(querry);
    //connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond],function(err, rows, fields) {
	connection.query(querry,function(err, rows, fields) {
      var itemarr=[];

     if(!err){
	         if(rows.length>0){
	         /*for(var i=0;i<rows.length;i++)
	         {
	           var obj={"itemoptionalsupplier":"","itemsupplier":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""};
	           //obj.itemoptionalsupplier=rows[i].Item_Optional_Supplier_ID;
	           //obj.itemsupplier=rows[i].Item_Supplier_ID;
	           obj.itemid=rows[i].Item_ID;
	           obj.itemname=rows[i].Item_Name;
	           obj.itemdes=rows[i].Item_Description;
	           obj.container=rows[i].Container;
	           obj.quantity=rows[i].UOM;
	           obj.itemgroup=rows[i].Item_Group_ID;
	           obj.itemtype=rows[i].Item_Type_ID;
	           obj.purchasetype=rows[i].Item_Purchase_Type_ID;
	           itemarr.push(obj);

	         }*/
	         //console.log(JSON.stringify(itemarr));
	           return callback(rows);
	         }
	         else{
	           return callback("no item");
	         }
	       }
	       else
      		console.log(err);
    });
  }

//Function fecthes searched item info
exports.Fnitemstoresread=function(pagename,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM '+Config_tables[0],function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      if(rows.length>0){
        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
  }

//Function fecthes the role info of the intent items
exports.Fnintentroleread=function(pagename,intentno,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

var intentregno={Intent_Register_Number:intentno};

var intqueryy="insert into OD_Intent_Item_Transaction_Role(Intent_Register_Number,Intent_Date,Intent_State,state,"+
"Unit_Measure,Quantity_Measure,Product_ID,unit,Quantity,Item_ID,Item_Type_ID,Store_Location_Name,Department_ID,Intent_Owner,Intent_Approver,Intent_Supply,Intent_Accept)"+
"SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,"+
"os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,"+
"item.Item_Type_ID,wh.Store_Location_Name,type.Department_ID,type.Intent_Owner,"+
"type.Intent_Approver,type.Intent_Supply,type.Intent_Owner as Intent_Accept from OD_Stores_Intent_Items os "+
"join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh "+
"on(item.Store_Location_ID=wh.Store_Location_ID)"+
"join OD_Intent_Item_Type type on(type.Item_Type_ID=item.Item_Type_ID) and os.state in"+
"(select state from OD_Stores_Intent_Items where Intent_Register_Number='"+intentno+"')"+
"and os.Intent_Register_Number='"+intentno+"'";

var extqueryy="insert into OD_Intent_Item_Transaction_Role(Intent_Register_Number,Intent_Date,Intent_State,state,"+
"Unit_Measure,Quantity_Measure,Product_ID,unit,Quantity,Item_ID,Item_Type_ID,Store_Location_Name,Department_ID,Intent_Owner,Intent_Approver,Intent_PO,Intent_Accept)"+
"SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,"+
"os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,"+
"item.Item_Type_ID,wh.Store_Location_Name,type.Department_ID,type.Intent_Owner,"+
"type.Intent_Approver,type.Intent_PO,type.Intent_Accept from OD_Stores_Intent_Items os "+
"join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh "+
"on(item.Store_Location_ID=wh.Store_Location_ID)"+
"join OD_Intent_Item_Type type on(type.Item_Type_ID=item.Item_Type_ID) and os.state in"+
"(select state from OD_Stores_Intent_Items where Intent_Register_Number='"+intentno+"')"+
"and os.Intent_Register_Number='"+intentno+"'";
var state;

//console.log(queryy);

connection.query('SELECT state from OD_Stores_Intent_Items where ?',[intentregno],function(err,rows,fields) {

  if(rows.length>0){

      if(rows[0].state=="internal"){
        connection.query(intqueryy,function(err,fields) {
        if(!err)
        return callback("succ");
        else
        return callback("fail");
        });
      }
      else
      {
      connection.query(extqueryy,function(err,fields) {
      if(!err)
      return callback("succ");
      else
      return callback("fail");
      });
      }
    }
});
}


//Function fecthes the promote role info of the intent items
exports.Fnpromoteroleread=function(pagename,intentno,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

connection.query('SELECT *  from OD_Intent_Item_Transaction_Role where ?',[intentno],function(err,rows,fields) {
if(!err){
if(rows.length>0){
return callback(rows);
}
else
console.log(err);

}

});

}

//Function fecthes outward items
exports.Fnoutwarditemfetch=function(pagename,outdate,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

connection.query('SELECT *  from OD_Sales_Outward_Material where ?',[outdate],function(err,rows,fields) {
if(!err){
  //console.log(rows);
return callback(rows);
}
else
console.log(err);
});

}

//Function fecthes outward items based on date range
exports.Fnoutwarditemfromtofetch=function(pagename,fromdate,todate,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

var queryy="SELECT *  from OD_Sales_Outward_Material where Out_Date between '"+fromdate+"' and '"+todate+"'";
//console.log(queryy);
connection.query(queryy,function(err,rows,fields) {
if(!err){
  //console.log(rows);
return callback(rows);
}
else
console.log(err);
});

}

//Function fecthes intent items based on intentno to create po
exports.Fnintentpoitemread=function(pagename,intentno,itemdes,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

var queryy="select si.Product_ID,od.Item_ID,od.Item_Supplier_ID,ps.Supplier_Name from OD_Stores_Intent_Items si "+
"join MD_Item md on(si.Product_ID=md.Item_Name) join OD_Item od on(md.Item_ID=od.Item_ID) join MD_Purchase_Supplier ps "+
"on(od.Item_Supplier_ID=ps.Supplier_ID) where si.Intent_Register_Number='"+intentno+"' and si.Product_ID='"+itemdes+"'";

//console.log(queryy);

connection.query(queryy,function(err,rows,fields) {
if(!err){
  //console.log(rows);
return callback(rows);
}
else
console.log(err);
});

}

//Function to create poforan item in an intent
exports.Fnitempocreate=function(pagename,response,callback) {
  //console.log(JSON.stringify(intentno));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var ponumber='';

 // dummyno = {
              // dummy_column : 1
          // };

  connection.query('SELECT PO_Number FROM Auto_PO_Number',function(err,rows,result){
  if(!err)
    {
     //console.log('seq generated!');
     ponumber=parseInt(rows[0].PO_Number)+1;
     //connection.query('SELECT PO_Number FROM Auto_PO_Number order by PO_Number desc',function(err,rows,result){
      //if(!err){
        response.PO_Number=ponumber+String.fromCharCode('65');
        var pono={PO_Number:ponumber};
        connection.query('INSERT INTO OD_Purchase_Order SET ?',[response],function(err,fields) {
        if(!err){
        //console.log(rows);
        connection.query('UPDATE Auto_PO_Number set ?',[pono],function(err,rows,result){
        if(!err)
        return callback('succ');
        else
        return callback('fail');
        });
        }

        });
      //}
      //else
        //console.log(err);
     //});
    }
  });


  //Generating inward sequence no
  /*connection.query('INSERT INTO Auto_PO_Number set ?',[dummyno],function(err,result){
  if(!err)
    {
     console.log('seq generated!');
     connection.query('SELECT PO_Number FROM Auto_PO_Number order by PO_Number desc',function(err,rows,result){
      if(!err){
        response.PO_Number=rows[0].PO_Number+String.fromCharCode('65');
        connection.query('INSERT INTO OD_Purchase_Order SET ?',[response],function(err,fields) {
        if(!err){
        //console.log(rows);
        return callback('succ');
        }
        else
        return callback('fail');
        });
      }
      else
        console.log(err);
     });
    }
  });*/
}

//Function which fetch the intent item info
exports.FnIntentViewItemRead=function(pagename,loggeduser,loggedrole,callback) {
  var queryy;
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
      Config_columns = obj[i].columns;
    }
  }

    var itemarr=[];

      if(loggedrole=="Purchase manager")
        //queryy="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved') and os.state='external' order by os.Intent_Register_Number DESC";
      queryy="SELECT distinct Intent_Register_Number,Intent_Date from OD_Stores_Intent_Items where Intent_State in('Approved','POCreated') and state='external' order by Intent_Register_Number DESC";

      connection.query(queryy,function(err, rows, fields) {

      if(!err){
        //console.log('coming..');
        for(var i=0;i<rows.length;i++)
        {
          var obj={"Itemno":"","intentregno":"","intentdate":"","state":"","itemdes":"","quantity":"","unit":"","intentstate":"","itemid":"","itemlocation":""};
          obj.itemno=rows[i].Intent_Register_Number+rows[i].Item_ID;
          obj.intentregno=rows[i].Intent_Register_Number;
          obj.intentdate=rows[i].Intent_Date;
          obj.itemdes=rows[i].Product_ID;
          obj.unit=rows[i].unit+" "+rows[i].Unit_Measure;
          obj.quantity=rows[i].Quantity+" "+rows[i].Quantity_Measure;
          obj.intentstate=rows[i].Intent_State;
          obj.state=rows[i].state;
          obj.itemid=rows[i].Item_ID;
          obj.itemlocation=rows[i].Store_Location_Name;
          itemarr.push(obj);
        }
        //console.log(JSON.stringify(itemarr));
       return callback(itemarr);
      }
      else
        console.log(err);
    });
    //}
    //return callback(itemarr);
  //});
}

//Function fetches the expanded intent item card info
exports.FnIntentviewExpandItemFetch=function(pagename,cond,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM OD_Stores_Intent_Items WHERE ? ',[cond], function(err, rows) {
    if(!err)
    {
      var itemarr=[];
      for(var i=0;i<rows.length;i++)
      {
        var obj={"duedate":"","intentstate":"","specification":"","itemdes":"","quantity":"","qtymeasure":"","unit":"","unitmeasure":"","remark":"","createdby":"","state":""};
        obj.duedate=rows[i].Due_Date;
        obj.itemdes=rows[i].Product_ID;
        obj.specification=rows[i].Specification;
        obj.quantity=rows[i].Quantity;
        obj.qtymeasure=rows[i].Quantity_Measure;
        obj.unit=rows[i].unit;
        obj.unitmeasure=rows[i].Unit_Measure;
        obj.remark=rows[i].Remarks;
        obj.intentstate=rows[i].Intent_State;
        if(rows[i].state=='internal')
        obj.state='No';
        if(rows[i].state=='external')
        obj.state='Yes';
        obj.createdby=rows[i].Intent_Created_By;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback({"itemarr":itemarr});
    }
    else{
      console.log(err);
    }
  });

}


//Function to create poforan item in an intent
exports.FnIntentviewPocreate=function(pagename,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  //connection.query('INSERT INTO OD_Purchase_Order SET ?',[response],function(err,fields) {
   //if(!err){
    connection.query('SELECT PO_Number from Auto_PO_Number order by PO_Number desc',function(err,rows,result){
        if(rows.length>0){
          console.log(rows[0].PO_Number);
          return callback({'returnval':rows[0].PO_Number});
        }
    });
   //}
  //});


 }

//Function to promote intent
exports.FnViewintentpromote=function(pagename,response,intentno,itemdes,updaterolecolumn,updateroleid,updatedate,updatecolumn,oldcolumn,callback) {

  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

    connection.query('INSERT INTO OD_Purchase_Order SET ?',[response],function(err,fields) {
        if(!err){
          connection.query('UPDATE OD_Stores_Intent_Items SET ? , ?,?,? WHERE ? and ?',[updatecolumn,updaterolecolumn,updateroleid,updatedate,intentno,itemdes], function(err, rows) {

          if(!err){
            return callback("succ");
          }
          else
            return callback("fail");
          });
        }
    });

}

//Function ponumber update
exports.Fnupdateposeq=function(pagename,ponumber,callback) {

  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  var queryy="UPDATE Auto_PO_Number SET PO_Number="+parseInt(ponumber);
  // console.log(queryy);
  connection.query(queryy,function(err,rows,result){
    if(!err)
      return callback("succ");
    else
    {
      console.log(err);
      return callback("fail");
    }
  });
}

//Function which update customer contact info
exports.Fncustomeraddcontact=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Customer_Contact SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });
}

//Function which update customer contact info
exports.Fncustomerreadcontact=function(pagename,customerid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Customer_Contact WHERE ?',[customerid],function(err,rows){
    if(rows.length>0)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });
}

//Function which add customer tax info
exports.Fncustomertaxadd=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Customer_Tax SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      // console.log(err);
      return callback("fail");
    }
  });
}

//Function which add customer excise info
exports.Fncustomerexciseadd=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Customer_Excise SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnAddCustomer=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
 /* connection.query('INSERT INTO MD_Sales_Customer_Detail SET ?', [response], function (err, result) {
        if(!err)
          return callback("succ");
        else
          return callback("fail");
  });*/
  connection.query('SELECT ID FROM MD_Customer_Sequence',function(err,rows) {
    if(rows.length>0) {
      response.Customer_ID=response.Customer_ID+rows[0].ID;
      var newid=parseInt(rows[0].ID)+1;
      var updateval={"ID":newid};
      connection.query('INSERT INTO MD_Sales_Customer_Detail SET ?', [response], function (err, result) {
        if (!err) {
          connection.query('UPDATE MD_Customer_Sequence set ?', [updateval], function (err, result) {
            if(!err)
              return callback({"msg":"succ","id":response.Customer_ID});
            else
              return callback("fail");
          });
        }
        else {
          // console.log('error in customer....'+err);
          return callback("fail");
        }
      });

    }
  });
}

//Function which addpayment info
exports.FnAddcustomerPayment=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Customer_Payment SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnUpdateCustomer=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Customer_ID:response.Customer_ID};
  //console.log(cond);
  connection.query('Update MD_Sales_Customer_Detail SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnUpdatetax=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Customer_ID:response.Customer_ID};
  //console.log(cond);
  connection.query('Update MD_Customer_Tax SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}

//Function which updates supplier info
exports.FnUpdateexcise=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Customer_ID:response.Customer_ID};
  //console.log(cond);
  connection.query('Update MD_Customer_Excise SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}

//Function which addpayment info
exports.FnUpdatecustomerPayment=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Customer_ID:response.Customer_ID};
  // console.log(cond);
  connection.query('UPDATE MD_Customer_Payment SET ? where ?',[response,cond],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}
//Function fetches supplier info
exports.FnItemcustomerRead=function(pagename,itemid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="SELECT * FROM MD_Sales_Customer_Detail where Status='Approved' and Customer_ID not in(SELECT Item_Customer_ID from OD_Item where Item_ID='"+itemid+"')";
  //console.log(queryy);
  connection.query(queryy,function(err, rows, fields) {
    var itemarr=[];
    if(!err){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"itemsupplierid":"","itemsuppliername":""};
        obj.itemsupplierid=rows[i].Customer_ID;
        obj.itemsuppliername=rows[i].Customer_Name;
        itemarr.push(obj);
      }
      //console.log(JSON.stringify(itemarr));
      return callback(itemarr);
    }
    else
      console.log(err);
  });
  //console.log(Config_tables);

}

//Function fecthes searched item info
exports.Fnreadcustomer=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Sales_Customer_Detail WHERE ?',[cond],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){
        // console.log(JSON.stringify(rows));
        return callback(rows);

      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
  }

//Function fecthes searched item info
exports.Fntaxread=function(pagename,customerid,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Customer_Tax WHERE ?',[customerid],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){

        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}

//Function fecthes searched item info
exports.Fnexciseread=function(pagename,customerid,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Customer_Excise WHERE ?',[customerid],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){

        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
}

  //Function fecthes searched item info
exports.Fnreadcustomerpayment=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('SELECT * FROM MD_Customer_Payment WHERE ?',[cond],function(err, rows, fields) {
    var itemarr=[];

    if(!err){
      if(rows.length>0){
      /*for(var i=0;i<rows.length;i++)
      {
        var obj={"paymenttype":"","bankname":"","accountno":"","address":"","paymentterm":""};

        obj.paymenttype=rows[i].Payment_Type;
        obj.bankname=rows[i].Bank_Name;
        obj.accountno=rows[i].Account_No;
        obj.address=rows[i].Bank_Address;
        obj.paymentterm=rows[i].Payment_Term;
        itemarr.push(obj);
      }*/
        return callback(rows);
      }
      else{
        return callback("no item");
      }
    }
    else
      console.log(err);
  });
  }

  //Function fecthes searched item info
  exports.Fnreadcustomeriteminfo=function(pagename,cond,id,callback) {
    //console.log(pagename+"  "+JSON.stringify(cond));
    var Config_tables=[];
    for(var i=0;i<obj.length;i++){
      if(obj[i].name==pagename){
        Config_tables=obj[i].value;
      }
    }

    //console.log(id);
    //if(id!=""||id!=" ")  {
    var querry="SELECT distinct m.Item_Name,o.Item_Customer_ID,Item_ID FROM MD_Item m JOIN OD_Item o USING (Item_ID) WHERE o.Item_Customer_ID ='"+id+"'";
    //console.log(querry);
    //connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ?',[cond],function(err, rows, fields) {
  connection.query(querry,function(err, rows, fields) {
      var itemarr=[];

     if(!err){
           if(rows.length>0){
           /*for(var i=0;i<rows.length;i++)
           {
             var obj={"itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""};
             //obj.itemoptionalsupplier=rows[i].Item_Optional_Supplier_ID;
             //obj.itemsupplier=rows[i].Item_Supplier_ID;
             obj.itemid=rows[i].Item_ID;
             obj.itemname=rows[i].Item_Name;
             obj.itemdes=rows[i].Item_Description;
             obj.container=rows[i].Container;
             obj.quantity=rows[i].UOM;
             obj.itemgroup=rows[i].Item_Group_ID;
             obj.itemtype=rows[i].Item_Type_ID;
             obj.purchasetype=rows[i].Item_Purchase_Type_ID;
             itemarr.push(obj);

           }*/
           //console.log(JSON.stringify(itemarr));
             return callback(rows);
           }
           else{
             return callback("no item");
           }
         }
         else
          console.log(err);
    });
//}
//else
//return callback("no item");
  }

  //Function fetches the expanded intent item card info
exports.Fnpurchaseorder=function(pagename,intentno,itemdes,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="select po.PO_Number,po.PO_Date,ps.Supplier_Name,ps.Location,ps.City,ps.District,ps.State,ps.Mobileno,ps.Email from OD_Purchase_Order po join MD_Purchase_Supplier ps on(po.Supplier_Name=ps.Supplier_Name) where Intent_Register_Number='"+intentno+"' and Product_ID='"+itemdes+"'";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
    }
  });

}

exports.Fnpurchaseorderitem=function(pagename,intentno,itemdes,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="select Product_ID,Quantity,Quantity_Measure,unit,Unit_Measure from OD_Stores_Intent_Items where Intent_Register_Number='"+intentno+"' and Product_ID='"+itemdes+"'";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
    }
  });

}

exports.Fnpurchaseorderitemtax=function(pagename,intentno,itemdes,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="select * from MD_Item_Tax where Item_ID=(Select Item_ID from MD_Item where Item_Name='"+itemdes+"')";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      //console.log(JSON.stringify(rows));
      return callback(rows);
    }
    else{
      console.log(err);
    }
  });

}

exports.Fnpurchaseorderitemprice=function(pagename,intentno,itemdes,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="select Item_Supplier_price from OD_Item where Item_ID=(Select Item_ID from MD_Item where Item_Name='"+itemdes+"') and Item_Supplier_ID=(SELECT ps.Supplier_ID from OD_Purchase_Order po join MD_Purchase_Supplier ps on(po.Supplier_Name=ps.Supplier_Name) where Intent_Register_Number='"+intentno+"' and Product_ID='"+itemdes+"')";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      //console.log(JSON.stringify(rows));
      return callback(rows);
    }
    else{
      console.log(err);
    }
  });

}

exports.Fncustomersupplier=function(pagename,itemid,itemtype,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  if(itemtype!='FG')
  var queryy="SELECT ps.Supplier_Name,od.Item_ID,od.Item_Supplier_ID,od.Item_Supplier_price from OD_Item od join MD_Purchase_Supplier ps on (ps.Supplier_ID=od.Item_Supplier_ID) where Item_ID='"+itemid+"'";
  if(itemtype=='FG')
  var queryy="SELECT cs.Customer_Name,od.Item_ID,od.Item_Customer_ID from OD_Item od join MD_Sales_Customer_Detail cs on (cs.Customer_ID=od.Item_Customer_ID) where Item_ID='"+itemid+"'";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      //console.log(JSON.stringify(rows));
      return callback({"itemarr":rows,"returntype":itemtype});
    }
    else{
      console.log(err);
    }
  });

}

exports.Fndeleteitemsupplier=function(pagename,itemid,supplierid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="delete from OD_Item where Item_ID='"+itemid+"' and Item_Supplier_ID='"+supplierid+"'";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      console.log(err);
    }
  });

}

exports.Fnupdateitempricesupplier=function(pagename,itemid,supplierid,supplierprice,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="update OD_Item set Item_Supplier_price='"+supplierprice+"' where Item_ID='"+itemid+"' and Item_Supplier_ID='"+supplierid+"'";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      console.log(err);
    }
  });

}


exports.Fndeleteitemcustomer=function(pagename,itemid,customerid,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var queryy="delete from OD_Item where Item_ID='"+itemid+"' and Item_Customer_ID='"+customerid+"'";
  // console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      console.log(err);
    }
  });

}

exports.Fnreadsuppliertoapprove=function(pagename,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="SELECT * FROM "+Config_tables[0]+" where Status='"+Config_columnvalues[0]+"'";
   //console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}

exports.Fnapprovesupplierforpurchase=function(pagename,supplierid,status,callback) {
  // console.log('coming');
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="UPDATE "+Config_tables[0]+" SET Status='"+status+"' where Supplier_ID='"+supplierid+"'";
   // console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}

exports.Fnreadcustomertoapprove=function(pagename,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="SELECT * FROM "+Config_tables[0]+" where Status='"+Config_columnvalues[0]+"'";
  //console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}

exports.Fnapprovecustomerforsales=function(pagename,customerid,status,callback) {
  // console.log('coming');
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="UPDATE "+Config_tables[0]+" SET Status='"+status+"' where Customer_ID='"+customerid+"'";
  //console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}



exports.Fnretestitemread=function(pagename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="SELECT * FROM OD_Sales_Inward_Material where state in('Confirm')";

  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnresenditemtoquality=function(pagename,inwardregno,updatestate,checkstate,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  connection.query('UPDATE OD_Sales_Inward_Material set ? WHERE ? and ?',[updatestate,inwardregno,checkstate], function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });

}

exports.Fncustomerinforead=function(pagename,customerid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  // console.log(customerid);
  var qur="SELECT * FROM MD_Sales_Customer_Detail cd JOIN MD_Customer_Payment cp ON ( cd.Customer_ID = cp.Customer_ID ) JOIN MD_Customer_Excise ce ON ( cp.Customer_ID = ce.Customer_ID ) JOIN MD_Customer_Tax ct ON ( ce.Customer_ID = ct.Customer_ID ) WHERE cd.Customer_ID='"+customerid+"'";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}


exports.Fnsupplierinforead=function(pagename,supplierid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT * FROM MD_Purchase_Supplier cd JOIN MD_Supplier_Payment cp ON ( cd.Supplier_ID = cp.Supplier_ID ) JOIN MD_Supplier_Excise ce ON ( cp.Supplier_ID = ce.Supplier_ID ) JOIN MD_Supplier_Tax ct ON ( ce.Supplier_ID = ct.Supplier_ID ) WHERE cd.Supplier_ID='"+supplierid+"'";
  console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnpasswordchange=function(pagename,empid,oldpass,newpass,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  // console.log(JSON.stringify(empid));
  // console.log(JSON.stringify(oldpass));
  // console.log(JSON.stringify(newpass));
  connection.query('UPDATE OD_HR_Employee_Job_Desc set ? where ? and ?',[newpass,empid,oldpass] ,function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
    }
  });

}

exports.Fnresetpassword=function(pagename,empid,newpass,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  // console.log(JSON.stringify(empid));
  // console.log(JSON.stringify(oldpass));
  // console.log(JSON.stringify(newpass));
  connection.query('UPDATE OD_HR_Employee_Job_Desc set ? where ?',[newpass,empid] ,function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{

      return callback("fail");
    }
  });

}

exports.Fnverifymail=function(pagename,empid,code,callback) {

  var server  = email.server.connect({
   user:    emailcredential[0].email,
   password:emailcredential[0].password,
   host:    "smtp.gmail.com",
   ssl:     true
  });
   connection.query('select * from MD_HR_Employee where ?',[empid] ,function(err, rows) {
    if(!err)
    {
      console.log(rows[0].Email);
      // send the message and get a callback with an error or details of the message that was sent
   server.send({
   text:    "Verification code",
   from:    emailcredential[0].email,
   to:       rows[0].Email,
   subject: "Verification Code",
    attachment:
   [
      {data:"<html>Verification code: "+code+"</html>", alternative:true}
   ]
  }, function(err, message) { console.log(err || message); });
  return callback('mail sent');
     
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}


exports.Fnreaddepartment=function(pagename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT distinct Department_Name FROM MD_HR_Department";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}


exports.Fnreadrole=function(pagename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT distinct Role_ID FROM MD_HR_Role";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}



exports.Fnuserinfo=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  // var qur="Insert into MD_HR_Employee set ?";
  // console.log(qur);
  connection.query("select * from Auto_Employee_Number", function(err, rows) {
    response.Employee_ID="Emp"+rows[0].Emp_Code;
    var oldid="Emp"+rows[0].Emp_Code;
    var newid=parseInt(rows[0].Emp_Code)+1;
  connection.query("Insert into MD_HR_Employee set ?",[response], function(err, rows) {
    if(!err)
    {
      // return callback('succ');
      var qurr="Update Auto_Employee_Number set Emp_Code='"+newid+"'";
      connection.query(qurr, function(err, rows) {
        if(!err){
          return callback({"val":oldid});
        }
        else{
          console.log(err);
          return callback({"val":"fail"});
        }
      });
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
});
}

exports.Fnuseraccount=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  // var qur="SELECT distinct Role_ID FROM MD_HR_Role";
  // console.log(qur);
  connection.query("Insert into MD_HR_Employee_Account set ?",[response], function(err, rows) {
    if(!err)
    {
      return callback('succ');
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.Fnuserrole=function(pagename,employeeid,departmentname,rolename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  // var qur="";
  // console.log(qur);
  var qur1="select Department_ID from MD_HR_Department where Department_Name='"+departmentname+"'";
  connection.query(qur1, function(err, rows) {
  if(!err){
    if(rows.length>0){
    var deptid=rows[0].Department_ID;
  var qur="Insert into OD_HR_Employee_Job_Desc values('"+employeeid+"','"+deptid+"','"+rolename+"','','','password')";
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback('succ');
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}
}
else
console.log(err);
});
}

exports.Fnreadusertoapprove=function(pagename,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="SELECT * FROM MD_HR_Employee where Status='Created'";
   //console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}

exports.Fnuserinforead=function(pagename,employeeid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT * FROM MD_HR_Employee e JOIN MD_HR_Employee_Account ea ON ( e.Employee_ID = ea.Employee_ID ) JOIN OD_HR_Employee_Job_Desc jd on (ea.Employee_ID=jd.Emp_ID) WHERE e.Employee_ID='"+employeeid+"'";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnapproveuser=function(pagename,employeeid,status,callback) {
  // console.log('coming');
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="UPDATE MD_HR_Employee SET Status='"+status+"' where Employee_ID='"+employeeid+"'";
   // console.log(queryy);
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
      //console.log(err);
    }
  });

}


exports.Fnupdateuserinfo=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }

  connection.query("UPDATE MD_HR_Employee set ?",[response], function(err, rows) {
    if(!err)
    {
      return callback('succ');     
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.Fnupdateuseraccount=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
 
  connection.query("UPDATE MD_HR_Employee_Account set ?",[response], function(err, rows) {
    if(!err)
    {
      return callback('succ');
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.Fnupdateuserrole=function(pagename,employeeid,departmentname,rolename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  // var qur="";
  // console.log(qur);
  var qur1="select Department_ID from MD_HR_Department where Department_Name='"+departmentname+"'";
  connection.query(qur1, function(err, rows) {
  if(!err){
    if(rows.length>0){
    var deptid=rows[0].Department_ID;
  var qur="UPDATE OD_HR_Employee_Job_Desc set Department_ID='"+deptid+"',Role_ID='"+rolename+"' where Employee_ID='"+employeeid+"'";
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback('succ');
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}
}
else
console.log(err);
});
}

exports.Fnuserread=function(pagename,employeeid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT * FROM MD_HR_Employee";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnusersearch=function(pagename,employeename,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT * FROM MD_HR_Employee where Employee_Name='"+employeename+"'";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnuseraccount1=function(pagename,employeeid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT * FROM MD_HR_Employee_Account where Employee_ID='"+employeeid+"'";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fnrole=function(pagename,employeeid,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  //console.log(customerid);
  var qur="SELECT jd.Emp_ID,jd.Department_ID,jd.Role_ID,d.Department_Name FROM OD_HR_Employee_Job_Desc jd join MD_HR_Department d on(jd.Department_ID=d.Department_ID) where jd.Emp_ID='"+employeeid+"'";
  // console.log(qur);
  connection.query(qur, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      return callback("no items");
    }
  });

}

exports.Fncreatedepartment=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  connection.query('INSERT into MD_HR_Department SET ?',[response], function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.Fncreaterole=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  connection.query('INSERT into MD_HR_Role SET ?',[response], function(err, rows) {
    if(!err)
    {
      return callback("succ");
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}


exports.FnFetchbatchno=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }

  var fetchbatchno="SELECT * from OD_Inward_Material_Inspection where Inward_Register_Number='"+response.Inward_Register_Number+"' and status='Confirm' and Inspection_Status='Approved'";  
  console.log('.................fetchbatchno..................');
  console.log(fetchbatchno);
  console.log('...............................................');
  
  connection.query(fetchbatchno, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.FnInventoryupdate=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  var insertqur="INSERT INTO OD_Item_Inventory(Item_ID,Item_Name,Container,Container_Measure,Quantity,Quantity_Measure,State,Container_ID,Batch_No,PO_Number,PO_Date,Inward_Register_Number) SELECT Item_ID,"+
  "Product_ID,unit,Unit_measure,Quantity,Quantity_Measure,'Stores',Container_ID,Batch_No,PO_Number,PO_Date,Inward_Register_Number  FROM "+ 
  "OD_Inward_Material_Inspection WHERE Inward_Register_Number='"+response.new_Inward_Register_Number+"' and status='Confirm' and Inspection_Status='Approved' and Batch_No='"+response.Batch_No+"' and Container_ID='"+response.Container_ID+"'";

  var updatecheck="SELECT Item_ID,Product_ID,unit,Unit_Measure,Quantity,Quantity_Measure,Batch_No FROM "+
  "OD_Inward_Material_Inspection WHERE Container_ID='"+response.Container_ID+"' and Batch_No='"+response.Batch_No+"' and Inward_Register_Number='"+response.new_Inward_Register_Number+"' and status='Confirm' and Inspection_Status='Approved'";

  var updatequr="UPDATE OD_Item_Inventory SET ?,? WHERE Item_ID=(SELECT Item_ID FROM "+
  "OD_Sales_Inward_Material where new_Inward_Register_Number='"+response.new_Inward_Register_Number+"' and state='Confirm') and Batch_No='"+response.Batch_No+"' and Container_ID='"+response.Container_ID+"'";

  var qurcheck="SELECT * FROM OD_Item_Inventory WHERE Item_ID=(SELECT Item_ID FROM "+
  "OD_Sales_Inward_Material where new_Inward_Register_Number='"+response.new_Inward_Register_Number+"' and state='Confirm') "+
  " and Batch_No='"+response.Batch_No+"' and Container_ID='"+response.Container_ID+"'";
 
  var res={
    quantity:'',
    container:''
  };

  connection.query(qurcheck,function(err, rows) {
  if(rows.length>0)
      {
        response.quantity=rows[0].Quantity;
        response.container=rows[0].Container;
        console.log('.............................................................');
        console.log(response.quantity+"  "+response.container);
        console.log(updatecheck); 
        console.log('.............................................................');
        connection.query(updatecheck,function(err, rows) {
          if(rows.length> 0){
            console.log(rows[0].Quantity+" "+rows[0].unit);
            var quantity=parseInt(response.quantity)+parseInt(rows[0].Quantity);
            // var container=parseInt(response.container)+parseInt(rows[0].unit);
            var container=parseInt(response.container)+1;
            var quan={"Quantity":quantity};
            var cont={"Container":container};
            console.log('.............................................................');
            console.log(response.quantity+"  "+response.container);
            console.log(updatequr); 
            console.log(JSON.stringify(quan)+" "+JSON.stringify(cont));
            connection.query(updatequr,[quan,cont],function(err, rows) {
              if(!err){
                return callback("updated");          
              }
              else
                return callback("not updated");
            });
          }
        });
      }
      else
      {
         connection.query(insertqur,function(err, rows) {
          if(!err){
              console.log('.............................................................');
              console.log("Insertion");
              return callback("inserted");          
          }
          else
              return callback("not inserted");
         });
      }
    
  });

}


exports.FnInternalintentitemread=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  var queryy="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,"+
  "os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os "+
  "join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) "+
  "where os.Intent_State in('"+response.intentstate+"') and state='"+response.state+"' and os.Intent_Status='Open'";

  console.log(queryy);
  
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.FnInternalintentexpandread=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  // var queryy="select si.Intent_Register_Number,si.Intent_Date,si.Product_ID,si.unit as requnit,si.Unit_measure as requnitmeasure,"+
  // "si.Quantity as reqquantity,si.Quantity_Measure as reqquantitymeasure,ii.Container as availunit,ii.Container_Measure as availunitmeasure, "+
  // "ii.Quantity as availquantity,ii.Quantity_Measure as availquantitymeasure "+
  // " FROM OD_Stores_Intent_Items si join OD_Item_Inventory ii on(si.Item_ID=ii.Item_ID) "+
  // "and si.Intent_Register_Number='"+response.intentregno+"' and si.Item_ID='"+response.itemid+"'";

  var queryy="select sum(Quantity) as availquantity,sum(Container) as availcontainer,Quantity_Measure,Container_Measure from OD_Item_Inventory where Item_ID='"+response.itemid+"' and State='Stores'";

  console.log(queryy);
  
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.FnIntentsupply=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var lotresponse={"lotnumber":""};
  var eqinsertqur="INSERT INTO OD_Item_Inventory(Item_ID,Item_Name,Container,Container_Measure,Quantity,Quantity_Measure,State,Intent_Register_No,Container_ID,Batch_No) select Item_ID,Product_ID,'1',Unit_Measure,'"+response.contquantity+"',Quantity_Measure,'Production',Intent_Register_Number,'"+response.containerid+"','"+response.batchno+"' "+
  " FROM OD_Stores_Intent_Items where Intent_Register_Number='"+response.intentregno+"' and Item_ID='"+response.itemid+"'";


  // var eqinsertqur="INSERT INTO OD_Production_Inventory(Item_ID,Item_Name,Container,Container_Measure,Quantity,Quantity_Measure,State,Intent_Register_No,Container_ID,Batch_No) select Item_ID,Product_ID,'1',Unit_Measure,'"+response.contquantity+"',Quantity_Measure,'Production',Intent_Register_Number,'"+response.containerid+"','"+response.batchno+"' "+
  // " FROM OD_Stores_Intent_Items where Intent_Register_Number='"+response.intentregno+"' and Item_ID='"+response.itemid+"'";
  
  var selectlotno="SELECT * from Auto_Lot_Number";
  var updatelotno="UPDATE Auto_Lot_Number SET Lot_Number=?";

  if(response.selunit==response.requnit){

    connection.query("UPDATE OD_Item_Inventory SET Quantity=(Quantity-('"+response.reqquantity+"')),Container=(Container-1) where Item_ID='"+response.itemid+"' and Container_ID='"+response.containerid+"' and State='Stores'", function(err, rows) {
      if(!err){
        connection.query(selectlotno, function(err, rows) { 
        if(rows.length>0){
          lotresponse.lotnumber=rows[0].Lot_Number;
          var newlotno=parseInt(rows[0].Lot_Number)+1;
          connection.query("UPDATE Auto_Lot_Number SET Lot_Number='"+newlotno+"'", function(err, result) {
            if(result.affectedRows==1){
               connection.query("INSERT INTO OD_Production_Inventory(Item_ID,Item_Name,Container,Container_Measure,Quantity,Quantity_Measure,State,Intent_Register_No,Container_ID,Batch_No,Lot_Number) select Item_ID,Product_ID,'1',Unit_Measure,'"+response.contquantity+"',Quantity_Measure,'Production',Intent_Register_Number,'"+response.containerid+"','"+response.batchno+"','"+lotresponse.lotnumber+"' "+
               " FROM OD_Stores_Intent_Items where Intent_Register_Number='"+response.intentregno+"' and Item_ID='"+response.itemid+"'", function(err, rows) {
                 if(!err)
                  return callback('succ');
                  else
                  {
                    console.log(err);
                          return callback('fail');
                  }
                 });
            }
          });

        }       

       
      });
      }
    });

  }


}


exports.Fnintentsupplystatus=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }

  if(response.selunit==response.requnit){

   connection.query("UPDATE OD_Stores_Intent_Items SET Quantity=(Quantity-('"+response.reqquantity+"')),unit=(unit-('"+response.requnit+"')),Intent_Status='Closed' where Item_ID='"+response.itemid+"' and Intent_Register_Number='"+response.intentregno+"'", function(err, rows) {
            if(!err)
            return callback('supplied!');
            else{
              console.log(err);
              return callback('not supplied!');
            }
            });

  }


}


exports.FnFetchbatchnos=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }

  var fetchbatchno="SELECT distinct Batch_No,sum(Quantity) as quantity from OD_Item_Inventory where Item_ID='"+response.Item_ID+"' and State='Stores' group by Batch_No";  
  console.log('.................fetchbatchno..................');
  console.log(fetchbatchno);
  console.log('...............................................');
  
  connection.query(fetchbatchno, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}


exports.FnFetchcontainer=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }

  var fetchcontainer="SELECT Container_ID,sum(Quantity) as quantity from OD_Item_Inventory where Batch_No='"+response.Batch_No+"' and state='Stores' and Quantity!='0' group by Container_ID";  
  console.log('.................fetchbatchno..................');
  console.log(fetchcontainer);
  console.log('...............................................');
  
  connection.query(fetchcontainer, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}

exports.FnInternalintentviewitemread=function(pagename,response,callback) {

  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  

  var queryy="SELECT * FROM OD_Production_Inventory WHERE State='Production'";

  console.log(queryy);
  
  connection.query(queryy, function(err, rows) {
    if(!err)
    {
      return callback(rows);
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });

}


exports.FnFetchheatproperty=function(pagename,heatno,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  var checkqur="SELECT * FROM OD_Heat_To_Property WHERE Heat_No='"+heatno+"'";
  var queryy="SELECT * FROM MD_Heat_Property";
  connection.query(queryy, function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}


exports.FnCheckheatproperty=function(pagename,heatno,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  var checkqur="SELECT * FROM OD_Heat_To_Property WHERE Heat_No='"+heatno+"'";
  console.log(checkqur);
  connection.query(checkqur, function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}



exports.FnMapheatproperty=function(pagename,heatno,propertyid,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  
  var query1="SELECT * FROM OD_Heat_To_Property WHERE Heat_No='"+heatno+"' and Property_ID='"+propertyid+"'";
  var query2="INSERT INTO OD_Heat_To_Property VALUES('"+heatno+"','"+propertyid+"')";

  console.log(query1);
  console.log(query2);

  connection.query(query1, function(err, rows) {
    if(rows.length==0){
  connection.query(query2, function(err, rows) {
    if(!err)
    {      
      return callback('succ'); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
  }
});
}

exports.FnChemicalpropertyread=function(pagename,batchno,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  
  var query1="SELECT Heat_No FROM OD_Heat_To_Batch WHERE Batch_No='"+batchno+"'";
  var query2="SELECT Property_Name FROM MD_Heat_Property WHERE Property_ID in(SELECT Property_ID FROM OD_Heat_To_Property WHERE Heat_No=?) and Property_Category=?";
  var response={
    "heatno":""
  };
  console.log(query1);
  console.log(query2);

  connection.query(query1, function(err, rows) {
    if(rows.length>0){
      response.heatno=rows[0].Heat_No;
      console.log(response.heatno);
  connection.query("SELECT Property_Name FROM MD_Heat_Property WHERE Property_ID in(SELECT Property_ID FROM OD_Heat_To_Property WHERE Heat_No='"+response.heatno+"') and Property_Category='Chemical'", function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
  }
});
}

exports.FnMechanicalpropertyread=function(pagename,batchno,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  
  var query1="SELECT Heat_No FROM OD_Heat_To_Batch WHERE Batch_No='"+batchno+"'";
  var query2="SELECT Property_Name FROM MD_Heat_Property WHERE Property_ID in(SELECT Property_ID FROM OD_Heat_To_Property WHERE Heat_No=?) and Property_Category=?";
  var response={
    "heatno":""
  };
  console.log(query1);
  console.log(query2);

  connection.query(query1, function(err, rows) {
    if(rows.length>0){
      response.heatno=rows[0].Heat_No;
      console.log(response.heatno);
  connection.query("SELECT Property_Name FROM MD_Heat_Property WHERE Property_ID in(SELECT Property_ID FROM OD_Heat_To_Property WHERE Heat_No='"+response.heatno+"') and Property_Category='Mechanical'", function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
  }
});
}

exports.Fninsertchemicaltest=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  
  
  var query1="INSERT INTO OD_Chemical_Test SET ?";

  console.log(query1);

  connection.query(query1, [response],function(err, rows) {
    if(!err)
    {      
      return callback('succ'); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
  
}

exports.Fninsertmechanicaltest=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
  
  
  var query1="INSERT INTO OD_Mechanical_Test SET ?";

  console.log(query1);

  connection.query(query1, [response],function(err, rows) {
    if(!err)
    {      
      return callback('succ'); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}

exports.Fnsearchbatch=function(pagename,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
    
  var query1="SELECT distinct ct.Batch_No FROM OD_Chemical_Test ct join OD_Mechanical_Test mt on(ct.Batch_No=mt.Batch_No)";

  console.log(query1);

  connection.query(query1,function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}


exports.Fnfetchtcinfo=function(pagename,batchno,callback) {
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }  
    
  var query1="SELECT * FROM OD_Chemical_Test ct join OD_Mechanical_Test mt on(ct.Batch_No=mt.Batch_No) where ct.Batch_No='"+batchno+"' and mt.Batch_No='"+batchno+"'";

  console.log(query1);

  connection.query(query1,function(err, rows) {
    if(!err)
    {      
      return callback(rows); 
    }
    else{
      console.log(err);
      return callback("fail");
    }
  });
}