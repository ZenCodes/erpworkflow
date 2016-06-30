/**
 * Created by praba on 3/10/2016.
 */
 // JS file for the addsupplier-card
(function() {
  'use strict';

  Polymer({
    is: 'addsupplier-card',
    // Ready function to set the initial parameters
    ready:function(){
      this.country="India";
      this.Btn_disable_flag=false;
      this.read=false;
      //Initially hiding paperlistbox of itemtype and itemgroup fields
      this.isHidden=true;
      this.isHiddenid=true;
      this.IDread=true;
      localStorage.setItem("curr_sess_searchtypeflag", "nothing");
      localStorage.setItem("curr_sess_addsuppliereditflag","0");
    },
    // Function which invokes while changing the email
    FnEmailChange:function(){
      document.querySelector('#emailid').validate();
    },
    // Function which invokes while enterning supplier name and doing substring operation to get the supplier id
    FnInputChange:function(){
      localStorage.setItem("curr_sess_searchtypeflag","nothing");
      this.IDread=true;
      this.supplierid=(this.suppliername).substring(0,4);
    },
    // Function which invokes while submitting the supplier inforamtion form
    FnSupplierInfoSubmit:function(){
      // Method which validate the fields if it is left blank
      document.querySelector('#address1').validate();      
      document.querySelector('#suppliername').validate();
      document.querySelector('#doorno').validate();
      document.querySelector('#streetno').validate();
      document.querySelector('#streetname').validate();
      document.querySelector('#location').validate();
      document.querySelector('#city').validate();
      document.querySelector('#district').validate();
      document.querySelector('#state').validate();
      document.querySelector('#country').validate();
      document.querySelector('#pincode').validate();
      document.querySelector('#mobileno').validate();
      document.querySelector('#emailid').validate();
      // Condition which check for all the fields are entered
      if(this.address1==""||this.address1==null||this.supplierid==""||this.supplierid==null||this.suppliername==""||this.suppliername==null||this.location==""||this.location==null||this.city==null||this.city==""||this.district==""||this.district==null||this.state==null||this.state==""||this.country==null||this.country==""||this.pincode==""||this.pincode==null||this.mobileno==null||this.mobileno==""){}
      // Else condition will invoke if all the fileds are entered
      else{
        // Setting entered supplier name in session for later use
        document.querySelector("supplieradditem-card").FnSetValue(localStorage.getItem('curr_sess_supplierloggedid'),this.suppliername);
        // Condition will invoke for new supplier adding
        if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
          localStorage.setItem('curr_sess_supplierloggedid',this.supplierid);
          // Calling service to store the supplier information
          this.$.adminsupplierservice.addsupplierService(this.supplierid,this.suppliername,this.aliasname,this.address1,this.address2,this.doorno,this.streetno,this.streetname,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid,this.faxno,this.website);
          // After submitting supplier it would show the tax page to enter
          document.querySelector("supplier-page").setPage("Add Tax");          
        }
        // Condition will invoke while searching existing supplier and updating
        else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
          // Caalling service to fetch the supplier information
          this.$.adminsupplierservice.updatesupplierService(localStorage.getItem('curr_sess_supplierloggedid'),this.suppliername,this.aliasname,this.address1,this.address2,this.doorno,this.streetno,this.streetname,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid,this.faxno,this.website);
          // Calling service to fetch the tax information
          this.$.adminsupplierservice.callTaxreadService();
          // Showing tax page with values while moving from supplier page
          document.querySelector("supplier-page").setPage("Add Tax");
          // Calling method to fetch the payment information of the currently searched supplier
          document.querySelector("payment-card").FnFetchPaymentInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.suppliername);
        }
        // Condition will invoke while searching existing supplier
        else{          
          this.$.adminsupplierservice.callTaxreadService();
          // Showing tax page with values while moving from supplier page
          document.querySelector("supplier-page").setPage("Add Tax");
          // Calling method to fetch the payment information of the currently searched supplier
          document.querySelector("payment-card").FnFetchPaymentInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.suppliername);
        }
      }
    },
    // Method will invoke while searching supplier
    FnSearchSupplierName:function(){
      //The flag is used to ensure the search is performed by using item name
      localStorage.setItem("curr_sess_searchtypeflag","1");
      // While searching existing customer which shows the edit button
      document.querySelector('viewtype-card').FnEnableEdit(true);
      //When performing search using itemname making listbox visible with items
      this.isHidden=false;
      // While searching customer making all the fields as readonly
      this.read=true;
      // Making ajax call to fetch the supplier names
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
      this.$.supplierlistreadajax.generateRequest();
    },
    // Method will list/load all the supplier names in the listbox while search for the supplier
    supplierlistreadResponse:function(e){
      //Fetching items matching with searc items to populate it in listbox
      //Condition will invoke if we performed item search using name
      if(localStorage.getItem("curr_sess_searchtypeflag")=="1") {
        this.querySelector('#searchname').style.visibility = 'visible';
        var arr = [];
        arr.push({"itemname": "-----Select-----"});
        var item = e.detail.response.itemarr;
        if (this.suppliername.length > 0) {
          for (var i = 0; i < item.length; i++) {
            var subval = ((item[i].itemsuppliername).trim()).substring(0, this.suppliername.length);
            if ((subval).toLowerCase() == (this.suppliername).toLowerCase()) {
              var obj = {"itemname": ""};
              obj.itemname = item[i].itemsuppliername;
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
        if (this.supplierid.length > 0) {
          for (var i = 0; i < item.length; i++) {
            var subval = ((item[i].itemsupplierid).trim()).substring(0, this.supplierid.length);

            if ((subval).toLowerCase() == (this.supplierid).toLowerCase()) {
              var obj = {"itemid": ""};
              obj.itemid = item[i].itemsupplierid;
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

          }
        }
      }
    },
    // Method will invoke while selecting name in the listbox
    FnSupplierNameSelected:function(e){
      //if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
      if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
        this.suppliername = e.target.selectedItem.textContent.trim();
        //Making invisible and deselection in dropdown of item name search list box
        this.querySelector('#searchname').style.visibility='hidden';
        this.querySelector('#searchname').selected=-1;
        this.itemArray="";
        //if selected item id is not null invoking service to fetch item info
        if(this.suppliername!=""||this.suppliername!="-----Select-----") {

          this.$.adminsupplierservice.callSearchService("", this.suppliername);

        }
      }
      else{
        this.read=false;
        this.suppliername="";
        this.supplierid="";
        this.itemArray="";
        this.querySelector('#searchname').style.visibility='hidden';
        this.querySelector('#searchname').selected=-1;
      }
    },
    // Function to change fields as editable while cicking edit button
    FnEnableFields:function(){
      this.read=false;
    }
  });
})();
