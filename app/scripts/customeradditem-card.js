//JS file for the supplier-page
Polymer({
  is: "customeradditem-card",

  ready:function()
  {
  this.itemid="";
  this.itemname="";
  this.supplierid="";
  this.storesid="";
  this.storesarr="";
  localStorage.setItem("curr_sess_additemcustomerwrite","0");
   //Initially to make all the fields are in editable mode
   this.read=false;
   //Calling services to bind info to the itemtype , itemgroup and supplier fields
   this.$.adminservice.callItemPurchasetypeReadService();
   this.$.adminservice.callItemReadService();
   this.$.adminservice.callItemgroupReadService();
   this.$.adminservice.callContainerReadService();
   this.$.adminservice.callUnitReadService();
   localStorage.setItem("curr_sess_showpage","customeradditem-card");
   //calling webcomponent service to fetch labels for current page
   this.$.ID_Webcomponent_Service.callWebcomponentService();
  },
  FnSelectcontainer:function(e){
    document.querySelector('customeradditem-card').FnContainerChange((e.target.selectedItem.textContent).trim());
  },
  FnSelectunit:function(e){
    document.querySelector('customeradditem-card').FnQuantityChange((e.target.selectedItem.textContent).trim());
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
    document.querySelector('#dropitemtype').validate();
    document.querySelector('#dropgrouptype').validate();
    document.querySelector('#supplier').validate();
	//Fetching selected radio button value
	var purchasetype=this.querySelector('#radio').selected;
	for(var i=0;i<this.purchasearr.length;i++){
    if(this.querySelector('#radio').selected==this.purchasearr[i].purchasetypename)
    this.itemflag=this.purchasearr[i].purchasetypeid;
	}  
	if(this.itemid==null||this.itemid==""||this.itemname==null||this.itemname==""||this.itemdes==null||this.itemdes==""||this.container==null||this.container==""||this.itemgroup==null||this.itemgroup==""||this.itemtype==null||this.itemtype==""){
	}
	else
	{   
	localStorage.setItem("curr_sess_additemcustomerwrite","1");
  // Function which calls service to add the customer information
	this.$.adminservice.callCustomerItemWriteService(localStorage.getItem('curr_sess_customerloggedid'),this.supplier,this.itemflag,this.itemid,this.itemname,this.itemdes,this.container,this.quantity,this.itemgroup,this.itemtype,this.storesid,purchasetype);
	}
  // After adding customer info which clear the field info
  document.querySelector('stores-card').FnClear();
  document.querySelector('itemsearch-card').FnSetClearFields();
  this.itemdes="";
  document.querySelector('#dropcontainertype').selected=-1;
  document.querySelector('#dropunittype').selected=-1;
  document.querySelector('#dropitemtype').selected=-1;
  document.querySelector('#dropgrouptype').selected=-1;
  document.querySelector('#radio').selected=-1;
  this.read=false;
},
// Function which receives the customer id and name from customer card
FnSetValue:function(supplierid,suppliername){
	this.supplierid=supplierid;
	this.supplier=suppliername; 
},
// Function which disable the buttons
FnBtnDisable:function(){
	document.querySelector('#save').style.backgroundColor='grey';
	this.Btn_disable_flag=true;
},
// Function which receives the item info
FnSetItemValue:function(itemid,itemname,itemdes,container,quantity,itemtype,itemgroup,selection){
	this.itemid=itemid;
	this.itemname=itemname;
	this.itemdes=itemdes;
	this.containertype=container;
	this.unittype=quantity;
  this.container=container;
  this.quantity=quantity;
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
// Function which receives stores info from stores card
FnSetStoresInfo:function(storesarr,storesid){
    this.storesarr=storesarr;
    this.storesid=storesid;
},
// Function which receives the item id
FnSetItemId:function(itemid){
	this.itemid=itemid;
},
// Function which receives the item name
FnSetItemName:function(itemname){
	this.itemname=itemname;
},
// Function which used to reset the fields
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
// Function which toggle the read state of the stores card in search and edit mode
FnSetEnableDisableFields:function(flag){
  document.querySelector("stores-card"). FnEnableFields(flag);
  this.read=flag;
},
// Function which receive the container value from container card
FnContainerChange:function(container){
this.container=container;
},
// Function which receive the container value from quantity card
FnQuantityChange:function(quantity){
this.quantity=quantity;
}
});
