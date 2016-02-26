/**
 * Created by praba on 2/26/2016.
 */
(function() {
  Polymer({
    is: "admin-service",
    ready: function () {
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

      if(e.detail.response.returnval=="succ")
      this.$.dialogpage.FnShowDialog("Item saved successfully!!","");
      else
        this.$.dialogpage.FnShowDialog("Failed to add the item!!","");
    }
  });
})();
