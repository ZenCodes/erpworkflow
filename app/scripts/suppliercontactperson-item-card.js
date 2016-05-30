(function() {
  Polymer({is:"suppliercontactperson-item-card",
    ready:function(){

    },
    FnAddContact:function(){
      document.querySelector('#designation').validate();
      document.querySelector('#mobileno').validate();
      document.querySelector('#emailid').validate();
      if(this.designation==""||this.designation==null){}
      else
      this.$.adminsupplierservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
