/**
 * Created by praba on 2/18/2016.
 */

/*JS file for intent-page*/
(function(){
  var itemarr=[];

  Polymer({
    is: "intent-page",
    ready:function()
    {
      //this.Supplier_Name="Supplier Name";
      //this.Supplier_Name_error="Enter supplier name";
      //this.nullflag=0;
      this.flag=0;
      this.itemflag=0;
      this.idd=0;
      this.hidespotorder=true;
      this.spotdisable=false;
      this.typedisable=false;
      localStorage.setItem("curr_sess_spotorderflag",'');
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"||sessionStorage.getItem("curr_sess_roleflag")=="2")
      {
        this.hidespotorder=false;
      }
      this.$.intentservice.FnIntentTypeListService();

      localStorage.setItem("curr_sess_unitset",this.idd);
      /*Dynamic array for creating rows of item card*/
      this.itemArray=[{id:this.idd,description:'',specification:'',received:'',unit:'',remark:'','measure':'','duedate':''}];
      this.splice('itemArray',1,1);
    },
    FnSetIntentType:function(intentarr){
      this.itemtypearr=intentarr;
    },
    FnSelectItemType:function(e){
      this.spotdisable=true;      
      var selectedtype=e.target.selectedItem.textContent.trim();
      document.querySelector('autocompleteitemlist-card').FnFetchSpecificTypeItem(selectedtype);
    },
    FnChangeSpot:function(e){      
      var spotorder=document.querySelector("#spotorder");
      if(spotorder.checked==true){
        this.typedisable=true;
        localStorage.setItem("curr_sess_spotorderflag",'true');
        document.querySelector('autocompleteitemlist-card').FnFetchSpotItems(true);
        
      }
      else{
        this.typedisable=false;
        localStorage.setItem("curr_sess_spotorderflag",'');
        document.querySelector('autocompleteitemlist-card').FnFetchSpotItems(false);        
      }
    },
    FnInputChanged:function(){
      //alert('yes');
      //this.nullflag=1;
    },
    FnGetFormattedDate:function(todayTime) {
      //alert(todayTime);        
        var month = todayTime .getMonth() + 1;
        if(month<10)
          month="0"+month;
        var day = todayTime .getDate();
        if(day<10)
          day="0"+day;
        var year = todayTime .getFullYear();
        return month + "/" + day + "/" + year;
      },
    FnSetIteminfo:function(specification,container,qtyreceived,remark){
      this.flag=1;
      //this.invoicedate=localStorage.getItem("localsess_curr_inwarddate");
      this.invoicedate=this.FnGetFormattedDate(new Date());
      this.specification=specification;
      this.container=container;
      this.qtyreceived=qtyreceived;
      this.remark=remark;
    },
    FnSetMenuinfo:function(itemdes,unit,measure){
      //alert(itemdes+"  "+unit);
      this.unit=unit;
      this.measure=measure;
      localStorage.setItem("curr_sess_showunitvalue",unit);
      localStorage.setItem("curr_sess_showmeasurevalue",measure);
      this.itemflag=1;
      this.itemdes=itemdes;
    },
    FnAddItem:function(e)
    {
      this.typedisable=true;
      if(localStorage.getItem("curr_sess_spotorderflag")=='true')      
      {
          document.querySelector('autocompleteitemlist-card').FnFetchSpotItems(true);
      }
      //alert(e.model.index);
      //this.$.supname.validate();
      if(this.flag!=1)
      {
        this.qtyreceived=null;
        this.remark=null;
      }
      if(this.itemflag!=1)
        this.itemdes=null;
      var existflag=0;
      var deleteflag=0;
      //alert(this.invoicedate+" "+this.itemdes+" "+this.specification+"" +this.measure+" "+this.container+" "+this.qtyreceived+" "+this.unit+" "+this.remark);
      if(this.itemdes=='deleted'||this.qtyreceived=='deleted'){
        deleteflag=1;
      }

      //if(this.container==null||this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.specification==0||this.specification=="")
      if(this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.specification==0||this.specification=="")
      {
        //if(this.nullflag==0){
        //alert('what?');
          //document.querySelector('#supname').validate();
        //}
        //else {
          if(this.itemdes==null)
            this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
          else if(this.specification==null||this.specification=="")
            this.$.ID_Show_Dialog.FnShowDialog("Specification should not be empty!","");
          // else if(this.container==null)
            // this.$.ID_Show_Dialog.FnShowDialog("Unit should not be empty!","");
          else if(this.qtyreceived==null||this.qtyreceived=="")
            this.$.ID_Show_Dialog.FnShowDialog("Quantity shouldn't be empty!","");
          //alert("All fields must want to be filled");
        //}
      }
      // else if(this.container<=0){
        // this.$.ID_Show_Dialog.FnShowDialog("Unit should be greater than 0!","");
      // }
      else if(this.qtyreceived<=0){
        this.$.ID_Show_Dialog.FnShowDialog("Quantity unit should be greater than 0!","");
      }
      else
      {
        //alert('coming'+existflag);
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
          //alert('okay');
          var obj={"state":"","invoicedate":"","duedate":"","specification":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
          if(localStorage.getItem("curr_sess_spotorderflag")=='true')
          obj.state='spot';
          else
          obj.state=''; 
          obj.duedate=localStorage.getItem("localsess_curr_inwarddate");
          obj.invoicedate=this.invoicedate;
          obj.itemdes=this.itemdes;
          obj.specification=this.specification;
          obj.qtyreceive=this.qtyreceived;
          obj.qtymeasure=this.unit;
          obj.remark=this.remark;
          obj.unit=this.container;
          obj.unitmeasure=this.measure;
          if(deleteflag!=1)
            itemarr.push(obj);
          this.idd=this.itemArray.length;
          localStorage.setItem("curr_sess_unitset",this.idd);
          //alert(JSON.stringify(itemarr));
          this.push('itemArray',{id:this.idd,description:'',specification:'',received:'',unit:'',remark:'','measure':'','duedate':''});
          //alert(JSON.stringify(this.itemArray.length));
          this.flag=0;
          this.itemflag=0;
        }
      }
    },
    FnSaveItem:function(){
      if(localStorage.getItem("curr_sess_saveflag")=="false"){
        if(this.flag!=1)
        {
          this.specification=null;
          this.qtyreceived=null;
          this.remark=null;
        }
        if(this.itemflag!=1)
          this.itemdes=null;
        var existflag=0;
        var deleteflag=0;
        //alert(this.invoiceno+"  "+this.invoicedate+"  "+this.vno+"  "+this.vname+"  "+this.dname+"  "+this.dno+" "+this.itemdes+" "+this.qtyreceived+" "+this.remark);
        if(this.itemdes=='deleted'||this.qtyreceived=='deleted'){
          deleteflag=1;
        }
        //if(this.container==null||this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.specification==null||this.specification=="")
        if(this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.specification==0||this.specification=="")
        {
          /*if(this.nullflag==0){
            document.querySelector('#supname').validate();
          }
          else {*/
            if(this.itemdes==null)
              this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
            else if(this.specification==null||this.specification=="")
              this.$.ID_Show_Dialog.FnShowDialog("Specification should not be empty!","");
            // else if(this.container==null)
              // this.$.ID_Show_Dialog.FnShowDialog("Unit should not be empty!","");
            else if(this.qtyreceived==null||this.qtyreceived=="")
              this.$.ID_Show_Dialog.FnShowDialog("Quantity shouldn't be empty!","");
            //alert("All fields must want to be filled");
          //}
        }
        // else if(this.container<=0){
          // this.$.ID_Show_Dialog.FnShowDialog("Unit should be greater than 0!","");
        // }
        else if(this.qtyreceived<=0){
          this.$.ID_Show_Dialog.FnShowDialog("Quantity unit should be greater than 0!","");
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
            var obj={"state":"","invoicedate":"","duedate":"","specification":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
            if(localStorage.getItem("curr_sess_spotorderflag")=='true')
            obj.state='spot';
            else
            obj.state='';
            obj.duedate=localStorage.getItem("localsess_curr_inwarddate");
            obj.specification=this.specification;
            obj.invoicedate=this.invoicedate;
            //obj.supplier=this.supname;
            obj.itemdes=this.itemdes;
            obj.qtyreceive=this.qtyreceived;
            obj.qtymeasure=this.unit;
            obj.unit=this.container;
            obj.unitmeasure=this.measure;
            obj.remark=this.remark;
            if(deleteflag!=1)
              itemarr.push(obj);
            //alert(JSON.stringify(itemarr));
            this.flag=0;
            this.itemflag=0;
            this.$.itemservice.FnIntentItemwriteService(itemarr);
          }
        }
      }
      else{
        alert("This Intent is already saved, Please click 'Create' for new intent!");
      }

    },
    FnDeleteItem:function(e)
    {
      itemarr.splice(e.model.index,1);
      this.splice('itemArray',e.model.index,1);
      this.itemdes='deleted';
      this.specification='deleted';
      this.qtyreceived='deleted';
      this.container='deleted';
      this.remark='deleted';
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
