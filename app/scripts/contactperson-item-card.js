(function() {
  Polymer({is:"contactperson-item-card",
    ready:function(){

    },
    FnAddContact:function(){
    this.$.customerservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
