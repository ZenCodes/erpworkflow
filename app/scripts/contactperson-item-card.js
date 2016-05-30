(function() {
  Polymer({is:"contactperson-item-card",
    ready:function(){

    },
    FnAddContact:function(){
      document.querySelector('#designation').validate();
      document.querySelector('#mobileno').validate();
      document.querySelector('#emailid').validate();
      if(this.designation==""||this.designation==null){}
      else
      this.$.customerservice.FnAddContactService(this.designation,this.mobileno,this.emailid);
    }
  });
})();
