(function() {
  Polymer({is:"suppliercontactperson-item-card",
    ready:function(){

    },
    FnAddContact:function(){
      this.$.adminsupplierservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
