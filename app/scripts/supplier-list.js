//JS file for the supplierlist page
//The same card is reused in inwardslip page and the additem card
(function() {
  var flag=0;
  this.val="";
  var item=[];
  var temp=[];
  var flag1=0;
  this.val1="";
  var item1=[];
  var temp1=[];
  Polymer({is:"supplier-list",
    ready:function(){
      //The card consist of two fields to enter supplier info,if it is in inward page it has to show only one supplier name,so to hide and make visible in additem card here used isHidden attribute
      if(sessionStorage.getItem("curr_sess_roleflag")=="0"||(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""))
      this.isHidden=true;
      else
      this.isHidden=false;
      //Initially making all fields are editable
      this.read = false;
      this.suppliername="";
      this.supplierid="";
      this.itemval="";
      this.itemflag="false";
      this.suppliername1="";
      this.supplierid1="";
      this.itemval1="";
      this.itemflag1="false";
      //calling service to fetch and bind supplier names to the auto complete list
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";      
      //Initially hiding dropdown boxes while not search for supplier names
      this.querySelector('#pl1').style.visibility='hidden';
      this.querySelector('#pl2').style.visibility='hidden';
    },
    //Method to toggle supplier names readonly or non editable
    FnEnableFields:function(enableflag){
    this.read=enableflag;
    },
    FnSpecificSupplierReadService:function(itemid){      
      var obj={"itemid":""};
      obj.itemid=itemid;
      this.supplierparam=obj;
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
    },
    //Funtion invokes when selecting item in dropdown
    FnItemSelected:function(e){
      if(e.target.selectedItem.textContent.trim()=="Others"){
        localStorage.setItem("curr_sess_othersupplierflag","true");
        document.querySelector('item-page').FnEnableHide();
        this.read=true;
        document.querySelector('item-card').FnChangeField();
      }
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
          document.querySelector('item-page').FnInputChanged(this.supplierid,this.suppliername);
          document.querySelector('autocompleteitemlist-card').FnFetchSpecificItem(this.supplierid,this.suppliername);
          this.read=true;
        }
  		else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""){
      if(e.target.selectedItem.textContent.trim()!="-----Select-----")
		  document.querySelector('supplier-detail').FnSelectSupplier(this.supplierid,this.suppliername);
      else
      alert("Please choose valid Supplier...");
	    }
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
    //Function invokes when selecting item in second field
    FnOptionalItemSelected:function(e){
      //Condition to bind when no item found
      if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
        this.optionalvalue = e.target.selectedItem.textContent.trim();
        for (var i = 0; i < item1.length; i++) {
          if (item1[i].itemsuppliername == this.optionalvalue) {
            this.supplierid1 = item1[i].itemsupplierid;
            this.suppliername1 = item1[i].itemsuppliername;
          }
        }
        document.querySelector('additem-card').FnSelectOptionalSupplier(this.supplierid1,this.suppliername1);
      }
      else{
        alert("Please choose valid item...");
        this.optionalvalue="";
      }
      this.querySelector('#pl2').style.visibility='hidden';
      this.querySelector('#pl2').selected=-1;
      this.itemOptionalArray="";
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
    FnOptionalInputChanged:function(e){
      if(e.keyCode==13|| e.keyCode==40)
        this.querySelector('#pl2').focus();
      var arr=[];
      arr.push({"itemdes":"-----Select-----"});
      this.querySelector('#pl2').style.visibility='visible';
      if(e.keyCode==8){
        this.itemflag1="true";
        this.itemval1="";
         var len=(this.optionalvalue).length;
        if(len<=1){
          this.querySelector('#pl2').style.visibility='hidden';
          this.itemOptionalArray="";
          this.itemval1="";
        }
        if(len>1){
          this.querySelector('#pl2').style.visibility='visible';
          var backsubval=(((this.optionalvalue).substring(0,(len-1))).trim()).toUpperCase();

          for(var i=0;i<item1.length;i++)
          {
            var subval=((item1[i].itemsuppliername).trim()).substring(0,backsubval.length);

            if((subval).toUpperCase()==(backsubval).toUpperCase())
            {

              var obj={"itemdes":""};
              obj.itemdes=item[i].itemsuppliername;
              arr.push(obj);
            }
          }
          this.itemOptionalArray=arr;

        }
      }
      if(e.keyCode!=8&& e.keyCode!=16&& e.keyCode!=13 && e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=37&&e.keyCode!=39){
        if(this.itemflag1=="true") {
          this.itemval1 = (this.optionalvalue).toUpperCase()+String.fromCharCode((e.keyCode)).toUpperCase();
          this.itemflag1="false";
        }
        else
          this.itemval1 = this.itemval1 +String.fromCharCode((e.keyCode));
         if(this.itemval1.length>0)
        {
          for(var i=0;i<item1.length;i++){
            var subval=((item1[i].itemsuppliername).trim()).substring(0,this.itemval1.length);

            if((subval).toUpperCase()==(this.itemval1).toUpperCase())
            {
              var obj={"itemdes":""};
              obj.itemdes=item[i].itemsuppliername;
              arr.push(obj);
            }
          }
          if(arr.length>0)
            this.itemOptionalArray=arr;
          else
          {
            var obj={"itemdes":""};
            obj.itemdes="No items found";
            arr.push(obj);
            this.itemOptionalArray=arr;
          }

        }
      }
    },
    //Fetches and binding to the auto complete dropdown list dynamically
    itemsupplierreadResponse:function(e) {
       item=e.detail.response.itemarr;
       item1=e.detail.response.itemarr;
    },
    setDefaultValue:function(supplier1,supplier2){
      this.value=supplier1;
      this.optionalvalue=supplier2;
    },
    FnValidate:function(){
      this.$.supplier.validate();
    }
  });
})();
