/**
 * Created by praba on 2/10/2016.
 */
var mysql      = require('mysql');


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
      if(rows.length>0)
      {
         var depid={'Department_ID':rows[0].Department_ID};
         var roleid=rows[0].Role_ID;
         //Fetching Department of the logged user and identifying the role
         connection.query('SELECT * FROM '+ Config_tables[1] +' WHERE ? ',[depid], function(err, rows) {
          if(!err){
            if(rows.length>0)
            {
              var depname=rows[0].Department_Name;
              var Role_Name=depname+" "+roleid;
              var cond={"Role_Name":Role_Name};
              connection.query('SELECT * FROM '+ Config_tables[2] +' WHERE ? ',[cond], function(err, rows) {
                if(!err){
                  if(rows.length>0){
                    rolename=rows[0].Role_Name;
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
exports.FnFetchItemlist=function(pagename,wardflag,callback) {
  var queryy="";
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
  //Condition which form the query for the currently logged role
  if(wardflag=="0"){
  queryy="SELECT * FROM "+ Config_tables[0] +" WHERE "+ Config_columns[0] +" NOT IN('"+Config_columnvalue[0]+"','"+Config_columnvalue[1]+"')";
  }
  //Condition which form the query for the currently logged role
  else if(wardflag=="1"){
    queryy="SELECT * FROM "+ Config_tables[0] +" WHERE "+ Config_columns[0] +" IN('"+Config_columnvalue[0]+"','"+Config_columnvalue[1]+"')";
  }
  //Condition which form the query for the currently logged role
  else if(wardflag=="2"){
    queryy="SELECT * FROM "+ Config_tables[0];
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
     //  Response sending back to the server if it have the items
     if(itemarr.length>0)
       return callback(itemarr);

      else
       return callback("no items");
    }
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
  //Query fetches item info under the specific IRN Number with desired state
  connection.query('SELECT * FROM '+Config_tables[0]+' WHERE ? and ?',[cond,cond1], function(err, rows) {
    if(!err)
    {
      var itemarr=[];

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
      //Item Response sending back to the server
      return callback(itemarr);
    }
    else{
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
exports.FnIntentItemWrite=function(pagename,response,callback) {
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++){
    if(obj[i].name==pagename){
      Config_tables=obj[i].value;
      Config_columns=obj[i].columns;
    }
  }
  connection.query('SELECT '+Config_columns[0]+' FROM '+Config_tables[0]+' ORDER BY '+Config_columns[0]+' DESC LIMIT 1', function(err, rows, fields) {
    if(!err)
    {
      var idd="INT"+rows[0].Intent_Register_Number;

      response.Intent_Register_Number=idd;
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
  });
}

//Function which fetch the intent item info
exports.FnIntentItemRead=function(pagename,callback) {
  var Config_tables=[];
  var Config_columns=[];
  for(var i=0;i<obj.length;i++) {
    if (obj[i].name == pagename) {
      Config_tables = obj[i].value;
      Config_columns = obj[i].columns;
    }
  }
    cond={"state":Config_columns[2]};
    connection.query('SELECT distinct '+Config_columns[0]+','+Config_columns[1]+' FROM '+Config_tables[0]+' WHERE ? ORDER BY '+Config_columns[0]+' DESC',[cond], function(err, rows, fields) {
      var itemarr=[];
      if(!err){
        for(var i=0;i<rows.length;i++)
        {
          var obj={"intentregno":"","intentdate":"","state":""};
          obj.intentregno=rows[i].Intent_Register_Number;
          obj.intentdate=rows[i].Intent_Date;
          obj.state=rows[i].state;
          itemarr.push(obj);
        }
        return callback(itemarr);
      }
      else
        console.log(err);
    });

}

//Function fetches the expanded intent item card info
exports.FnIntentExpandItemFetch=function(pagename,cond,callback) {
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
        var obj={"specification":"","itemdes":"","quantity":"","qtymeasure":"","unit":"","unitmeasure":"","remark":""};
        obj.itemdes=rows[i].Product_ID;
        obj.specification=rows[i].Specification;
        obj.quantity=rows[i].Quantity;
        obj.qtymeasure=rows[i].Quantity_Measure;
        obj.unit=rows[i].unit;
        obj.unitmeasure=rows[i].Unit_Measure;
        obj.remark=rows[i].Remarks;
        itemarr.push(obj);
      }
      return callback({"itemarr":itemarr});
    }
    else{
      console.log(err);
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
            console.log("Not Inserted!"+idd+err);
            return callback("fail");
          }
        });
      }
      else
        return callback("duplicate entry");
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
exports.FnItemsupplierRead=function(pagename,callback) {
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
        var obj={"itemoptionalsupplier":"","itemsupplier":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""};
        obj.itemoptionalsupplier=rows[i].Item_Optional_Supplier_ID;
        obj.itemsupplier=rows[i].Item_Supplier_ID;
        obj.itemid=rows[i].Item_ID;
        obj.itemname=rows[i].Item_Name;
        obj.itemdes=rows[i].Item_Description;
        obj.container=rows[i].Container;
        obj.quantity=rows[i].UOM;
        obj.itemgroup=rows[i].Item_Group_ID;
        obj.itemtype=rows[i].Item_Type_ID;
        obj.purchasetype=rows[i].Item_Purchase_Type_ID;
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

/*exports.FnFetchsearchItemtype=function(pagename,typeid,callback) {
  cond={"Item_Type_ID":typeid}

  connection.query('select * from MD_Item_Type where ?',[cond],function(err, rows, fields) {
    if(!err){
      itemtype=rows[0].Item_Type_Name;
      return callback(itemtype);
    }
  });
}

exports.FnFetchsearchItemgroup=function(pagename,groupid,callback) {
  cond={"Item_Group_ID":groupid}
  connection.query('select * from MD_Item_Group where ?',[cond],function(err, rows, fields) {
    if(!err){
      itemgroup=rows[0].Item_Group_Name;
      return callback(itemgroup);
    }
  });
}*/


