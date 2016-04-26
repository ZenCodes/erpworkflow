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
    FnShowDialog:function(stores,storesarr,itemarr,itemgrouparr,itemsupplierarr,itemoptionalsupplierarr,purchasearr,itemflag, itemid, itemname, itemdes, container, quantity, itemgroup, itemtype, purchasetype){
      //alert(stores);
      //alert(JSON.stringify(storesarr));
      //this.itemoptionalsupplier=itemoptionalsupplier,
      //this.itemsupplier=itemsupplier;
      this.itemflag=itemflag;
      this.itemid=itemid;
      this.itemname=itemname;
      this.itemdes=itemdes;
      this.container=container;
      this.quantity=quantity;
      this.itemgroup=itemgroup;
      this.itemtype=itemtype;
      this.storeslocation=stores;
      this.purchasetype=purchasetype;

      for(var i=0;i<itemarr.length;i++){
        if(itemarr[i].itemtypeid==itemtype)
          itemtype=itemarr[i].itemtypename;
      }
      for(var i=0;i<itemgrouparr.length;i++){
        if(itemgrouparr[i].itemgroupid==itemgroup)
          itemgroup=itemgrouparr[i].itemgroupname;
      }
      for(var i=0;i<storesarr.length;i++){
        if(storesarr[i].Store_Location_ID==stores)
          stores=storesarr[i].Store_Location_Name;
      }
      /*for(var i=0;i<itemsupplierarr.length;i++){
        if(itemsupplierarr[i].itemsupplierid==itemsupplier)
          itemsupplier=itemsupplierarr[i].itemsuppliername;
      }
      for(var i=0;i<itemoptionalsupplierarr.length;i++){
        if(itemoptionalsupplierarr[i].itemsupplierid==itemoptionalsupplier)
          itemoptionalsupplier=itemoptionalsupplierarr[i].itemsuppliername;
      }*/
      for(var i=0;i<purchasearr.length;i++){
        if(purchasearr[i].purchasetypeid==purchasetype)
          purchasetype=purchasearr[i].purchasetypename;
      }
      if(localStorage.getItem("curr_sess_searchitemflag")!="0") {
        if (localStorage.getItem("curr_sess_itemtypechangeflag") == "1") {
          this.color6 = "color:red";
        }
        if (localStorage.getItem("curr_sess_grouptypechangeflag") == "1") {
          this.color7 = "color:red";
        }

        if (localStorage.getItem("curr_sess_itempurchasetypeflag") == "1") {
          this.color10 = "color:red";
        }
        if (localStorage.getItem("curr_sess_itemidflag") == "1") {
          this.color1 = "color:red";

        }
        if (localStorage.getItem("curr_sess_itemnameflag") == "1") {
          this.color2 = "color:red";
        }
        if (localStorage.getItem("curr_sess_itemdesflag") == "1") {
          this.color3 = "color:red";
        }
        if (localStorage.getItem("curr_sess_itemcontainerflag") == "1") {
          this.color4 = "color:red";
        }
        if (localStorage.getItem("curr_sess_itemquantityflag") == "1") {
          this.color5 = "color:red";
        }
        if (localStorage.getItem("curr_sess_storeschangeflag") == "1") {
          this.color8 = "color:red";
        }
      }


      this.itemflagg=itemflag;
      this.itemidd=itemid;
      this.itemnamee=itemname;
      this.itemdess=itemdes;
      this.containerr=container;
      this.quantityy=quantity;
      this.itemgroupp=itemgroup;
      this.itemtypee=itemtype;
      this.storeslocationn=stores;
      this.purchasetypee=purchasetype;

      this.val1="Item ID";
      this.val2="Item Name";
      this.val3="Item Description";
      this.val4="Container";
      this.val5="Quantity";
      this.val6="Item Type";
      this.val7="Item Group";
      this.val8="Stores Location";
      this.val10="Purchase Type";
      this.$.Fn_Open_dialog.open();
    },
    FnSummaryOk:function(){
      //localStorage.setItem("curr_sess_itemsummaryflag","1");
      if(localStorage.getItem("curr_sess_searchitemflag")=="0")
      document.querySelector('admin-service').callItemWriteService("","","",this.itemflag, this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, this.storeslocation, this.purchasetype);
      else
      document.querySelector('admin-service').callItemUpdateService("","",this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, this.storeslocation, this.purchasetype);
      localStorage.setItem("curr_sess_ItemTypeId","");
      localStorage.setItem("curr_sess_ItemTypeGroup","");
      localStorage.setItem("curr_sess_ItemTypeSupplier","");
      localStorage.setItem("curr_sess_ItemTypeOptionalSupplier","");
      localStorage.setItem("curr_sess_storeschangeflag","");
    },
    FnSummaryCancel:function(){
      document.querySelector('additem-card').setSelectedItem(this.itemtype,this.itemgroup,this.purchasetype);
      localStorage.setItem("curr_sess_storeschangeflag","0");
      localStorage.setItem("curr_sess_itemtypechangeflag","0");
      localStorage.setItem("curr_sess_grouptypechangeflag","0");
      //localStorage.setItem("curr_sess_supplierchangeflag","0");
      //localStorage.setItem("curr_sess_optionalsupplierchangeflag","0");
      localStorage.setItem("curr_sess_itemidflag","0");
      localStorage.setItem("curr_sess_itemnameflag","0");
      localStorage.setItem("curr_sess_itemdesflag","0");
      localStorage.setItem("curr_sess_itemcontainerflag","0");
      localStorage.setItem("curr_sess_itemquantityflag","0");
      localStorage.setItem("curr_sess_itempurchasetypeflag","0");
    }
  });
})();
