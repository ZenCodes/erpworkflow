/**
 * Created by praba on 2/12/2016.
 */

//JS file for the home-page
Polymer({
  is: "additem-card",
  ready:function()
  {
    this.isHidden=true;
    this.read=false;
    this.itemtype="Select Item Type";
    this.itemgroup="Select Item Group";
    this.$.adminservice.callItemReadService();
    this.$.adminservice.callItemgroupReadService();
    localStorage.setItem("curr_sess_searchitemflag", "0");
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","additem-card");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
  },
  FnSearchItemId:function(e){
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    this.read=true;
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnLabelChange();

    this.$.adminservice.callSearchService(this.itemid,"");
  },
  FnSearchItemName:function(e){
    this.isHidden=false;
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
    this.read=true;
    localStorage.setItem("curr_sess_searchitemflag","1");
    document.querySelector('viewtype-card').FnLabelChange();
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

    var arr=[];
    var item=e.detail.response.itemarr;
    //alert(this.itemval);
    if(this.itemname.length>0)
    {
      for(var i=0;i<item.length;i++){
        var subval=((item[i].itemname).trim()).substring(0,this.itemname.length);

        if(subval==this.itemname)
        {
          var obj={"itemname":""};
          obj.itemname=item[i].itemname;
          arr.push(obj);
        }
      }
      if(arr.length>0)
        this.itemArray=arr;
      else
      {
        var obj={"itemname":""};
        obj.itemname="No items found";
        arr.push(obj);
        this.itemArray=arr;
      }
    }

  },
  FnItemSelected:function(e){
    if(e.target.selectedItem.textContent.trim()!="No items found") {
      this.itemname = e.target.selectedItem.textContent.trim();
      this.querySelector('paper-listbox').style.visibility='hidden';
      this.querySelector('paper-listbox').selected=-1;
      this.itemArray="";

      if(this.itemname!="") {
        this.$.adminservice.callSearchService("", this.itemname);
      }
    }
  },
  selecttype:function(e){
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
  if(this.itemid==null||this.itemid==""||this.itemname==null||this.itemname==""||this.itemdes==null||this.itemdes==""||this.container==null||this.container==""||this.itemgroup==null||this.itemgroup==""||this.itemtype==null||this.itemtype==""){}
    else {
    if(document.querySelector('#radio').selected=="Regular")
    this.itemflag="0";
    else
    this.itemflag="1";
    if(localStorage.getItem("curr_sess_searchitemflag")=="0") {
      this.$.adminservice.callItemWriteService(this.itemflag, this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);
    }
    if(localStorage.getItem("curr_sess_searchitemflag")=="1")
    {
      this.$.adminservice.callItemUpdateService(this.itemflag,this.itemid, this.itemname, this.itemdes, this.container, this.quantity, this.itemgroup, this.itemtype, purchasetype);
    }
    }
  },
  FnBtnDisable:function(){
    document.querySelector('#save').style.backgroundColor='grey';
    this.Btn_disable_flag=true;
  },
  FnEnableFields:function(){
    this.read=false;
    this.Btn_disable_flag=false;
    document.querySelector('#save').style.backgroundColor='#3d6868';
  },
  setSelectedItem:function(itemtype,itemgroup,selection){
    this.itemtype=itemtype;
    this.itemgroup=itemgroup;
    this.selection=selection;
  }


});
