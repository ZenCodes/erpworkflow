/**
 * Created by praba on 2/13/2016.
 */
//JS file for outward item page
(function(){
  var itemarr=[];

  Polymer({
    is: "outwarditem-page",
    ready:function()
    {
      //this.nullflag=0;
      this.flag=0;
      this.itemflag=0;
      this.idd=0;
      this.custflag=0;
      //this.invoiceflag=0;
      localStorage.setItem("curr_sess_unitset",this.idd);
      this.itemArray=[{id:this.idd,description:'',quantity:'',unit:'',measure:'',weight:''}];
      this.splice('itemArray',1,1);
    },
    FnInputChanged:function(supplierid,suppliername){
      //alert(supplierid);
      this.custflag=1;
      this.supid=supplierid;
      this.customername=suppliername;
      this.nullflag=1;
  
    },
    FnRefreshPage:function(){
      this.flag=0;
      this.itemflag=0;
      this.idd=0;
      this.custflag=0;
      this.invoiceno="";
      this.customername="";
      localStorage.setItem("curr_sess_unitset",this.idd);
      itemarr.splice(0,(itemarr.length)+1);
      this.splice('itemArray',1,(this.itemArray.length)+1);
      document.querySelector('item-card').FnsetValue();
      document.querySelector('autocompleteitemlist-card').FnsetValue();
    },
    //Function receives customer info from customer info page
    FnSetCustomerinfo:function(outdate,outtime,customername,city)
    {
      this.outdate=outdate;
      this.outtime=outtime;
      this.customername=customername;
      //this.invoiceno=invoiceno;
      this.city=city;
      //this.custflag=1;
      //alert(this.outdate+"  "+this.outtime+"  "+this.customername+"  "+this.invoiceno+" "+this.city);
    },
    //Function receives vehicle info from vehicle info page
    FnSetVehicleinfo:function(outdate,outtime,city,vehicleno,transportname,drivername,driverno,ownername,ownerphone,panno)
    {
      this.outdate=outdate;
      this.outtime=outtime;
      this.city=city;
      this.vehicleno=vehicleno;
      this.transportname=transportname;
      this.drivername=drivername;
      this.driverno=driverno;
      this.ownername=ownername;
      this.ownerphone=ownerphone;
      this.panno=panno;
      //alert(vehicleno+"  "+transportname+"  "+drivername+"  "+driverno+"  "+ownername+"  "+ownerphone+"  "+panno);
    },
    //Function receives item info from item page
    FnSetIteminfo:function(quantity,weight){
      this.flag=1;
      this.quantity=quantity;
      this.weight=weight;
      //alert(quantity+ "  "+weight);
    },
    //Function receives unit and measurements from autocomplete item page
    FnSetMenuinfo:function(itemdes,unit,measure){
      //alert(itemdes+"  "+unit+"  "+measure);
      this.unit=unit;
      this.measure=measure;
      localStorage.setItem("curr_sess_showunitvalue",unit);
      localStorage.setItem("curr_sess_showmeasurevalue",measure);
      this.itemflag=1;
      this.itemdes=itemdes;
    },
    //Function invokes when adding item
    FnAdditem:function(e)
    {
      //alert(e.model.index);
      //this.$.supname.validate();
      if(this.flag!=1)
      {
        this.quantity=null;
        this.weight=null;
      }
      if(this.itemflag!=1){
        this.itemdes=null;
        this.weight=null;
      }
      if(this.custflag!=1)
      this.invoiceno=null;
      var existflag=0;
      var deleteflag=0;
      //alert(this.outdate+"  "+this.outtime+"  "+this.customername+"  "+this.invoiceno+"  "+this.city);
      //alert(this.vehicleno+"  "+this.transportname+"  "+this.drivername+"  "+this.driverno+"  "+this.ownername+"  "+this.ownerphone+"  "+this.panno);
      //alert(this.invoiceno+"  "+this.quantity+"  "+this.itemdes+"  "+this.unit+"  "+this.weight);
      if(this.itemdes=='deleted'||this.quantity=='deleted'){
        deleteflag=1;
      }
      //if(this.customername==""||this.customername==null||this.itemdes==null||this.itemdes==""||this.quantity==null||this.quantity==""||this.weight==null||this.weight==""||this.invoiceno==null||this.invoiceno=="")
      if(this.itemdes==null||this.itemdes==""||this.weight==null||this.weight==""||this.invoiceno==null||this.invoiceno=="")
      {
        if(this.invoiceno==null||this.invoiceno=="") {
          document.querySelector('#invoiceno').validate();
        }
        //else if(this.customername==""||this.customername==null)
          //document.querySelector('#customername').validate();
        else if(this.itemdes==null||this.itemdes=="")
          this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
        // else if(this.quantity==null||this.quantity=="")
          // this.$.ID_Show_Dialog.FnShowDialog("Enter quantity unit!","");
        else if(this.weight==null||this.weight=="")
          this.$.ID_Show_Dialog.FnShowDialog("Enter weight unit!","");
        //alert("All fields must want to be filled");
      }
      // else if(this.quantity<=0){
        // this.$.ID_Show_Dialog.FnShowDialog("Quantity unit should be greater than 0!","");
      // }
      else if(this.weight<=0){
        this.$.ID_Show_Dialog.FnShowDialog("Weight should be greater than 0!","");
      }
      else
      {
        for(var i=0;i<itemarr.length;i++)
        {
          if(itemarr[i].itemdes==this.itemdes){
            existflag=1;
            this.$.ID_Show_Dialog.FnShowDialog("Item already exist!","");
          }
          if(existflag==1){
          }
        }
        if(existflag==0){
          var obj={"outdate":"","outtime":"","customername":"","invoiceno":"","city":"","vehicleno":"","transportname":"","drivername":"","driverno":"","ownername":"","ownerphone":"","panno":"","quantity":"","unit":"","measure":"","itemdes":"","weight":""};
          obj.outdate=this.outdate;
          obj.outtime=this.outtime;
          obj.customername=this.customername;
          obj.invoiceno=this.invoiceno;
          obj.city=this.city;
          obj.vehicleno=this.vehicleno;
          obj.transportname=this.transportname;
          obj.drivername=this.drivername;
          obj.driverno=this.driverno;
          obj.ownername=this.ownername;
          obj.ownerphone=this.ownerphone;
          obj.panno=this.panno;
          obj.itemdes=this.itemdes;
          obj.unit=this.unit;
          obj.measure=this.measure;
          obj.quantity=(this.quantity)+" "+(this.measure);
          obj.weight=(this.weight)+" "+(this.unit);
          if(deleteflag!=1)
            itemarr.push(obj);
          this.idd=this.itemArray.length;
          localStorage.setItem("curr_sess_unitset",this.idd);
          //alert(obj);
          this.push('itemArray',{id:this.idd,description:'',quantity:'',unit:'',measure:'',weight:''});
          document.querySelector('autocompleteitemlist-card').FnFetchSpecificItem(this.supid,this.supname);
          //alert(JSON.stringify(itemarr));
          this.flag=0;
          this.itemflag=0;
        }
      }
    },
    //Function invokes when click on save
    FnSaveItem:function(){
      if(localStorage.getItem("curr_sess_saveflag")=="false"){
        if(this.flag!=1)
        {
          this.quantity=null;
          this.weight=null;
        }
        if(this.itemflag!=1){
          this.itemdes=null;
          this.weight=null;
        }
        if(this.custflag!=1)
        this.invoiceno=null;
        var existflag=0;
        var deleteflag=0;
        if(this.itemdes=='deleted'||this.quantity=='deleted'){
          deleteflag=1;
        }
        //if(this.customername==""||this.customername==null||this.itemdes==null||this.itemdes==""||this.quantity==null||this.quantity==""||this.weight==null||this.weight==""||this.invoiceno==null||this.invoiceno=="")
        if(this.itemdes==null||this.itemdes==""||this.weight==null||this.weight==""||this.invoiceno==null||this.invoiceno=="")
        {
          if(this.invoiceno==null||this.invoiceno=="")
            document.querySelector('#invoiceno').validate();
          //else if(this.customername==""||this.customername==null)
            //document.querySelector('#customername').validate();
          else if(this.itemdes==null||this.itemdes=="")
            this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
          // else if(this.quantity==null||this.quantity=="")
            // this.$.ID_Show_Dialog.FnShowDialog("Enter quantity unit!","");
          else if(this.weight==null||this.weight=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter weight unit!","");
          //alert("All fields must want to be filled");
        }
        // else if(this.quantity<=0){
          // this.$.ID_Show_Dialog.FnShowDialog("Quantity unit should be greater than 0!","");
        // }
        else if(this.weight<=0){
          this.$.ID_Show_Dialog.FnShowDialog("Weight should be greater than 0!","");
        }
        else
        {
          for(var i=0;i<itemarr.length;i++)
          {
            if(itemarr[i].itemdes==this.itemdes){
              existflag=1;
              alert("Item already exist!");
            }
            if(existflag==1){
            }
          }
          if(existflag==0){
            var obj={"outdate":"","outtime":"","customername":"","invoiceno":"","city":"","vehicleno":"","transportname":"","drivername":"","driverno":"","ownername":"","ownerphone":"","panno":"","quantity":"","unit":"","measure":"","itemdes":"","weight":""};
            obj.outdate=this.outdate;
            obj.outtime=this.outtime;
            obj.customername=this.customername;
            obj.invoiceno=this.invoiceno;
            obj.city=this.city;
            obj.vehicleno=this.vehicleno;
            obj.transportname=this.transportname;
            obj.drivername=this.drivername;
            obj.driverno=this.driverno;
            obj.ownername=this.ownername;
            obj.ownerphone=this.ownerphone;
            obj.panno=this.panno;
            obj.itemdes=this.itemdes;
            obj.unit=this.unit;
            obj.measure=this.measure;
            obj.quantity=(this.quantity)+" "+(this.measure);
            obj.weight=(this.weight)+" "+(this.unit);
            if(deleteflag!=1)
              itemarr.push(obj);
            //alert(JSON.stringify(itemarr));
            this.itemdes='deleted';
            this.quantity='deleted';
            this.weight='deleted';
            this.flag=1;
            this.itemflag=1;
            if(localStorage.getItem('curr_sess_outinvoiceflag')=="1") {
            for(var i=0;i<itemarr.length;i++){
              itemarr[i].invoiceno=this.invoiceno;
            }
            }
            //alert(JSON.stringify(obj));
            this.$.itemservice.FnSeqItemwriteService(itemarr);
          }
        }
        //document.querySelectorAll("paper-input").readonly=true;
        //alert(this.querySelector("item-card"));
      }
      else{

        alert("Item already saved..!Click create to enter another invoice!");
      }

    },
    //Function invokes when click on delete icon
    FnDeleteItem:function(e)
    {
      itemarr.splice(e.model.index,1);
      this.splice('itemArray',e.model.index,1);
      this.itemdes='deleted';
      this.quantity='deleted';
      this.weight='deleted';
      this.flag=1;
      this.itemflag=1;
      //alert(JSON.stringify(itemarr));
    },
    FnBtnDisable:function(){
      document.querySelector('#save').style.backgroundColor='grey';
      document.querySelector('#additem').style.backgroundColor='grey';
      this.Btn_disable_flag=true;
    }
  });
})();
