/**
 * Created by praba on 2/12/2016.
 */

//JS file for the home-page
Polymer({
  is: "additem-card",
  ready:function()
  {
    this.isHidden=true;
    this.isHiddenid=true;
    this.read=false;
    //this.itemtype="Select Item Type";
    //this.itemgroup="Select Item Group";
    this.$.adminservice.callItemReadService();
    this.$.adminservice.callItemgroupReadService();
    localStorage.setItem("curr_sess_searchitemflag", "0");
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","additem-card");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
  },
  FnSearchItemId:function(e){
    localStorage.setItem("curr_sess_searchtypeflag","0");
    this.isHiddenid=false;
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    this.read=true;
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnEnableEdit();
    this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
    var obj={"wardflag":""};
    obj.wardflag="2";
    this.param=obj;
    this.$.itemlistreadajax.generateRequest();
    //this.$.adminservice.callSearchService(this.itemid,"");
  },
  FnSearchItemName:function(e){
    localStorage.setItem("curr_sess_searchtypeflag","1");
    this.isHidden=false;
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    this.read=true;
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnEnableEdit();
    this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
    var obj={"wardflag":""};
    obj.wardflag="2";
    this.param=obj;
    this.$.itemlistreadajax.generateRequest();
    //this.$.adminservice.callSearchService("",this.itemname);
  },
  itemlistreadResponse:function(e){
    //alert(JSON.stringify(e.detail.response));
    //this.itemArray= e.detail.response.itemarr;\
    if(localStorage.getItem("curr_sess_searchtypeflag")=="1") {

      this.querySelector('#searchname').style.visibility = 'visible';
      var arr = [];
      var item = e.detail.response.itemarr;
      //alert(this.itemval);
      if (this.itemname.length > 0) {
        for (var i = 0; i < item.length; i++) {
          var subval = ((item[i].itemname).trim()).substring(0, this.itemname.length);

          if ((subval).toLowerCase() == (this.itemname).toLowerCase()) {
            var obj = {"itemname": ""};
            obj.itemname = item[i].itemname;
            arr.push(obj);
          }
        }
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
    if(localStorage.getItem("curr_sess_searchtypeflag")=="0") {

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
  FnItemIdSelected:function(e){
    if(e.target.selectedItem.textContent.trim()!="No items found") {
      this.itemid = e.target.selectedItem.textContent.trim();
      this.querySelector('#searchid').style.visibility='hidden';
      this.querySelector('#searchid').selected=-1;
      this.itemidArray="";

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
  FnItemSelected:function(e){
    if(e.target.selectedItem.textContent.trim()!="No items found") {
      this.itemname = e.target.selectedItem.textContent.trim();
      this.querySelector('#searchname').style.visibility='hidden';
      this.querySelector('#searchname').selected=-1;
      this.itemArray="";

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
  selecttype:function(e){
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
  selectgrouptype:function(e){
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
  FnAddItemInfoSubmit:function()
  {
    document.querySelector('#itemid').validate();
    document.querySelector('#itemname').validate();
    document.querySelector('#itemdes').validate();
    document.querySelector('#container').validate();
    document.querySelector('#quantity').validate();
  var purchasetype=document.querySelector('#radio').selected;
    //alert(purchasetype);
  if(this.itemid==null||this.itemid==""||this.itemname==null||this.itemname==""||this.itemdes==null||this.itemdes==""||this.container==null||this.container==""||this.itemgroup==null||this.itemgroup==""||this.itemtype==null||this.itemtype==""){}
    else {
    if(document.querySelector('#radio').selected=="Regular")
    this.itemflag="0";
    else
    this.itemflag="1";
    //alert(this.itemflag);
    if(localStorage.getItem("curr_sess_searchitemflag")=="0") {

      this.$.adminservice.callItemWriteService(this.itemflag, this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);
    }
    if(localStorage.getItem("curr_sess_searchitemflag")=="1")
    {
      //alert("flag..."+localStorage.getItem("curr_sess_itemtypechangeflag"));
      if(localStorage.getItem("curr_sess_itemtypechangeflag")!="1"){
        //alert("hi");
        for(var i=0;i<this.itemarr.length;i++){
          if(this.itemarr[i].itemtypename==this.itemtype) {
            //alert("hi coming");
            this.itemtypee = this.itemarr[i].itemtypeid;
            //alert(this.itemtype);
          }
        }
      }

      if(localStorage.getItem("curr_sess_grouptypechangeflag")!="1"){
        for(var i=0;i<this.itemgrouparr.length;i++){
          if(this.itemgrouparr[i].itemgroupname==this.itemgroup)
            this.itemgroupp=this.itemgrouparr[i].itemgroupid;
        }
      }
      if(localStorage.getItem("curr_sess_grouptypechangeflag")=="0"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="0")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroupp, this.itemtypee, purchasetype);

      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="1"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="0")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtypee, purchasetype);

      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="0"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="1")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroupp, this.itemtype, purchasetype);

      else if(localStorage.getItem("curr_sess_grouptypechangeflag")=="1"&&localStorage.getItem("curr_sess_itemtypechangeflag")=="1")
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);

    }
    }
  },
  FnBtnDisable:function(){
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
  },
  FnEnableFields:function(){
    localStorage.setItem("curr_sess_itemtypechangeflag","0");
    localStorage.setItem("curr_sess_grouptypechangeflag","0");
    this.read=false;
    this.Btn_disable_flag=false;
    document.querySelector('#save').style.backgroundColor='#3d6868';
  },
  setSelectedItem:function(itemtype,itemgroup,selection){
    //alert(JSON.stringify(this.itemarr));
    //alert(JSON.stringify(this.itemgrouparr));
    for(var i=0;i<this.itemarr.length;i++){
      if(this.itemarr[i].itemtypeid==itemtype)
        this.itemtype=this.itemarr[i].itemtypename;
    }
    for(var i=0;i<this.itemgrouparr.length;i++){
      if(this.itemgrouparr[i].itemgroupid==itemgroup)
        this.itemgroup=this.itemgrouparr[i].itemgroupname;
    }
   // this.itemtype=itemtype;
    //this.itemgroup=itemgroup;
    this.selection=selection;
  }


});
