  (function() {
    'use strict';
     var flag=0;
 	 
  	 var item=[];
     var temp=[];

    Polymer({
      is: 'customer-list',
      
      ready:function(){
      //Initially making all fields are editable
      this.read = false;
      this.suppliername="";
      this.supplierid="";
      this.itemval="";
      this.itemflag="false";

      //calling service to fetch and bind supplier names to the auto complete list
      this.customerurl=sessionStorage.getItem("curr_sess_url")+"itemcustomerread-service";
      this.$.itemcustomerreadajax.generateRequest();
      //Initially hiding dropdown boxes while not search for supplier names
      this.querySelector('#pl1').style.visibility='hidden';
      },
    FnSpecificSupplierReadService:function(itemid){
      //alert(itemname);      
      var obj={"itemid":""};
      obj.itemid=itemid;
      this.supplierparam=obj;
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemcustomerread-service";
    },
      //Funtion invokes when selecting item in dropdown
    FnItemSelected:function(e){
      /*if(e.target.selectedItem.textContent.trim()=="Others"){
        localStorage.setItem("curr_sess_othersupplierflag","true");
        document.querySelector('item-page').FnEnableHide();
        this.read=true;
        document.querySelector('item-card').FnChangeField();

      }*/
      //Condition to bind when no item found
      if(e.target.selectedItem.textContent.trim()!="-----Select-----"||e.target.selectedItem.textContent.trim()!="Others") {

        this.value = e.target.selectedItem.textContent.trim();
        for (var i = 0; i < item.length; i++) {
          if (item[i].itemsuppliername == this.value) {
            this.supplierid = item[i].itemsupplierid;
            this.suppliername = item[i].itemsuppliername;
          }
        }
        //Binding values to the respective cards where the supplier name field have been used
        if(sessionStorage.getItem("curr_sess_roleflag")=="0"){
          document.querySelector('outwarditem-page').FnInputChanged(this.supplierid,this.suppliername);
          document.querySelector('autocompleteitemlist-card').FnFetchSpecificItem(this.supplierid,this.suppliername);
          this.read=true;
        }
        //else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")=="")
		//  document.querySelector('additem-card').FnSelectSupplier(this.supplierid,this.suppliername);
		else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""){
      if(e.target.selectedItem.textContent.trim()!="-----Select-----")
		  document.querySelector('supplier-detail').FnSelectCustomer(this.supplierid,this.suppliername);
      else
      alert("Please choose valid Customer...");
		}
       // else
       // document.querySelector('additem-card').FnSelectSupplier(this.supplierid,this.suppliername);
       }
      else{
        alert("Please choose valid item...");
        this.value="";
      }
      //After selecting items it would hide the dropdown box
      this.querySelector('#pl1').style.visibility='hidden';
      this.querySelector('#pl1').selected=-1;
      this.itemArray="";

    },
      //Function invokes when item value changes in input box to show the relevent items
      FnInputChanged:function(e){

        if (e.keyCode == 13 || e.keyCode == 40)
          this.querySelector('#pl1').focus();
        var arr = [];
        arr.push({"itemdes": "-----Select-----"});
        this.querySelector('#pl1').style.visibility = 'visible';
        if (e.keyCode == 8) {
          this.itemflag = "true";
          this.itemval = "";
          //alert('yes');
          var len = (this.value).length;
          if (len <= 1) {
            this.querySelector('#pl1').style.visibility = 'hidden';
            this.itemArray = "";
            this.itemval = "";
          }
          if (len > 1) {
            this.querySelector('#pl1').style.visibility = 'visible';
            var backsubval = (((this.value).substring(0, (len - 1))).trim()).toUpperCase();

            for (var i = 0; i < item.length; i++) {
              var subval = ((item[i].itemsuppliername).trim()).substring(0, backsubval.length);
              //alert(subval);
              if ((subval).toUpperCase() == (backsubval).toUpperCase()) {

                var obj = {"itemdes": ""};
                obj.itemdes = item[i].itemsuppliername;
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
              var subval = ((item[i].itemsuppliername).trim()).substring(0, this.itemval.length);

              if ((subval).toUpperCase() == (this.itemval).toUpperCase()) {
                var obj = {"itemdes": ""};
                obj.itemdes = item[i].itemsuppliername;
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
    itemcustomerreadResponse:function(e) {
       item=e.detail.response.itemarr;
       //alert(JSON.stringify(item));       
    }
    });
  })();