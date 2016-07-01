//JS file for dialog-page
(function() {
  Polymer({
    is: 'dialog-page',
    ready:function(){
      this.retflag;
    },
    //Method will invoke to toggle the dialog control
    FnShowDialog:function(dialogmsg,regno){
      if(regno!="duplicate entry") {
        this.regno = regno;
        this.retflag="";
      }
      else
      this.retflag="duplicate entry";
      this.dialogmsg=dialogmsg;      
      this.$.Fn_Open_dialog.open();
    },
   FnClickOk:function(){
      if(this.retflag!="duplicate entry") {
        if (sessionStorage.getItem("curr_sess_roleflag") == "6") {
	      document.querySelector('admin-page').setPage('supplier-detail');
        document.querySelector('supplier-detail').ready();        
        }
        if (localStorage.getItem("curr_sess_wardflag") == "2") {
        }
      }
   },
   // Function which toggle dialog 
   FnShownewDialog:function(dialogmsg,regno){
	  this.regno = regno;
	  this.dialogmsg=dialogmsg;
	  this.$.Fn_Open_dialog.open();
   }
   });
})();
