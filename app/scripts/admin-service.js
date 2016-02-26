/**
 * Created by praba on 2/26/2016.
 */
(function() {
  Polymer({
    is: "admin-service",
    ready: function () {
      this.readurl=sessionStorage.getItem("curr_sess_url")+"additemread-service";
      this.groupurl=sessionStorage.getItem("curr_sess_url")+"additemgroupread-service";
    },
    callItemWriteService:function(itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,purchasetype){

    var obj={
      "itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""
    };
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
    additemwriteResponse:function(e){

      if(e.detail.response.returnval=="succ"){
        document.querySelector("additem-card").FnBtnDisable();
      this.$.dialogpage.FnShowDialog("Item saved successfully!!","");
      }
     else if(e.detail.response.returnval=="duplicate entry"){
        this.$.dialogpage.FnShowDialog("Item ID already exists!!","");
      }
      else
        this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    },
    callItemReadService:function(){
      this.readurl=sessionStorage.getItem("curr_sess_url")+"additemread-service";
      this.$.additemreadajax.generateRequest();
    },
    additemreadResponse:function(e) {
      var itemarray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemarr=itemarray;
    //alert(e.detail.response);
    },

    callItemgroupReadService:function(){
      this.groupurl=sessionStorage.getItem("curr_sess_url")+"additemgroupread-service";
      this.$.additemgroupreadajax.generateRequest();
    },
    additemgroupreadResponse:function(e) {
      var itemgrouparray=e.detail.response.itemarr;
      document.querySelector('additem-card').itemgrouparr=itemgrouparray;
      //alert(e.detail.response);
    },
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
      document.querySelector("additem-card").setSelectedItem(arr[0].itemtype,arr[0].itemgroup,arr[0].purchasetype);
      //alert(JSON.stringify(arr));
    },
    callItemUpdateService:function(itemflag,itemid,itemname,itemdes,container,quantity,itemgroup,itemtype,purchasetype){

      var obj={
        "itemflag":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","purchasetype":""
      };
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
    additemupdateResponse:function(e){

      if(e.detail.response.returnval=="succ"){
        document.querySelector("additem-card").FnBtnDisable();
        this.$.dialogpage.FnShowDialog("Item saved successfully!!","");
      }
      else
        this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    }

  });
})();
