/**
 * Created by praba on 2/12/2016.
 */
//JS file for the supplierlist page
//The same card is reused in inwardslip page and the additem card
(function() {
 var flag=0;
  this.val="";
  var item=[];
  var temp=[];
  var storesid="";
  this.value="";
  Polymer({is:"stores-card",
    ready:function(){
      if(localStorage.getItem("curr_sess_wardflag") == "4"){
        this.$.store.style.width='150%';
        this.$.storeslist.style.width='150%';
      }
    this.querySelector('#storeslist').style.visibility = 'hidden';
    this.storesurl=sessionStorage.getItem("curr_sess_url")+"itemstoresread-service";
    },
    //Method to toggle supplier names readonly or non editable
    FnEnableFields:function(enableflag){
    this.read=enableflag;
    },
    FnSetDefaultValue:function(storesid){
      //alert(storesid);
      for(var i=0;i<item.length;i++){
        if(item[i].Store_Location_ID==storesid){
          this.value=item[i].Store_Location_Name;
          document.querySelector('additem-card').FnSetStoresInfo(item,storesid);
          document.querySelector('supplieradditem-card').FnSetStoresInfo(item,storesid);
          document.querySelector('supplieradditem-card').FnSetStoresInfo(item,storesid);
        }
      }
    },
    //Funtion invokes when selecting item in dropdown
    FnItemSelected:function(e){
      if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
        this.value = e.target.selectedItem.textContent.trim();
        for(var i=0;i<item.length;i++){
          if(this.value==item[i].Store_Location_Name)
            storesid=item[i].Store_Location_ID;
        }
        if(localStorage.getItem("curr_sess_wardflag") == ""){
        document.querySelector('additem-card').FnSetStoresInfo(item,storesid);
        }
        if(localStorage.getItem("curr_sess_wardflag") == "4"){
        document.querySelector('supplieradditem-card').FnSetStoresInfo(item,storesid);
        }
        if(localStorage.getItem("curr_sess_wardflag") == "6"){
        document.querySelector('customeradditem-card').FnSetStoresInfo(item,storesid);
        }
        this.querySelector('#storeslist').style.visibility = 'hidden';
        this.querySelector('#storeslist').selected=-1;
        this.itemArray="";
      }
      else
      {
        this.querySelector('#storeslist').style.visibility = 'hidden';
        this.querySelector('#storeslist').selected=-1;
        this.itemArray="";
      }
    },

    //Function invokes when item value changes in input box to show the relevent items
    FnInputChanged:function(e){
        localStorage.setItem("curr_sess_storeschangeflag","1");
        if (e.keyCode == 13 || e.keyCode == 40)
          this.querySelector('#storeslist').focus();
        var arr = [];
        arr.push({"itemdes": "-----Select-----"});
        this.querySelector('#storeslist').style.visibility = 'visible';
        if (e.keyCode == 8) {
          this.itemflag = "true";
          this.itemval = "";
          //alert('yes');
          var len = (this.value).length;
          if (len <= 1) {
            this.querySelector('#storeslist').style.visibility = 'hidden';
            this.itemArray = "";
            this.itemval = "";
          }
          if (len > 1) {
            this.querySelector('#storeslist').style.visibility = 'visible';
            var backsubval = (((this.value).substring(0, (len - 1))).trim()).toUpperCase();

            for (var i = 0; i < item.length; i++) {
              var subval = ((item[i].Store_Location_Name).trim()).substring(0, backsubval.length);
              //alert(subval);
              if ((subval).toUpperCase() == (backsubval).toUpperCase()) {

                var obj = {"itemdes": ""};
                obj.itemdes = item[i].Store_Location_Name;
                arr.push(obj);
              }
            }
            if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag") == "0")
            arr.push({"itemdes":"Others"});
            this.itemArray = arr;

          }
        }
        if (e.keyCode != 8 && e.keyCode != 16 && e.keyCode != 13 && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 37 && e.keyCode != 39) {
          if (this.itemflag == "true") {
            this.itemval = (this.value).toUpperCase() + String.fromCharCode((e.keyCode)).toUpperCase();
            this.itemflag = "false";
          }
          else
            this.itemval = this.itemval + String.fromCharCode((e.keyCode));
          //alert(this.itemval);
          if (this.itemval.length > 0) {
            for (var i = 0; i < item.length; i++) {
              var subval = ((item[i].Store_Location_Name).trim()).substring(0, this.itemval.length);

              if ((subval).toUpperCase() == (this.itemval).toUpperCase()) {
                var obj = {"itemdes": ""};
                obj.itemdes = item[i].Store_Location_Name;
                arr.push(obj);
              }
            }
            if (arr.length > 0) {
              if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag") == "0")
              arr.push({"itemdes":"Others"});
              this.itemArray = arr;
            }
            else {
              var obj = {"itemdes": ""};
              obj.itemdes = "No items found";
              arr.push(obj);
              this.itemArray = arr;
            }

          }
        }

    },
    //Fetches and binding to the auto complete dropdown list dynamically
    itemstoresreadResponse:function(e) {
       item=e.detail.response.itemarr;
       //alert(JSON.stringify(item));
    },
    FnValidate:function(){
      this.$.stores.validate();
    },
    FnClear:function(){
      this.value="";
    }
  });
})();
