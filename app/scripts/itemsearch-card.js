/**
 * Created by praba on 3/15/2016.
 */
(function() {
  'use strict';

  Polymer({
    is: 'itemsearch-card',

	ready:function(){
    this.read=false;
		this.isHidden=true;
		this.isHiddenid=true;
		localStorage.setItem("curr_sess_supplieritemsearchflag","0");
	},
	FnSetClearFields:function(){
	this.itemid="";
	this.itemname="";
    },
	FnItemIdChange:function(){
	document.querySelector('supplieradditem-card').FnSetItemId(this.itemid);
  document.querySelector('customeradditem-card').FnSetItemId(this.itemid);
	},
	FnItemNameChange:function(){
	document.querySelector('supplieradditem-card').FnSetItemName(this.itemname);
  document.querySelector('customeradditem-card').FnSetItemName(this.itemname);
	},
    //Function which invokes when performing search using Item ID
	  FnSearchItemId:function(e){
      document.querySelector(supplieradditem-card).FnSetEnableDisableFields(ture);
	    //The flag is used to ensure the search is performed by using item id
	    localStorage.setItem("curr_sess_searchtypeflag","0");
	    //When performing search using itemid making listbox visible with items
	    this.isHiddenid=false;
	    //Url for invoking itemlistservice to fetch all the items and check with currently searching item and display the details accordingly
	    this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
	    //The itemlist service component is reused here,there the wardflag has to be 2 ,so that here is it is used
	    var obj={"wardflag":""};
	    obj.wardflag="2";
	    this.param=obj;
	    this.$.itemlistreadajax.generateRequest();

	  },
	  //Function which invokes when performing search using Item Name
	  FnSearchItemName:function(e){
      this.read=true;
	    document.querySelector('supplieradditem-card').FnSetEnableDisableFields(true);
      document.querySelector('customeradditem-card').FnSetEnableDisableFields(true);
      //The flag is used to ensure the search is performed by using item name
	    localStorage.setItem("curr_sess_searchtypeflag","1");
	    //When performing search using itemname making listbox visible with items
	    this.isHidden=false;
	    //Url for invoking itemlistservice to fetch all the items and check with currently searching item and display the details accordingly
	    this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
	    //The itemlist service component is reused here,there the wardflag has to be 2 ,so that here is it is used
	    if(sessionStorage.getItem("curr_sess_roleflag")=="10"){
      var obj={"wardflag":"","itemid":""};
	    obj.wardflag="2";
      obj.itemid="sale";
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
      var obj={"wardflag":"","itemid":""};
      obj.wardflag="2";
      obj.itemid="purchase";
      }
	    this.param=obj;
	    this.$.itemlistreadajax.generateRequest();
  },
  itemlistreadResponse:function(e){
    //Fetching items matching with searc items to populate it in listbox
    //Condition will invoke if we performed item search using name
    if(localStorage.getItem("curr_sess_searchtypeflag")=="1") {
      this.querySelector('#searchname').style.visibility = 'visible';
      var arr = [];
      arr.push({"itemname": "-----Select-----"});
      var item = e.detail.response.itemarr;
      if (this.itemname.length > 0) {
        for (var i = 0; i < item.length; i++) {
          var subval = ((item[i].itemname).trim()).substring(0, this.itemname.length);
          if ((subval).toLowerCase() == (this.itemname).toLowerCase()) {
            var obj = {"itemname": ""};
            obj.itemname = item[i].itemname;
            arr.push(obj);
          }
        }
        //Binding items to the listbox when it has the matching items otherwise showing no items
        if (arr.length > 0)
          this.itemArray = arr;
        else {
          var obj = {"itemname": ""};
          obj.itemname = "No items found";
          arr.push(obj);
          this.itemArray = arr;
          this.itemid="";
          this.itemname="";
          this.container="";
          this.quantity="";
          this.itemdes="";
          this.itemtype="Select Item Type";
          this.itemgroup="Select Item Group";
          this.selection="";
        }
      }
    }
    //Condition will invoke if we performed item search using name
    if(localStorage.getItem("curr_sess_searchtypeflag")=="0") {
      //Fetching items matching with searc items to populate it in listbox
      //Condition will invoke if we performed item search using id
      this.querySelector('#searchid').style.visibility = 'visible';
      var arr = [];
      arr.push({"itemid": "-----Select-----"});
      var item = e.detail.response.itemarr;
      //alert(this.itemval);
      if (this.itemid.length > 0) {
        for (var i = 0; i < item.length; i++) {
          var subval = ((item[i].itemid).trim()).substring(0, this.itemid.length);

          if ((subval).toLowerCase() == (this.itemid).toLowerCase()) {
            var obj = {"itemid": ""};
            obj.itemid = item[i].itemid;
            arr.push(obj);
          }
        }
        //Binding items to the listbox when it has the matching items otherwise showing no items
        if (arr.length > 0)
          this.itemidArray = arr;
        else {
          var obj = {"itemid": ""};
          obj.itemid = "No items found";
          arr.push(obj);
          this.itemidArray = arr;
          this.itemid="";
          this.itemname="";
          this.container="";
          this.quantity="";
          this.itemdes="";
          this.itemtype="Select Item Type";
          this.itemgroup="Select Item Group";
          this.selection="";
        }
      }
    }
  },
  //Function which invokes when selecting item type id in dropdown
  FnItemIdSelected:function(e){
	localStorage.setItem("curr_sess_supplieritemsearchflag","1");
    //if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
    if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
      this.itemid = e.target.selectedItem.textContent.trim();
      //Making invisible and deselection in dropdown of item id search list box
      this.querySelector('#searchid').style.visibility='hidden';
      this.querySelector('#searchid').selected=-1;
      this.itemidArray="";
      //if selected item id is not null invoking service to fetch item info
      if(this.itemid!="") {
        this.$.adminservice.callSearchService(this.itemid, "");
      }
    }
    else   {
      this.read=false;
      this.itemidArray="";
      this.querySelector('#searchid').style.visibility='hidden';
      this.querySelector('#searchid').selected=-1;
    }
  },
  //Function which invokes when selecting item type name in dropdown
  FnItemSelected:function(e){
    localStorage.setItem("curr_sess_supplieritemsearchflag","1");
    //if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
    if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
      this.itemname = e.target.selectedItem.textContent.trim();
      //Making invisible and deselection in dropdown of item name search list box
      this.querySelector('#searchname').style.visibility='hidden';
      this.querySelector('#searchname').selected=-1;
      this.itemArray="";
      //if selected item id is not null invoking service to fetch item info
      if(this.itemname!="") {
        this.$.adminservice.callSearchService("", this.itemname);
      }
    }
    else   {
      this.read=false;
    this.itemArray="";
    this.querySelector('#searchname').style.visibility='hidden';
    this.querySelector('#searchname').selected=-1;
    }
  },
  FnSetItemId:function(itemid){
    //alert(itemid);
    this.itemid=itemid;
  }
  });
})();
