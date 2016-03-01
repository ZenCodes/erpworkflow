/**
 * Created by praba on 2/12/2016.
 */
//JS file for the autocompleteitemlist page
(function() {
  var flag=0;
  this.val="";
  var item=[];
  var temp=[];

  Polymer({is:"autocompleteitemlist-card",
    ready:function(){

      this.itemval="";
      this.unit="";
      this.measure="";
      this.itemflag="false";
      this.itemid="";
      this.ponumber="";
      this.purchasetype="";
      this.purchasetypeflag="";
      //Initially hiding dropdown list
      var obj={"wardflag":""};
      if(sessionStorage.getItem("curr_sess_roleflag")=="manager") {
        obj.wardflag="2";
      }
      if(localStorage.getItem("curr_sess_wardflag")!="1"&&sessionStorage.getItem("curr_sess_roleflag")!="manager")
        obj.wardflag="0";
      if(localStorage.getItem("curr_sess_wardflag")=="1"&&sessionStorage.getItem("curr_sess_roleflag")!="manager")
        obj.wardflag="1";
      this.param=obj;
      this.url = sessionStorage.getItem("curr_sess_url")+"itemlist-service";
      this.querySelector('paper-listbox').style.visibility='hidden';
    },
    //Funtion invokes when selecting item in dropdown
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
            this.purchasetype = item[i].itempurchasetype;
            this.purchasetypeflag = item[i].purchasetypeflag;
          }
        }
        //To extract the unit of the item dynamically according to the item selection in list
        if (localStorage.getItem("curr_sess_wardflag") != "1") {
        //Binding values to the item page value and unit
        document.querySelector('item-page').FnSetMenuinfo(this.value, this.unit,this.measure,this.itemid,this.ponumber,this.purchasetype,this.purchasetypeflag);
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
        if(sessionStorage.getItem("curr_sess_roleflag")=="manager"){
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

            if(subval==backsubval)
            {

              var obj={"itemdes":""};
              obj.itemdes=item[i].itemname;
              arr.push(obj);
            }
          }
          this.itemArray=arr;
          //alert(JSON.stringify(this.itemArray));
        }
      }
      if(e.keyCode!=8&& e.keyCode!=16&& e.keyCode!=13 && e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=37&&e.keyCode!=39){
        if(this.itemflag=="true") {
          this.itemval = (this.value).toUpperCase()+String.fromCharCode((e.keyCode)).toUpperCase();
          this.itemflag="false";
        }
        else
        this.itemval = this.itemval +String.fromCharCode((e.keyCode));
        //alert(this.itemval);
        if(this.itemval.length>0)
        {
          for(var i=0;i<item.length;i++){
            var subval=((item[i].itemname).trim()).substring(0,this.itemval.length);

            if(subval==this.itemval)
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
      /*if (sessionStorage.getItem("curr_sess_roleflag") == "manager") {
        item=item.concat(e.detail.response.items);
      if(flag==0) {
          this.url="../../config/outwarditems.json";
          //this.$.itemlistreadajax.generateRequest();
          flag = flag + 1;
      }
      }
      else{*/
        item= e.detail.response.itemarr;
      //}
      //alert(JSON.stringify(item));
    },
    setDefaultval:function(){
      this.value="";
    }
  });
})();
