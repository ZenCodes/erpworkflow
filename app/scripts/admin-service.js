/**
 * Created by praba on 2/26/2016.
 */
(function() {
  Polymer({
    is: "admin-service",
    ready: function () {
      //Setting url to fetch item type and group type info
      this.readurl=sessionStorage.getItem("curr_sess_url")+"additemread-service";
      this.groupurl=sessionStorage.getItem("curr_sess_url")+"additemgroupread-service";
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
    },
    //Method invokes while making write req from the additem card
    callItemWriteService:function(itemoptionalsupplier,itemsupplier,itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,purchasetype){

    var obj={
      "itemoptionalsupplier" :"","itemsupplier" :"","itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""
    };
      obj.itemoptionalsupplier=itemoptionalsupplier,
      obj.itemsupplier=itemsupplier;
      obj.itemflag=itemflag;
      obj.itemid=itemid;
      obj.itemname=itemname;
      obj.itemdes=itemdes;
      obj.container=container;
      obj.quantity=quantity;
      obj.itemgroup=itemgroup;
      obj.itemtype=itemtype;
      obj.purchasetype=purchasetype;
      this.param=obj;
      this.url=sessionStorage.getItem("curr_sess_url")+"additem-service";
      this.$.additemwriteajax.generateRequest();
    },
    //Response receiving after making write request
    additemwriteResponse:function(e){
      if(e.detail.response.returnval=="succ"){
        //document.querySelector("additem-card").FnBtnDisable();
        //document.querySelector("additem-card").FnClear();
        this.$.dialogpage.FnShowDialog("Item saved successfully!!","");

      }
     else if(e.detail.response.returnval=="duplicate entry"){
        this.$.dialogpage.FnShowDialog("Item ID already exists!!","duplicate entry");
      }
      else
        this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    },
    //Method invokes while making req to fetch purhase type info
    callItemPurchasetypeReadService:function(){
      this.purchasetypeurl=sessionStorage.getItem("curr_sess_url")+"additempurchasetype-service";
      this.$.purchasetypereadajax.generateRequest();
    },
    purchasetypereadResponse:function(e) {
      var itemarray=e.detail.response.itemarr;
      document.querySelector('additem-card').purchasearr=itemarray;
    },
    //Method invokes while making req to fetch item type info
    callItemReadService:function(){
      this.readurl=sessionStorage.getItem("curr_sess_url")+"additemread-service";
      this.$.additemreadajax.generateRequest();
    },
    additemreadResponse:function(e) {
      var itemarray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemarr=itemarray;
    },
    //Method invokes while making req to fetch group type info
    callItemgroupReadService:function(){
      this.groupurl=sessionStorage.getItem("curr_sess_url")+"additemgroupread-service";
      this.$.additemgroupreadajax.generateRequest();
    },
    additemgroupreadResponse:function(e) {
      var itemgrouparray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemgrouparr=itemgrouparray;
    },
    //Method invokes while making req to fetch supplier info
    callItemSupplierReadService:function(){
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
      this.$.itemsupplierreadajax.generateRequest();
    },
    itemsupplierreadResponse:function(e) {
      var itemsupplierarray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemsupplierarr=itemsupplierarray;
      document.querySelector('additem-card').itemoptionalsupplierarr=itemsupplierarray;
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

      document.querySelector("additem-card").itemid=arr[0].itemid;
      document.querySelector("additem-card").itemname=arr[0].itemname;
      document.querySelector("additem-card").itemdes=arr[0].itemdes;
      document.querySelector("additem-card").container=arr[0].container;
      document.querySelector("additem-card").quantity=arr[0].quantity;
      document.querySelector("additem-card").setSelectedItem(arr[0].itemoptionalsupplier,arr[0].itemsupplier,arr[0].itemtype,arr[0].itemgroup,arr[0].purchasetype);

    },
    //Method invokes while making update request from item card
    callItemUpdateService:function(itemoptionalsupplier,itemsupplier,itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,purchasetype){

      var obj={
        "itemoptionalsupplier":"","itemsupplier":"","itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""
      };
      obj.itemoptionalsupplier=itemoptionalsupplier,
      obj.itemsupplier=itemsupplier;
      obj.itemflag=itemflag;
      obj.itemid=itemid;
      obj.itemname=itemname;
      obj.itemdes=itemdes;
      obj.container=container;
      obj.quantity=quantity;
      obj.itemgroup=itemgroup;
      obj.itemtype=itemtype;
      obj.purchasetype=purchasetype;

      this.updateparam=obj;
      this.updateurl=sessionStorage.getItem("curr_sess_url")+"additemupdate-service";
      this.$.additemupdateajax.generateRequest();
    },
    //Response for item update req
    additemupdateResponse:function(e){

      if(e.detail.response.returnval=="succ"){
        //document.querySelector("additem-card").FnBtnDisable();
        //document.querySelector("additem-card").FnClear();
        //document.querySelector("viewtype-card").FnEnableEdit();
        this.$.dialogpage.FnShowDialog("Item updated successfully!!","");
       // window.location.href = "indexhome.html";
      }
      else
        this.$.dialogpage.FnShowDialog("Failed to update the item!!","");
    },
    addsupplierService:function(supplierid,suppliername,landmark,location,city,district,state,country,pincode,phoneno,mobileno,emailid){

      var obj={
        "supplierid":"","suppliername":"","landmark":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":""
      };
      obj.supplierid=supplierid,
      obj.suppliername=suppliername;
      obj.landmark=landmark;
      obj.location=location;
      obj.city=city;
      obj.district=district;
      obj.state=state;
      obj.country=country;
      obj.pincode=pincode;
      obj.phoneno=phoneno;
      obj.mobileno=mobileno;
      obj.emailid=emailid;

      this.supplierparam=obj;
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addsupplier-service";
      this.$.addsupplierajax.generateRequest();
    },
    addsupplierResponse:function(e){
      if(e.detail.response.returnval=="succ"){
		  alert("Supplier Added!");
		  document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else
      	  alert("Unable to add supplier!");
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    }

  });
})();
