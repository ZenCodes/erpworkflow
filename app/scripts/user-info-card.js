/**
 * Created by praba on 3/10/2016.
 */
// JS file for the addcustomer-card
(function() {
  'use strict';
  Polymer({
    is: 'user-info-card',
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
      localStorage.setItem("curr_sess_addemployeeeditflag","0");
  },
    // Function which invokes while changing the email
  FnEmailChange:function(){
    document.querySelector('#emailid').validate();
  },
  // Function which invokes while enterning customer name and doing substring operation to get the customer id
  FnInputChange:function(){
    localStorage.setItem("curr_sess_searchtypeflag","nothing");
    this.IDread=true;    
  },
  // Function which invokes while submitting the customer inforamtion form
   FnEmployeeInfoSubmit:function(){
    // Method which validate the fields if it is left blank
      /*document.querySelector('#address1').validate();     
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
     document.querySelector('#emailid').validate();*/
     // Condition which check for all the fields are entered
     if(this.employeename==""||this.employeename==null){}
     // Else condition will invoke if all the fileds are entered
     else{     
     // Condition will invoke for new customer adding
     if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
         // localStorage.setItem('curr_sess_loggedemployee',this.employeename);
         // Calling service to store the customer information
         this.$.userservice.addemployeeService(this.employeename,this.dob,this.sex,this.age,this.streetname,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid);
         // After submitting customer it would show the tax page to enter
         document.querySelector("usercreation-home-card").setPage("Account Detail");
     }
     // Condition will invoke while searching existing customer and updating
     else if(localStorage.getItem("curr_sess_addemployeeeditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
       // Caalling service to fetch the customer information
       // this.$.customerservice.updatesupplierService(this.category,localStorage.getItem('curr_sess_customerloggedid'),this.suppliername,this.aliasname,this.address1,this.address2,this.doorno,this.streetno,this.streetname,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid,this.faxno,this.website);
        this.$.userservice.updateemployeeService(localStorage.getItem('curr_sess_employeeloggedid'),this.employeename,this.dob,this.sex,this.age,this.streetname,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid);
         // Calling service to fetch the tax information
         this.$.userservice.callAccountService();
         // Showing tax page with values while moving from customer page
         document.querySelector("customer-page").setPage("Account Detail"); 
      }   
     // Condition will invoke while searching existing customer
     else{
      // Calling service to fetch the tax information
         this.$.userservice.callAccountService();
         // Showing tax page with values while moving from customer page
         document.querySelector("customer-page").setPage("Account Detail");   
     }
    }
    },
    // Method will invoke while searching customer
  FnSearchSupplierName:function(){
    //The flag is used to ensure the search is performed by using item name
      localStorage.setItem("curr_sess_searchtypeflag","1");
      // While searching existing customer which shows the edit button
      document.querySelector('viewtype-card').FnEnableEdit(true);
      //When performing search using itemname making listbox visible with items
      this.isHidden=false;
      // While searching customer making all the fields as readonly
      this.read=true;
      // Making ajax call to fetch the customer names
      this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemcustomerread-service";
      this.$.supplierlistreadajax.generateRequest();
  },
  // Method will list/load all the customer names in the listbox while search for the customer
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
        else{
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

            this.$.customerservice.callSearchService("", this.suppliername);

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
