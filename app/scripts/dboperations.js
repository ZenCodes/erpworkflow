/**
 * Created by praba on 2/10/2016.
 */
var mysql      = require('mysql');
var email   = require("emailjs/email");

var credential=[];
//Fetching credential information
exports.FnReadCredentials=function() {
  require('fs').readFile('./app/config/credentials.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    credential = JSON.parse(data);
    exports.FnDBConnection();
    //console.log(obj);
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
      console.log("Error connecting database ... \n\n"+err);
    }
  });
}



exports.Fnmailservice=function() {
var server  = email.server.connect({
   user:    "rmpraba@gmail.com",
   password:"rmpraba90raja",
   host:    "smtp.gmail.com",
   ssl:     true

});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "Purchase Order",
   from:    "rmpraba@gmail.com",
   to:      "rmpraba@gmail.com",
   cc:      "prabha@niit-karur.com",
   subject: "testing po",
    attachment:
   [
      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
      {path:"F:\\NodeJS\\Doc1.pdf", type:"application/pdf", name:"sample.pdf"}
   ]
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
  connection.query('SELECT '+ Config_columns[0] +' FROM '+ Config_tables[0] +' WHERE ?',[cond],function(error,rows) {
    if(!error)
    {
      //console.log(rows.length);
      if(rows.length==0)
      {
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
            console.log(error);
            //res.status(200).json({'returnval': "fail"});
            return callback("fail");
          }
        });
      }
      else
      {
        //res.status(200).json({'returnval': "exists"});
        //Sending exists flag as seq no already there
        return callback("exists");
      }
    }
    else
    {
      //console.log("yes..."+error);
      //res.status(200).json({'returnval': "fail"});
      return callback("fail");
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
    //console.log(Config_tables);
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
          //console.log("Not Inserted!"+idd);
          return callback("not okay");
          //res.status(200).json({'inwardregno': 'not okay'});
        }
      });
    }
  });
}

