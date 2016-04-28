/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "supplieradditem-card",

  ready:function()
  {
  this.itemid="";
  this.itemname="";
  this.supplierid="";
  this.storesid="";
  this.storesarr="";
  localStorage.setItem("curr_sess_additemsupplierwrite","0");
   //Initially to make all the fields are in editable mode
   this.read=false;
   //Calling services to bind info to the itemtype , itemgroup and supplier fields
   this.$.adminservice.callItemPurchasetypeReadService();
   this.$.adminservice.callItemReadService();
   this.$.adminservice.callItemgroupReadService();
   localStorage.setItem("curr_sess_showpage","supplieradditem-card");
   //calling webcomponent service to fetch labels for current page
   this.$.ID_Webcomponent_Service.callWebcomponentService();
  },
  //Method invokes to fetch item id of the currently selected Item type name in dropdown
    FnSelecttype:function(e){
      //Flag is used to identify the itemtype drop down change and it is later refered in update mode
      localStorage.setItem("curr_sess_itemtypechangeflag","1");
      var itemarray=this.itemarr;
      this.itemtypename=(e.target.selectedItem.textContent).trim();
      for(var i=0;i<itemarray.length;i++)
      {
         if(itemarray[i].itemtypename==this.itemtypename) {
          this.itemtype = itemarray[i].itemtypeid;
        }
      }
    },
    //Method invokes to fetch item group id of the currently selected Item group name in dropdown
    FnSelectGrouptype:function(e){
      //Flag is used to identify the itemgroup drop down change and it is later refered in update mode
      localStorage.setItem("curr_sess_grouptypechangeflag","1");
      var itemgrouparray=this.itemgrouparr;
      this.itemgroupname=(e.target.selectedItem.textContent).trim();
      for(var i=0;i<itemgrouparray.length;i++)
      {
         if(itemgrouparray[i].itemgroupname==this.itemgroupname) {
          this.itemgroup = itemgrouparray[i].itemgroupid;
        }

      }
  },
FnAddItemSubmit:function(){
//Fields mandatory validation performing here
    document.querySelector('#itemid').validate();
    document.querySelector('#itemname').validate();
    document.querySelector('#itemdes').validate();
    //document.querySelector('#container').validate();
    //document.querySelector('#quantity').validate();
    document.querySelector('#dropitemtype').validate();
    document.querySelector('#dropgrouptype').validate();
    document.querySelector('#supplier').validate();
	//Fetching selected radio button value
	var purchasetype=document.querySelector('#radio').selected;

	for(var i=0;i<this.purchasearr.length;i++){
    if(document.querySelector('#radio').selected==this.purchasearr[i].purchasetypename)
    this.itemflag=this.purchasearr[i].purchasetypeid;
	}
	if(this.itemid==null||this.itemid==""||this.itemname==null||this.itemname==""||this.itemdes==null||this.itemdes==""||this.container==null||this.container==""||this.itemgroup==null||this.itemgroup==""||this.itemtype==null||this.itemtype==""||purchasetype==""||purchasetype==null){
	}
	else
	{
	//this.$.adminsupplierservice.additemService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, this.supplier,purchasetype);
	//alert(this.supplier+" "+this.itemflag+"  "+this.itemid+"  "+this.itemname+"  "+this.itemdes+"  "+this.container+"  "+this.quantity+"  "+this.itemgroup+" "+this.itemtype+" "+purchasetype);
  localStorage.setItem("curr_sess_additemsupplierwrite","1");
	this.$.adminservice.callItemWriteService(this.price,this.supplierid,this.supplier,this.itemflag,this.itemid,this.itemname,this.itemdes,this.container,this.quantity,this.itemgroup,this.itemtype,this.storesid,purchasetype);
	}
  document.querySelector('stores-card').FnClear();
},
FnSetValue:function(supplierid,suppliername){
	this.supplierid=supplierid;
	this.supplier=suppliername;
 // this.supplierid=localStorage.getItem("curr_sess_supplieradditemtab_supplierid");
 // this.suppliern=localStorage.getItem("curr_sess_supplieradditemtab_suppliername");
},
FnBtnDisable:function(){
	document.querySelector('#save').style.backgroundColor='grey';
	this.Btn_disable_flag=true;
},
FnSetItemValue:function(itemid,itemname,itemdes,container,quantity,itemtype,itemgroup,selection){
	this.itemid=itemid;
	this.itemname=itemname;
	this.itemdes=itemdes;
	//this.container=container;
	//this.quantity=quantity;
	for(var i=0;i<this.itemarr.length;i++){
	   if(this.itemarr[i].itemtypeid==itemtype)
	      this.itemtype=this.itemarr[i].itemtypename;
	}
	for(var i=0;i<this.itemgrouparr.length;i++){
	   if(this.itemgrouparr[i].itemgroupid==itemgroup)
	      this.itemgroup=this.itemgrouparr[i].itemgroupname;
    }
    for(var i=0;i<this.purchasearr.length;i++){
	   if(this.purchasearr[i].purchasetypeid==selection)
	      this.selection=this.purchasearr[i].purchasetypename;
    }
  
},
 FnSetStoresInfo:function(storesarr,storesid){    
    this.storesarr=storesarr;
    this.storesid=storesid;    
  },
FnSetItemId:function(itemid){

	this.itemid=itemid;

},
FnSetItemName:function(itemname){

	this.itemname=itemname;

},
FnSetClearFields:function(){
	this.itemid="";
	this.itemname="";
	this.itemdes="";
	this.container="";
	this.quantity="";
	this.itemtype="";
	this.itemgroup="";
	this.selection="";

},
FnSetEnableDisableFields:function(flag){
  document.querySelector("stores-card"). FnEnableFields(flag);
  this.read=flag;
},
FnSetPrice:function(price){
this.price=price;
},
FnContainerChange:function(container){
this.container=container
},
FnQuantityChange:function(quantity){
this.quantity=quantity;
}
});
