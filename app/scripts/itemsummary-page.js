/**
 * Created by praba on 2/17/2016.
 */
//JS file for itemsummary-page
(function() {
  Polymer({
    is: 'itemsummary-page',
    ready:function(){
    },
    //Method will invoke to toggle the dialog control
    FnShowDialog:function(itemarr,itemgrouparr,itemsupplierarr,itemoptionalsupplierarr,purchasearr,itemoptionalsupplier,itemsupplier,itemflag, itemid, itemname, itemdes, container, quantity, itemgroup, itemtype, purchasetype){
      //var summary="Item ID:  "+itemid+"\n                                   " +
      //  "Item Name:  "+itemname+"\n"+" Item Description:  "+itemdes+"\n Container:  "+
      //  container+"\n Quantity:  "+quantity+"\n Item Type:  "+itemtype+"\n Item Group:  "+itemgroup+"\n Supplier1:  "+
      //  itemsupplier+"\n Supplier2:  "+itemoptionalsupplier+"\n Purchase Type:  "+ purchasetype;
      this.itemoptionalsupplier=itemoptionalsupplier,
      this.itemsupplier=itemsupplier;
      this.itemflag=itemflag;
      this.itemid=itemid;
      this.itemname=itemname;
      this.itemdes=itemdes;
      this.container=container;
      this.quantity=quantity;
      this.itemgroup=itemgroup;
      this.itemtype=itemtype;
      this.purchasetype=purchasetype;

      for(var i=0;i<itemarr.length;i++){
        if(itemarr[i].itemtypeid==itemtype)
          itemtype=itemarr[i].itemtypename;
      }
      for(var i=0;i<itemgrouparr.length;i++){
        if(itemgrouparr[i].itemgroupid==itemgroup)
          itemgroup=itemgrouparr[i].itemgroupname;
      }
      for(var i=0;i<itemsupplierarr.length;i++){
        if(itemsupplierarr[i].itemsupplierid==itemsupplier)
          itemsupplier=itemsupplierarr[i].itemsuppliername;
      }
      for(var i=0;i<itemoptionalsupplierarr.length;i++){
        if(itemoptionalsupplierarr[i].itemsupplierid==itemoptionalsupplier)
          itemoptionalsupplier=itemoptionalsupplierarr[i].itemsuppliername;
      }
      for(var i=0;i<purchasearr.length;i++){
        if(purchasearr[i].purchasetypeid==purchasetype)
          purchasetype=purchasearr[i].purchasetypename;
      }

      this.val1="Item ID:  "+itemid;
      this.val2="Item Name:  "+itemname;
      this.val3="Item Description:  "+itemdes;
      this.val4="Container:  "+container;
      this.val5="Quantity:  "+quantity;
      this.val6="Item Type:  "+itemtype;
      this.val7="Item Group:  "+itemgroup;
      this.val8="Supplier1:  "+itemsupplier;
      this.val9="Supplier2:  "+itemoptionalsupplier;
      this.val10="Purchase Type:  "+ purchasetype;
      this.$.Fn_Open_dialog.open();
    },
    FnSummaryOk:function(){
      //localStorage.setItem("curr_sess_itemsummaryflag","1");
      if(localStorage.getItem("curr_sess_searchitemflag")=="0")
      document.querySelector('admin-service').callItemWriteService(this.itemoptionalsupplier,this.itemsupplier,this.itemflag, this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, this.purchasetype);
      else
      document.querySelector('admin-service').callItemUpdateService(this.itemoptionalsupplier,this.itemsupplier,this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, this.purchasetype);
    },
    FnSummaryCancel:function(){
      localStorage.setItem("curr_sess_itemsummaryflag","0");
    }
  });
})();
