// JS component for supplier contactperson-item-card
(function() {
  Polymer({is:"suppliercontactperson-item-card",
    ready:function(){

    },
    // Function which calls while submitting the contact card of the supplier
    FnAddContact:function(){
      // Function which validates the input fields
      document.querySelector('#designation').validate();
      document.querySelector('#mobileno').validate();
      document.querySelector('#emailid').validate();
      if(this.designation==""||this.designation==null){}
      else
      // Function which calls service to store the contact info of the supplier
      this.$.adminsupplierservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
