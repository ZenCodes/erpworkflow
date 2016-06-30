/**
 * Created by praba on 2/26/2016.
 */
 // JS component for admin service component
(function() {
	var suparr=[];
	var flag=0;
	var arrlength=0;
  var supobj;
  Polymer({
    is: "admin-service",
    ready: function () {
    },
    //Method invokes while making write req from the additem card
    callItemWriteService:function(price,itemoptionalsupplier,itemsupplier,itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,storeslocation,purchasetype){
		var obj={
      "itemoptionalsupplier" :"","itemsupplier" :"","itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","storeslocation":"","purchasetype":""
    };
      supobj={"supplierid" :"","price":""};
      supobj.price=price;
      obj.itemflag=itemflag;
      obj.itemid=itemid;
      obj.itemname=itemname;
      obj.itemdes=itemdes;
      obj.container=container;
      obj.quantity=quantity;
      obj.itemgroup=itemgroup;
      obj.itemtype=itemtype;
      obj.storeslocation=storeslocation;
      obj.purchasetype=purchasetype;
		 
      if(localStorage.getItem("curr_sess_additemsupplierwrite")=="1"){
      supobj.supplierid=itemoptionalsupplier;      
      if(suparr.length>0){
      // Adding suppliers againt the item which is not already attached with the supplier
      for(var i=0;i<suparr.length;i++){		  
		  if((supobj.supplierid)!=(suparr[i].supplierid))
		  suparr.push(supobj);
	    }
  	  }
  	  else
  	  {
		  suparr.push(supobj);
	    }
      this.callItemWriteSupplierService(itemid,suparr);
  	  }
      this.param=obj;
      // Making request to write item information
      this.url=sessionStorage.getItem("curr_sess_url")+"additem-service";
      this.$.additemwriteajax.generateRequest();
    },
    //Response receiving after making write request
    additemwriteResponse:function(e){
      // Condition will invoke when item added successfully
      if(e.detail.response.returnval=="succ"){
  		this.$.dialogpage.FnShowDialog("Item saved successfully!!","");
      }
      // Condition will invoke when duplicate item entry
      else if(e.detail.response.returnval=="duplicate entry"){
      if(localStorage.getItem("curr_sess_supplieritemsearchflag")!="1")
      this.$.dialogpage.FnShowDialog("Item ID already exists!!","duplicate entry");
      }
      // Condition will invoke when item failed to add
      else
      this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    },
	  callItemWriteSupplierService:function(itemid,itemArray){
		var arr=itemArray;
		arrlength=arr.length;
		for(var i=0;i<arr.length;i++){
			var obj={"itemid":"","supplierid":"","price":""};
			obj.itemid=itemid;
			obj.supplierid=arr[i].supplierid;
      obj.price=arr[i].price;
		  this.writesupplierparam=obj;
      // Making request to add item against the supplier
		  this.writesupplierurl=sessionStorage.getItem("curr_sess_url")+"additemsupplier-service";
      this.$.additemwritesupplierajax.generateRequest();
    }
	  },
    additemwritesupplierResponse:function(e){
    //Condition will invoke when item added against the supplier 
		if(e.detail.response.returnval=="succ"){
		flag=flag+1;
		if(arrlength==flag){
		alert("Item Added with supplier successfully!!");
    // After adding item which shows the item added
    document.querySelector('supplier-page').setPage('Show Item');
    // Fetching item added against the supplier
    document.querySelector('supplieritem-card').FnFetchItemInfo(supobj.supplierid,"");
		// Clearing additem card field inforamation after adding items
    document.querySelector('supplieradditem-card').FnSetClearFields();
    // Clearing item search field after adding item
		document.querySelector('itemsearch-card').FnSetClearFields();
		flag=0;
	  }
		}
    // Condition will invoke while making duplicate entry
		else if(e.detail.response.returnval=="duplicate entry"){
      alert("Item already exists against this supplier!!");
		}
	},
    //Method invokes while making req to fetch purhase type info
    callItemPurchasetypeReadService:function(){
      this.purchasetypeurl=sessionStorage.getItem("curr_sess_url")+"additempurchasetype-service";
      this.$.purchasetypereadajax.generateRequest();
    },
    // Method will retrieve purchase types 
    purchasetypereadResponse:function(e) {
    var itemarray=e.detail.response.itemarr;
    // Purchase will be added to all the cards
    document.querySelector('additem-card').purchasearr=itemarray;
 	  document.querySelector('supplieradditem-card').purchasearr=itemarray;
    document.querySelector('customeradditem-card').purchasearr=itemarray;
 	},
    //Method invokes while making req to fetch item type info
    callItemReadService:function(){
      this.readurl=sessionStorage.getItem("curr_sess_url")+"additemread-service";
      this.$.additemreadajax.generateRequest();
    },
    // Fetching item inforamtion and binding to the respective cards
    additemreadResponse:function(e) {
      var itemarray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemarr=itemarray;
      document.querySelector('supplieradditem-card').itemarr=itemarray;
      document.querySelector('customeradditem-card').itemarr=itemarray;
    },
    //Method invokes while making req to fetch group type info
    callItemgroupReadService:function(){
      this.groupurl=sessionStorage.getItem("curr_sess_url")+"additemgroupread-service";
      this.$.additemgroupreadajax.generateRequest();
    },
    // Fectching itemgroup information an dbinding to the respective cards
    additemgroupreadResponse:function(e) {
      var itemgrouparray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemgrouparr=itemgrouparray;
      document.querySelector('supplieradditem-card').itemgrouparr=itemgrouparray;
      document.querySelector('customeradditem-card').itemgrouparr=itemgrouparray;
    },
    //Method invokes while making req to fetch supplier info
    callItemSupplierReadService:function(){
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
      this.$.itemsupplierreadajax.generateRequest();
    },
    // Fetching and binding supplier information 
    itemsupplierreadResponse:function(e) {
      var itemsupplierarray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemsupplierarr=itemsupplierarray;
      document.querySelector('additem-card').itemoptionalsupplierarr=itemsupplierarray;
    },
    //Method invokes while making req to fetch container info
    callContainerReadService:function(){
      this.containerreadurl=sessionStorage.getItem("curr_sess_url")+"containerread-service";
      this.$.containerreadajax.generateRequest();
    },
    // Fetching and binding container information to the respective cards
    containerreadResponse:function(e) {
      var containerarray=e.detail.response.itemarr;
      if(document.querySelector('container-card')==null){}
      else
      document.querySelector('container-card').containerarr=containerarray;      
      document.querySelector('customeradditem-card').containerarr=containerarray;
    },
     //Method invokes while making req to fetch container info
    callUnitReadService:function(){
      this.unitreadurl=sessionStorage.getItem("curr_sess_url")+"unitread-service";
      this.$.unitreadajax.generateRequest();
    },
    //Method invokes while making req to fetch unit info
    unitreadResponse:function(e) {
      var unitarray=e.detail.response.itemarr;
      if(document.querySelector('unit-card')==null){}
      else
      document.querySelector('unit-card').unitarr=unitarray;      
      document.querySelector('customeradditem-card').unitarr=unitarray;
    },
    //Method invokes while making req for fetch all the info of the currently selected item in listbox
    callSearchService:function(itemid,itemname){
      this.searchurl=sessionStorage.getItem("curr_sess_url")+"addsearchitem-service";
      var obj={"itemid":"","itemname":""};
      obj.itemid=itemid;
      obj.itemname=itemname;
      this.searchparam=obj;
      this.$.additemsearchajax.generateRequest();
    },
    additemsearchResponse:function(e){		
    var arr= e.detail.response.itemarr;    
    // Condition will invoke to bind the searched item info to the supplier page add itemcard
    if(localStorage.getItem("curr_sess_wardflag")=="4"){
	  document.querySelector("itemsearch-card").itemid=arr[0].itemid;
    document.querySelector("itemsearch-card").itemname=arr[0].itemname;
    document.querySelector("container-card").FnSetContainer(arr[0].container);
    document.querySelector("unit-card").FnSetQuantity(arr[0].quantity);
 	  document.querySelector("supplieradditem-card").FnSetItemValue(arr[0].itemid,arr[0].itemname,arr[0].itemdes,arr[0].container,arr[0].quantity,arr[0].itemtype,arr[0].itemgroup,arr[0].purchasetype);
    document.querySelector("stores-card").FnSetDefaultValue(arr[0].storeslocation);
    }
    // Condition will invoke to bind the searched item info to the customer page add itemcard
    if(localStorage.getItem("curr_sess_wardflag")=="6"){  
    document.querySelector("itemsearch-card").FnSetItemId(arr[0].itemid);
    document.querySelector("itemsearch-card").itemname=arr[0].itemname;
    document.querySelector("container-card").FnSetContainer(arr[0].container);
    document.querySelector("unit-card").FnSetQuantity(arr[0].quantity);
    document.querySelector("customeradditem-card").FnSetItemValue(arr[0].itemid,arr[0].itemname,arr[0].itemdes,arr[0].container,arr[0].quantity,arr[0].itemtype,arr[0].itemgroup,arr[0].purchasetype);
    document.querySelector("stores-card").FnSetDefaultValue(arr[0].storeslocation);
    }
    // Condition will invoke to bind the searched item info to the additem page add itemcard
	  if(localStorage.getItem("curr_sess_wardflag")==""){    
      document.querySelector('supplier-list').FnSpecificSupplierReadService(arr[0].itemid);
      document.querySelector('customer-list').FnSpecificSupplierReadService(arr[0].itemid);
      document.querySelector("additem-card").itemid=arr[0].itemid;
      document.querySelector("additem-card").itemname=arr[0].itemname;
      document.querySelector("additem-card").itemdes=arr[0].itemdes;
      document.querySelector("additem-card").container=arr[0].container;
      document.querySelector("additem-card").quantity=arr[0].quantity;
      document.querySelector("container-card").FnSetContainer(arr[0].container);
      document.querySelector("unit-card").FnSetQuantity(arr[0].quantity);
      document.querySelector("stores-card").FnSetDefaultValue(arr[0].storeslocation);
      document.querySelector("additem-card").setSelectedItem(arr[0].itemtype,arr[0].itemgroup,arr[0].purchasetype);
      document.querySelector("supplier-detail").FnSetItemid(arr[0].itemid,arr[0].itemtype);
	  }
    },
    //Method invokes while making update request from item card
    callItemUpdateService:function(itemoptionalsupplier,itemsupplier,itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,storeslocation,purchasetype){
      var obj={
        "itemoptionalsupplier":"","itemsupplier":"","itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","storeslocation":"","purchasetype":""
      };
      obj.itemflag=itemflag;
      obj.itemid=itemid;
      obj.itemname=itemname;
      obj.itemdes=itemdes;
      obj.container=container;
      obj.quantity=quantity;
      obj.itemgroup=itemgroup;
      obj.itemtype=itemtype;
      obj.storeslocation=storeslocation;
      obj.purchasetype=purchasetype;
      this.updateparam=obj;
      this.updateurl=sessionStorage.getItem("curr_sess_url")+"additemupdate-service";
      this.$.additemupdateajax.generateRequest();
    },
    //Response for item update req
    additemupdateResponse:function(e){
      if(e.detail.response.returnval=="succ"){
        this.$.dialogpage.FnShowDialog("Item updated successfully!!","");       
      }
      else
        this.$.dialogpage.FnShowDialog("Failed to update the item!!","");
    },
    //Method invokes while making write req from the additem card
    callCustomerItemWriteService:function(itemoptionalsupplier,itemsupplier,itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,storeslocation,purchasetype){
    var obj={
      "itemoptionalsupplier" :"","itemsupplier" :"","itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","storeslocation":"","purchasetype":""
    };
      supobj={"supplierid" :""};
      obj.itemflag=itemflag;
      obj.itemid=itemid;
      obj.itemname=itemname;
      obj.itemdes=itemdes;
      obj.container=container;
      obj.quantity=quantity;
      obj.itemgroup=itemgroup;
      obj.itemtype=itemtype;
      obj.storeslocation=storeslocation;
      obj.purchasetype=purchasetype;
      // Adding customer against the item
      if(localStorage.getItem("curr_sess_additemcustomerwrite")=="1"){
      supobj.supplierid=itemoptionalsupplier;
      // Adding customer against the item who is not already attached to the item
      if(suparr.length>0){
      for(var i=0;i<suparr.length;i++){      
      if((supobj.supplierid)!=(suparr[i].supplierid))
      suparr.push(supobj);
      }
      }
      else
      {
      suparr.push(supobj);
      }
      // Calling service to write the customer against the item
      this.callItemWriteCustomerService(itemid,suparr);
      }
      this.customerparam=obj;
      // Function will make request to additem against
      this.customerurl=sessionStorage.getItem("curr_sess_url")+"additem-service";
      this.$.addcustomeritemwriteajax.generateRequest();
    },
    //Response receiving after making write request
    addcustomeritemwriteResponse:function(e){
      // Condition will invoke when added item successfully
      if(e.detail.response.returnval=="succ"){
      this.$.dialogpage.FnShowDialog("Item saved successfully!!","");
      }
      // Condition will invoke when found duplicate item 
      else if(e.detail.response.returnval=="duplicate entry"){
      if(localStorage.getItem("curr_sess_supplieritemsearchflag")!="1")
      this.$.dialogpage.FnShowDialog("Item ID already exists!!","duplicate entry");
      }
      else
      this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    },
    callItemWriteCustomerService:function(itemid,itemArray){
    var arr=itemArray;
    arrlength=arr.length;
    for(var i=0;i<arr.length;i++){
      var obj={"itemid":"","supplierid":""};
      obj.itemid=itemid;
      obj.supplierid=arr[i].supplierid;
      this.writecustomerparam=obj;
      // Making request to the service to add item against the customer
      this.writecustomerurl=sessionStorage.getItem("curr_sess_url")+"additemcustomer-service";
      this.$.additemwritecustomerajax.generateRequest();
    }
    },
    additemwritecustomerResponse:function(e){
    if(e.detail.response.returnval=="succ"){
    flag=flag+1;
    if(arrlength==flag){
    alert("Item Added with customer successfully!!");
    // After successful adding of customer showing the previously added customer to that item
    document.querySelector('customer-page').setPage('Show Item');
    // Fetching already added customer info against the item
    document.querySelector('customeritem-card').FnFetchItemInfo(supobj.supplierid,"");
    // Clearing fields after adding the item
    document.querySelector('customeradditem-card').FnSetClearFields();
    document.querySelector('itemsearch-card').FnSetClearFields();
    flag=0;        
    }
    }
    else if(e.detail.response.returnval=="duplicate entry"){
      alert("Item already exists against this customer!!");
    }
  },
  callCustomerSupplierService:function(itemid,itemtype){
    var obj={"itemid":"","itemtype":""};
    obj.itemid=itemid;
    obj.itemtype=itemtype;
    this.customersupplierparam=obj;
    this.customersupplierurl=sessionStorage.getItem("curr_sess_url")+"customersupplier-service";
    this.$.customersupplierajax.generateRequest();
  },
  customersupplierResponse:function(e){    
    if(e.detail.response.returntype=="FG"){
      document.querySelector('customersupplier-card').itemCusArray=e.detail.response.itemarr;
    }
    else{
      document.querySelector('customersupplier-card').itemSupArray=e.detail.response.itemarr;
    }

  },
  // Method to delete the supplier who already attached with the item
  calldeleteitemsupplierService:function(itemid,supplierid){
    var obj={"supplierid":"","itemid":""};
    obj.itemid=itemid;
    obj.supplierid=supplierid;
    this.deleteitemsupplierparam=obj;
    this.deleteitemsupplierurl=sessionStorage.getItem("curr_sess_url")+"deleteitemsupplier-service";
    this.$.deleteitemsupplierajax.generateRequest();
  },
  deleteitemsupplierResponse:function(e){
    alert(e.detail.response.itemarr);
  },
  // Method to update the price against the each supplier for that item
  callupdateitempricesupplierService:function(itemid,supplierid,supplierprice){
    var obj={"supplierid":"","itemid":"","supplierprice":""};
    obj.itemid=itemid;
    obj.supplierid=supplierid;
    obj.supplierprice=supplierprice;
    this.updateitempricesupplierparam=obj;
    this.updateitempricesupplierurl=sessionStorage.getItem("curr_sess_url")+"updateitempricesupplier-service";
    this.$.updateitempricesupplierajax.generateRequest();
  },
  updateitempricesupplierResponse:function(e){
    alert(JSON.stringify(e.detail.response.itemarr));
  },
  // Method to delete the customer who already attached against the item
   calldeleteitemcustomerService:function(itemid,customerid){
    var obj={"customerid":"","itemid":""};
    obj.itemid=itemid;
    obj.customerid=customerid;
    this.deleteitemcustomerparam=obj;
    this.deleteitemcustomerurl=sessionStorage.getItem("curr_sess_url")+"deleteitemcustomer-service";
    this.$.deleteitemcustomerajax.generateRequest();
  },
  deleteitemcustomerResponse:function(e){
    alert(e.detail.response.itemarr);
  }
  });
})();
