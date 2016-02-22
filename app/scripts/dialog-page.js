/**
 * Created by praba on 2/17/2016.
 */
//JS file for dialog-page
(function() {
  Polymer({
    is: 'dialog-page',
    ready:function(){
    },
    //Method will invoke to toggle the dialog control
    FnShowDialog:function(dialogmsg,regno){
      this.regno=regno;
      this.dialogmsg=dialogmsg;
      //this.displayvalue=dialogmsg+"!  "+regno;
      this.$.Fn_Open_dialog.open();
    }

  });
})();
