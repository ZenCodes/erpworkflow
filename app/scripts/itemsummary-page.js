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

      this.itemoptionalsupplierr=itemoptionalsupplier,
      this.itemsupplierr=itemsupplier;
      this.itemflagg=itemflag;
      this.itemidd=itemid;
      this.itemnamee=itemname;
      this.itemdess=itemdes;
      this.containerr=container;
      this.quantityy=quantity;
      this.itemgroupp=itemgroup;
      this.itemtypee=itemtype;
      this.purchasetypee=purchasetype;

      this.val1="Item ID";
      this.val2="Item Name";
      this.val3="Item Description";
      this.val4="Container";
      this.val5="Quantity";
      this.val6="Item Type";
      this.val7="Item Group";
      this.val8="Supplier1";
      this.val9="Supplier2";
      this.val10="Purchase Type";
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
      //alert(this.itemsupplier);
      document.querySelector('additem-card').setSelectedItem(this.itemoptionalsupplier,this.itemsupplier,this.itemtype,this.itemgroup,this.purchasetype);
      localStorage.setItem("curr_sess_itemtypechangeflag","0");
      localStorage.setItem("curr_sess_grouptypechangeflag","0");
      localStorage.setItem("curr_sess_supplierchangeflag","0");
      localStorage.setItem("curr_sess_optionalsupplierchangeflag","0");
      //localStorage.setItem("curr_sess_itemsummaryflag","0");
    }
  });
})();