//Function which fetches the forward flow items
exports.FnForwardFlowitemFetch=function(pagename,cond,callback){
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
  //Query which fetch the item under specific IRN Number
  connection.query('SELECT distinct '+Config_columns[0]+','+Config_columns[1]+','+Config_columns[2]+' FROM '+Config_tables[0]+' WHERE ? ORDER BY '+Config_columns[0]+' DESC',[cond], function(err, rows, fields) {
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
      //Sending response items under the IRN number
      return callback(itemarr);
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

  console.log(JSON.stringify(cond)+" "+JSON.stringify(cond1));
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

//Function fetches the item info and update the status of the specific item
exports.FnPhysicqualifyitem=function(pagename,cond1,cond2,cond3,cond4,cond5,newstatus,val1,val2,val3,val4,val5,callback) {
  //fetching tables for this page
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }

  var existflag="false";
  //Check for the item status,is it already updated or not
  connection.query('SELECT * from '+Config_tables[0]+' WHERE ? and ? and ? and ? ',[cond1,cond2,cond3,cond5], function(err, rows) {
    if(!err){
      //console.log("Inward......."+rows.length);
      if(rows.length>0)
        existflag="true";
    }
    else
    {
    }
  });
  //Creating copy of item to the old state and changes updated the current item
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ? and ? and ? ',[cond1,cond2,cond3,cond4], function(err, rows) {
    if(!err){
      //console.log("In ......"+rows.length+"  "+existflag);
      if((rows.length>0)&&(existflag=="false")){
        //console.log("Yes into....");
        response = {
          //Purchase_Type:rows[0].Purchase_Type,
          Purchase_Type:rows[0].Purchase_Type,
          Inward_Bill_Number:rows[0].Inward_Bill_Number,
          Inward_Register_Date:rows[0].Inward_Register_Date,
          PO_Number:val4.PO_Number,
          PO_Date:rows[0].PO_Date,
          Supplier_ID:rows[0].Supplier_ID,
          Product_ID:rows[0].Product_ID,
          //Qty:rows[0].Qty,
          //GRAN_No:rows[0].GRAN_No,
          Qty_Received:rows[0].Qty_Received,
          Qty_Accepted:rows[0].Qty_Accepted,
          unit:rows[0].unit,
          Unit_Accepted:rows[0].Unit_Accepted,
          Qty_measure:rows[0].Qty_measure,
          Unit_measure:rows[0].Unit_measure,
          Remarks:rows[0].Remarks,
          new_Inward_Register_Number:rows[0].new_Inward_Register_Number,
          state:newstatus
        };
        console.log(response);
        //Updating changed parameters of the current state items
        connection.query('UPDATE '+Config_tables[0]+' set ?,?,?,?,? WHERE  ? and ? and ? and ?',[val4,val5,val1,val2,val3,cond1,cond2,cond3,cond4], function(err, result){
          if(!err){
            connection.query('insert into OD_Sales_Inward_Material set ?',[response],function(err,result){
              if(!err){
                return callback("updated");
                //res.status(200).json({"flag":"updated"});
              }
              else
              {
                console.log('error.....'+err);
                return callback("not updated");
                //res.status(200).json({"flag":"not updated"});
              }
            });
          }
          else
          {
            return callback("not updated");
            //res.status(200).json({"flag":"not updated"});
          }
        });
      }
      if((rows.length>0)&&(existflag=="true")){
        //If item already updated,when reupdating it will update the changed parameter alone like quantity or remarks
        connection.query('UPDATE '+Config_tables[0]+' SET ?,?,?,?,? WHERE  ? and ? and ? and ?',[val4,val5,val1,val2,val3,cond1,cond2,cond3,cond4], function(err, result){
          if(!err){
            //res.status(200).json({"flag":"updated"});
            return callback("updated");
          }

        });

      }
      else
      {
        console.log('no items found');
      }
    }
    else
    {
      console.log('Error...'+err);
    }
  });
}
//Function filters the non updated items while making flow state change
exports.FnPhysicqualifiedService=function(pagename,cond1,cond2,cond3,updatestatus,qtyupdatestatus,val,updateflag,ponumber,callback){
  //Fetching table info
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }

  var oldnewarr=[];
  var newarr=[];
  var splicearr=[];
  var flag=0;
  var returnval=0;
  //Function which filters individually updated items
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond1,cond3], function(err, rows) {
    console.log(rows.length+ "  "+JSON.stringify(cond1)+"  "+JSON.stringify(cond3));
    if(rows.length>0){
      for(var i=0;i<rows.length;i++)
      {
        /*var obj={"inwardno":"","itemdes":""};
         obj.inwardno=rows[i].Inward_Bill_Number;
         obj.itemdes=rows[i].Product_ID;
         oldnewarr.push(obj);*/
        var obj={"purchasetype":"","purchasetypeflag":"","inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","state":"","inwardregno":"","containeraccepted":"","containerreceived":"","contmeasure":"","qtymeasure":""};
        //obj.purchasetype=rows[i].Purchase_Type;
        obj.purchasetypeflag=rows[i].Purchase_Type;
        obj.inwardno=rows[i].Inward_Bill_Number;
        obj.inwarddate=rows[i].Inward_Register_Date;
        obj.ponumber=rows[i].PO_Number;
        obj.podate=rows[i].PO_Date;
        obj.supname=rows[i].Supplier_ID;
        obj.itemdes=rows[i].Product_ID;
        //obj.qtyordered=rows[i].Qty;
        obj.qtyreceived=rows[i].Qty_Received;
        obj.qtyaccepted=rows[i].Qty_Accepted;
        obj.containerreceived=rows[i].unit;
        obj.containeraccepted=rows[i].Unit_Accepted;
        obj.qtymeasure=rows[i].Qty_measure;
        obj.contmeasure=rows[i].Unit_measure;
        obj.remarks=rows[i].Remarks;
        obj.state=updatestatus;
        obj.inwardregno=rows[i].new_Inward_Register_Number;
        oldnewarr.push(obj);
      }
    }
  });
  //console.log('old array');
  //console.log(JSON.stringify(oldnewarr));
  //Query which reads all the items
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond1,cond2], function(err, rows) {
    //console.log(rows.length);
    if(rows.length>0){
      for(var i=0;i<rows.length;i++)
      {
        var obj={"purchasetype":"","purchasetypeflag":"","inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","state":"","inwardregno":"","containeraccepted":"","containerreceived":"","contmeasure":"","qtymeasure":""};
        //obj.purchasetype=rows[i].Purchase_Type;
        obj.purchasetypeflag=rows[i].Purchase_Type;
        obj.inwardno=rows[i].Inward_Bill_Number;
        obj.inwarddate=rows[i].Inward_Register_Date;
        obj.ponumber=ponumber.PO_Number;
        obj.podate=rows[i].PO_Date;
        obj.supname=rows[i].Supplier_ID;
        obj.itemdes=rows[i].Product_ID;
        //obj.qtyordered=rows[i].Qty;
        obj.qtyreceived=rows[i].Qty_Received;
        obj.qtyaccepted=rows[i].Qty_Accepted;
        obj.containerreceived=rows[i].unit;
        obj.containeraccepted=rows[i].Unit_Accepted;
        obj.qtymeasure=rows[i].Qty_measure;
        obj.contmeasure=rows[i].Unit_measure;
        obj.remarks=rows[i].Remarks;
        obj.state=updatestatus;
        obj.inwardregno=rows[i].new_Inward_Register_Number;
        newarr.push(obj);
        //console.log(JSON.stringify(newarr));
      }
      //console.log('new arr');
      //console.log(JSON.stringify(newarr));
      for(var i=0;i<newarr.length;i++){
        flag=0;
        for(var j=0;j<oldnewarr.length;j++)
        {
          if(newarr[i].itemdes==oldnewarr[j].itemdes)
            flag=1;
          //console.log(newarr[i].itemdes);
          //else
          //flag=1;
        }
        if(flag==0){
          splicearr.push(newarr[i]);
          if(updateflag=="1"){
            var contval={Unit_Accepted : newarr[i].containerreceived}
            var qtyval= {Qty_Accepted : newarr[i].qtyreceived};
            var itemdes={Product_ID : newarr[i].itemdes};
            var supname={Supplier_ID : newarr[i].supname};

            //console.log(qtyval.Qty_Accepted+" "+itemdes.Product_ID+"  "+supname.Supplier_ID);
            //Updating status to the non updated items
            connection.query('UPDATE '+Config_tables[0]+' SET ?,?,? WHERE ? and ?  and ? and ?',[ponumber,qtyval,contval,cond1,itemdes,supname,qtyupdatestatus], function(err, result){
              if(!err)
              {
                console.log('updated state quantity');
                //res.status(200).json({"flag":"updated","state":val.state});
              }
              else{
                console.log(err);
                //res.status(200).json({"flag":"not updated"});
              }
            });
          }

        }
      }
      //console.log(JSON.stringify(splicearr));
      if(splicearr.length>0){
        return callback(splicearr);
        //res.status(200).json(splicearr);
      }
      else
      {
        if(oldnewarr.length==0){
          for(var i=0;i<newarr.length;i++)
          {
            splicearr[i]=newarr[i];
          }

        }
        if(oldnewarr.length==newarr.length){
          /*for(var i=0;i<newarr.length;i++)
           {
           splicearr[i]=oldnewarr[i];
           }*/

        }
        //res.status(200).json(splicearr);
        return callback(splicearr);
      }
    }
  });

}
//Function which insert copy of the existing state of items
exports.FnPhysicinsertupdate=function(pagename,response,callback){
  //console.log(response);
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }
  connection.query('INSERT INTO '+Config_tables[0]+' SET ?',[response],function(err,result){
    if(!err){
      return callback({"flag":"updated","inwardno":response.new_Inward_Register_Number});
      //res.status(200).json({"flag":"updated","inwardno":response.new_Inward_Register_Number});
    }
    else
    {
      //console.log("error......."+err);
      return callback({"flag":"not updated"});
      //res.status(200).json({"flag":"not updated"});
    }
  });
}
//Function which update the flow states
exports.FnFlowstateupdate=function(pagename,cond1,cond2,val,retstatus,callback){
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
    //console.log(Config_tables);
  }
  connection.query('UPDATE '+Config_tables[0]+' SET ? WHERE ? and ? ',[val,cond1,cond2], function(err, result){
    if(!err)
    {
      return callback({"flag":"updated","state":val.state});
      //res.status(200).json({"flag":"updated","state":val.state});
    }
    else{
      //console.log(err);
      return callback({"flag":"not updated"});
      //res.status(200).json({"flag":"not updated"});
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
  connection.query('SELECT distinct '+Config_columns[0]+','+Config_columns[1]+','+Config_columns[2]+' FROM '+Config_tables[0]+' WHERE ? and ?',[cond,cond1], function(err, rows, fields) {
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
      //res.status(200).json(itemarr);
      return callback(itemarr);
    }
  });
}

//Function for outward seq no generation
exports.FnOutwardSeq=function(pagename,cond,callback) {
console.log(cond);
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
      console.log('seq generated!');
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

  connection.query(query,function(err,rows,result){
   if(response.state!='spot'){
   if(rows.length==1){
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
        queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved','Supplied') and os.Item_Type_ID in(select distinct Item_Type_ID from OD_Stores_Intent_Items where (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='external') or (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Owner=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='internal')) or (os.Intent_State in('Approved') and os.state='internal') order by os.Intent_Register_Number DESC";
      else
        queryy="SELECT distinct os.Intent_Register_Number,os.Due_Date,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Created','Supplied') and os.Item_Type_ID in(select distinct Item_Type_ID from OD_Stores_Intent_Items where (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Approver=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='external') or (Item_Type_ID in(SELECT Item_Type_ID FROM OD_Intent_Item_Type where Intent_Owner=(SELECT department_ID FROM OD_HR_Employee_Job_Desc WHERE Emp_ID = '"+loggeduser+"')) and state='internal')) order by os.Intent_Register_Number DESC";

      //console.log(queryy);

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

    var queryy1="SELECT distinct os.Intent_Register_Number,os.Intent_Date,os.Intent_State,os.state,os.Unit_Measure,os.Quantity_Measure,os.Product_ID,os.unit,os.Quantity,item.Item_ID,wh.Store_Location_Name from OD_Stores_Intent_Items os join MD_Item item on(os.Product_ID=item.Item_Name) join MD_WH_Store_Location wh on(item.Store_Location_ID=wh.Store_Location_ID) where os.Intent_State in('Approved') and state='intenal'))";

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
exports.FnIntentStateUpdate=function(pagename,cond,cond1,updatecolumn,updaterolecolumn,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

  //console.log(updaterolecolumn);

  //console.log(JSON.stringify(ponumber)+" "+JSON.stringify(updatecolumn)+" "+JSON.stringify(updaterolecolumn)+" "+JSON.stringify(cond)+" "+JSON.stringify(cond1));
  connection.query('UPDATE OD_Stores_Intent_Items SET ? , ? WHERE ? and ?',[updatecolumn,updaterolecolumn,cond,cond1], function(err, rows) {
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
            console.log("Not Inserted!"+err);
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
            console.log("Not Inserted!"+err);
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
            console.log("Not Inserted!"+err);
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
  var queryy="SELECT * FROM "+Config_tables[0]+" where Supplier_ID not in(SELECT Item_Supplier_ID from OD_Item where Item_ID='"+itemid+"')";
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
      console.log(err);
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
  console.log(cond);
  console.log(response);
  connection.query('UPDATE MD_Supplier_Payment SET ? where ?',[response,cond],function(err,result){
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


//Function fecthes searched item info
exports.Fnreadsupplier=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
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
        var obj={"supplierid":"","suppliername":"","landmark":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":""};

        obj.supplierid=rows[i].Supplier_ID;
        obj.suppliername=rows[i].Supplier_Name;
        obj.landmark=rows[i].LandMark;
        obj.city=rows[i].City;
        obj.location=rows[i].Location;
        obj.district=rows[i].District;
        obj.state=rows[i].State;
        obj.country=rows[i].Country;
        obj.pincode=rows[i].Pincode;
        obj.phoneno=rows[i].Phone;
        obj.mobileno=rows[i].Mobile;
        obj.emailid=rows[i].Email;
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

//Function fecthes searched item info
exports.Fnreadpayment=function(pagename,cond,callback) {
  //console.log(pagename+"  "+JSON.stringify(cond));
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
        var obj={"paymenttype":"","bankname":"","accountno":"","address":"","paymentterm":""};

        obj.paymenttype=rows[i].Payment_Type;
        obj.bankname=rows[i].Bank_Name;
        obj.accountno=rows[i].Account_No;
        obj.address=rows[i].Bank_Address;
        obj.paymentterm=rows[i].Payment_Term;
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
exports.FnViewintentpromote=function(pagename,response,intentno,itemdes,updaterolecolumn,updatecolumn,oldcolumn,callback) {

  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }

    connection.query('INSERT INTO OD_Purchase_Order SET ?',[response],function(err,fields) {
        if(!err){
          connection.query('UPDATE OD_Stores_Intent_Items SET ? , ? WHERE ? and ?',[updatecolumn,updaterolecolumn,intentno,itemdes], function(err, rows) {

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
  console.log(queryy);
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


//Function which updates supplier info
exports.FnAddCustomer=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  connection.query('INSERT INTO MD_Sales_Customer_Detail SET ?',[response],function(err,result){
    if(!err)
    {
      return callback("succ");
    }
    else{
      return callback("fail");
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

//Function which addpayment info
exports.FnUpdatecustomerPayment=function(pagename,response,callback) {
  var Config_tables=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
    }
  }
  var cond={Customer_ID:response.Customer_ID};
  console.log(cond);
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
  var queryy="SELECT * FROM MD_Sales_Customer_Detail where Customer_ID not in(SELECT Item_Customer_ID from OD_Item where Item_ID='"+itemid+"')";
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
      for(var i=0;i<rows.length;i++)
      {
        var obj={"supplierid":"","suppliername":"","landmark":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":""};

        obj.supplierid=rows[i].Customer_ID;
        obj.suppliername=rows[i].Customer_Name;
        obj.landmark=rows[i].LandMark;
        obj.city=rows[i].City;
        obj.location=rows[i].Location;
        obj.district=rows[i].District;
        obj.state=rows[i].State;
        obj.country=rows[i].Country;
        obj.pincode=rows[i].Pincode;
        obj.phoneno=rows[i].Phone;
        obj.mobileno=rows[i].Mobile;
        obj.emailid=rows[i].Email;
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
      for(var i=0;i<rows.length;i++)
      {
        var obj={"paymenttype":"","bankname":"","accountno":"","address":"","paymentterm":""};

        obj.paymenttype=rows[i].Payment_Type;
        obj.bankname=rows[i].Bank_Name;
        obj.accountno=rows[i].Account_No;
        obj.address=rows[i].Bank_Address;
        obj.paymentterm=rows[i].Payment_Term;
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
  var queryy="select po.PO_Number,po.PO_Date,ps.Supplier_Name,ps.Location,ps.City,ps.District,ps.State,ps.Mobile from OD_Purchase_Order po join MD_Purchase_Supplier ps on(po.Supplier_Name=ps.Supplier_Name) where Intent_Register_Number='"+intentno+"' and Product_ID='"+itemdes+"'";
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

exports.Fnapprovesupplierforpurchase=function(pagename,supplierid,callback) {
  console.log('coming');
  var Config_tables=[];
  var Config_columnvalues=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columnvalues=obj[i].columnvalues;
    }
  }
  var queryy="UPDATE "+Config_tables[0]+" SET Status='"+Config_columnvalues[0]+"' where Supplier_ID='"+supplierid+"'";
   console.log(queryy);
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
