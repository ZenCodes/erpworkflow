/**
 * Created by praba on 2/12/2016.
 */

//JS file for the additem card
Polymer({
  is: "additem-card",
  ready:function()
  {
    //Initially hiding paperlistbox of itemtype and itemgroup fields
    this.isHidden=true;
    this.isHiddenid=true;
    //Initially to make all the fields are in editable mode
    this.read=false;
    //Calling services to bind info to the itemtype and itemgroup fields
    this.$.adminservice.callItemReadService();
    this.$.adminservice.callItemgroupReadService();
    localStorage.setItem("curr_sess_searchitemflag", "0");
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","additem-card");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
  },
  //Function which invokes when performing search using Item ID
  FnSearchItemId:function(e){
    //The flag is used to ensure the search is performed by using item id
    localStorage.setItem("curr_sess_searchtypeflag","0");
    //When performing search using itemid making listbox visible with items
    this.isHiddenid=false;
    //After clicking search icon disabling save button with color change
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    //After clicking search icon Making all the fields as non editable
    this.read=true;
    //The flag is used to ensure that currently in search mode and visible Edit button
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnEnableEdit();
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
    //The flag is used to ensure the search is performed by using item name
    localStorage.setItem("curr_sess_searchtypeflag","1");
    //When performing search using itemname making listbox visible with items
    this.isHidden=false;
    //After clicking search icon disabling save button with color change
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    //After clicking search icon Making all the fields as non editable
    this.read=true;
    //The flag is used to ensure that currently in search mode and visible Edit button
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnEnableEdit();
    //Url for invoking itemlistservice to fetch all the items and check with currently searching item and display the details accordingly
    this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
    //The itemlist service component is reused here,there the wardflag has to be 2 ,so that here is it is used
    var obj={"wardflag":""};
    obj.wardflag="2";
    this.param=obj;
    this.$.itemlistreadajax.generateRequest();
  },
  itemlistreadResponse:function(e){
    //Fetching items matching with searc items to populate it in listbox
    //Condition will invoke if we performed item search using name
    if(localStorage.getItem("curr_sess_searchtypeflag")=="1") {
      this.querySelector('#searchname').style.visibility = 'visible';
      var arr = [];
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
    //if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
    if(e.target.selectedItem.textContent.trim()!="No items found") {
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
      this.itemidArray="";
      this.querySelector('#searchid').style.visibility='hidden';
      this.querySelector('#searchid').selected=-1;
    }
  },
  //Function which invokes when selecting item type name in dropdown
  FnItemSelected:function(e){
    //if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
    if(e.target.selectedItem.textContent.trim()!="No items found") {
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
    this.itemArray="";
    this.querySelector('#searchname').style.visibility='hidden';
    this.querySelector('#searchname').selected=-1;
    }
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
  //Function invokes when performing save button click
  FnAddItemInfoSubmit:function()
  {
    //Fields mandatory validation performing here
    document.querySelector('#itemid').validate();
    document.querySelector('#itemname').validate();
    document.querySelector('#itemdes').validate();
    document.querySelector('#container').validate();
    document.querySelector('#quantity').validate();
  //Fetching selected radio button value
  var purchasetype=document.querySelector('#radio').selected;
  if(this.itemid==null||this.itemid==""||this.itemname==null||this.itemname==""||this.itemdes==null||this.itemdes==""||this.container==null||this.container==""||this.itemgroup==null||this.itemgroup==""||this.itemtype==null||this.itemtype==""){}
    else {
    //Setting flags according to the purchase type selection if type is regular then flag is 0 ,if spot flag is 1
    if(document.querySelector('#radio').selected=="Regular")
    this.itemflag="0";
    else
    this.itemflag="1";
    //Condition will invoke and calling save service by ensuring the searchflag is 0,if it is 0 it would in create mode
    if(localStorage.getItem("curr_sess_searchitemflag")=="0") {
      this.$.adminservice.callItemWriteService(this.itemflag, this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);
    }
    //If save button click happens via search/Edit mode,it would call the update service
    if(localStorage.getItem("curr_sess_searchitemflag")=="1")
    {
      //Whie upadting if not changing item type name it would fetch item type id
      if(localStorage.getItem("curr_sess_itemtypechangeflag")!="1"){
        for(var i=0;i<this.itemarr.length;i++){
          if(this.itemarr[i].itemtypename==this.itemtype) {
            this.itemtypee = this.itemarr[i].itemtypeid;
          }
        }
      }
      //Whie upadting if not changing item group name it would fetch item group id
      if(localStorage.getItem("curr_sess_grouptypechangeflag")!="1"){
        for(var i=0;i<this.itemgrouparr.length;i++){
          if(this.itemgrouparr[i].itemgroupname==this.itemgroup)
            this.itemgroupp=this.itemgrouparr[i].itemgroupid;
        }
      }

      //Condition will invoke and calling update service if not changing both item type and group
      if(localStorage.getItem("curr_sess_grouptypechangeflag")=="0"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="0")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroupp, this.itemtypee, purchasetype);
      //Condition will invoke and calling update service if not changing  item type
      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="1"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="0")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtypee, purchasetype);
      //Condition will invoke and calling update service if not changing item  group
      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="0"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="1")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroupp, this.itemtype, purchasetype);
      //Condition will invoke and calling update service if  changing both item type and group
      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="1"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="1")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);

    }
    }
  },
  //Function to diable Save button,once after search or save
  FnBtnDisable:function(){
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
  },
  //Function which enable all fields in editable mode while click on edit
  FnEnableFields:function(){
    localStorage.setItem("curr_sess_itemtypechangeflag","0");
    localStorage.setItem("curr_sess_grouptypechangeflag","0");
    this.read=false;
    this.Btn_disable_flag=false;
    document.querySelector('#save').style.backgroundColor='#3d6868';
  },
  //Function to set selected item info like itemtype name,itemgroup name once after click on search icon
  setSelectedItem:function(itemtype,itemgroup,selection){
    for(var i=0;i<this.itemarr.length;i++){
      if(this.itemarr[i].itemtypeid==itemtype)
        this.itemtype=this.itemarr[i].itemtypename;
    }
    for(var i=0;i<this.itemgrouparr.length;i++){
      if(this.itemgrouparr[i].itemgroupid==itemgroup)
        this.itemgroup=this.itemgrouparr[i].itemgroupname;
    }
    this.selection=selection;
  }
});
