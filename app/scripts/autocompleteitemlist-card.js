/**
 * Created by praba on 2/12/2016.
 */
//JS file for the autocompleteitemlist page
(function() {
  var flag=0;
  this.val="";
  var item=[];
  var temp=[];
  var suplrid="";
  Polymer({is:"autocompleteitemlist-card",
    ready:function(){
      this.supplierid="";
      this.itemval="";
      this.unit="";
      this.measure="";
      this.itemflag="false";
      this.itemid="";
      this.ponumber="";
      this.purchasetype="";
      this.purchasetypeflag="";
      //Initially hiding dropdown list
      var obj={"wardflag":"","itemid":""};
      //alert(localStorage.getItem("curr_sess_wardflag")+"  "+sessionStorage.getItem("curr_sess_roleflag"));
     
      /*if(localStorage.getItem("curr_sess_wardflag") == "2"&&localStorage.getItem("curr_sess_spotorderflag")!='true') {
       //alert("one");
        obj.wardflag="3";
        obj.itemid = sessionStorage.getItem("loggeduser");
      }*/
      if(sessionStorage.getItem("curr_sess_roleflag")=="5") {
       //alert("two");
        obj.wardflag="2";
        obj.itemid = "all";
      }
      if(suplrid==""||suplrid==null){}
      else {
        if (localStorage.getItem("curr_sess_wardflag") == "0" && sessionStorage.getItem("curr_sess_roleflag") != "5") {
          obj.wardflag = "0";
          obj.itemid = suplrid;
        }
      }
      //if(localStorage.getItem("curr_sess_wardflag")=="1"&&sessionStorage.getItem("curr_sess_roleflag")!="5")
        //obj.wardflag="1";
        this.param=obj;
      //alert(JSON.stringify(obj));
      this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
      this.querySelector('paper-listbox').style.visibility='hidden';
    },
    FnFetchSpecificTypeItem:function(itemtype){
      var obj={"wardflag":"","itemid":""};
      if(localStorage.getItem("curr_sess_wardflag") == "2"&&localStorage.getItem("curr_sess_spotorderflag")!='true') {
       //alert("one");
        obj.wardflag="3";
        obj.itemid = itemtype;
        this.param=obj;
        this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
        this.$.itemlistreadajax.generateRequest();
      }
    },
    //Method to fetch item under the specific suppllier name
    FnFetchSpecificItem:function(supplierid,suppliername){
      //alert(supplierid);
      //supplierid set to a global variable to load the items under supplier name when adding items
      suplrid=supplierid;
      var obj={"wardflag":"","itemid":""};
      if(localStorage.getItem("curr_sess_wardflag")!="1"&&sessionStorage.getItem("curr_sess_roleflag")!="5") {
        // alert("inward specific");
        obj.wardflag = "0";
        obj.itemid = supplierid;
        this.param=obj;
        this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
        this.$.itemlistreadajax.generateRequest();
      }
      if(localStorage.getItem("curr_sess_wardflag")=="1") {
        // alert("outward specific");
        obj.wardflag = "1";
        obj.itemid = supplierid;
        this.param=obj;
        this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
        this.$.itemlistreadajax.generateRequest();
      }
    },
    FnFetchSpotItems:function(flag){
      if(flag==true){
        
       var obj={"wardflag":""};     
        obj.wardflag = "4";
        this.param=obj;
        this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
        this.$.itemlistreadajax.generateRequest();
      
      }
      /*else{
        obj.wardflag="3";
        obj.itemid = sessionStorage.getItem("loggeduser"); 
        this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
        this.$.itemlistreadajax.generateRequest();
      }*/

    },
    //Funtion invokes when selecting item 0in dropdown
    FnItemSelected:function(e){
      
      //Condition to bind when no item found
      if(e.target.selectedItem.textContent.trim()!="No items found") {
        this.value = e.target.selectedItem.textContent.trim();
        for (var i = 0; i < item.length; i++) {
          if (item[i].itemname == this.value) {
            this.unit = item[i].uom;
            this.measure = item[i].container;
            this.itemid = item[i].itemid;
            this.ponumber=item[i].itemgroup;
            //this.purchasetype = item[i].itempurchasetype;
            this.purchasetypeflag = item[i].purchasetypeflag;
            //alert(this.purchasetypeflag);
          }
        }
        //To extract the unit of the item dynamically according to the item selection in list
        if (localStorage.getItem("curr_sess_wardflag") != "1") {
        //Binding values to the item page value and unit
        document.querySelector('item-page').FnSetMenuinfo(this.value, this.unit,this.measure,this.itemid,this.ponumber,this.purchasetypeflag);
        //document.querySelector('item-card').FnSetInputunitmeasure(this.unit,this.measure);
      }
        if(localStorage.getItem("curr_sess_wardflag")=="1") {
          document.querySelector('outwarditem-page').FnSetMenuinfo(this.value, this.unit, this.measure);
          //document.querySelector('outwarditem-card').FnSetInputunitmeasure(this.unit,this.measure);
        }
        if(localStorage.getItem("curr_sess_wardflag")=="2") {
          document.querySelector('intent-page').FnSetMenuinfo(this.value, this.unit, this.measure);
          //document.querySelector('outwarditem-card').FnSetInputunitmeasure(this.unit,this.measure);
        }
        if(sessionStorage.getItem("curr_sess_roleflag")=="5"){
         document.querySelector('grn-service').searchService("","",this.value,"");
        }
      }
      else{
        alert("Please choose valid item...");
        this.value="";
      }
      this.querySelector('paper-listbox').style.visibility='hidden';
      this.querySelector('paper-listbox').selected=-1;
      this.itemArray="";
    },
    //Function invokes when item value changes in input box to show the relevent items
    FnInputChanged:function(e){
     //alert(e.keyCode);
      if(e.keyCode==13|| e.keyCode==40)
        this.querySelector('paper-listbox').focus();
      var arr=[];
      arr.push({"itemdes":"-----Select-----"});
      this.querySelector('paper-listbox').style.visibility='visible';
      if(e.keyCode==8){
        this.itemflag="true";
        this.itemval="";
        //alert('yes');
        var len=(this.value).length;
        if(len<=1){
          this.querySelector('paper-listbox').style.visibility='hidden';
          this.itemArray="";
          this.itemval="";
        }
        if(len>1){
          this.querySelector('paper-listbox').style.visibility='visible';
          var backsubval=(((this.value).substring(0,(len-1))).trim()).toUpperCase();
          for(var i=0;i<item.length;i++)
          {
            var subval=((item[i].itemname).trim()).substring(0,backsubval.length);
            if((subval).toUpperCase()==(backsubval).toUpperCase())
            {
              var obj={"itemdes":""};
              obj.itemdes=item[i].itemname;
              arr.push(obj);
            }
          }
          this.itemArray=arr;
        }
      }
      if(e.keyCode!=8&& e.keyCode!=16&& e.keyCode!=13 && e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=37&&e.keyCode!=39){
        if(this.itemflag=="true") {
          this.itemval = (this.value).toUpperCase()+String.fromCharCode((e.keyCode)).toUpperCase();
          this.itemflag="false";
        }
        else
        this.itemval = this.itemval +String.fromCharCode((e.keyCode));
        if(this.itemval.length>0)
        {
          for(var i=0;i<item.length;i++){
            var subval=((item[i].itemname).trim()).substring(0,this.itemval.length);
            if((subval).toUpperCase()==(this.itemval).toUpperCase())
            {
              var obj={"itemdes":""};
              obj.itemdes=item[i].itemname;
              arr.push(obj);
            }
          }
          if(arr.length>0)
            this.itemArray=arr;
          else
          {
            var obj={"itemdes":""};
            obj.itemdes="No items found";
            arr.push(obj);
            this.itemArray=arr;
          }
        }
      }
    },
    //Fetches and binding to the auto complete dropdown list dynamically
    itemlistreadResponse:function(e)
    {
        item= e.detail.response.itemarr;
        //alert(JSON.stringify(item));
    },
    setDefaultval:function(){
      this.value="";
    },
    FnsetValue:function(){
      this.value="";
    }
  });
})();
