// JS component for contactperson-item-card
(function() {
  Polymer({is:"contactperson-item-card",
    ready:function(){
    },
    // Function which calls while submitting the contact card of the customer
    FnAddContact:function(){
      // Function which validates the input fields
      document.querySelector('#designation').validate();
      document.querySelector('#mobileno').validate();
      document.querySelector('#emailid').validate();
      if(this.designation==""||this.designation==null){}
      else
      // Function which calls service to store the contact info of the customer
      this.$.customerservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
