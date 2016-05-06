/**
 * Created by praba on 2/13/2016.
 */
//JS file for search card
Polymer({
  is: "searchread-page",
  ready:function()
  {
  	//this.$.dialog.toggle();
  },
  FnStopSpinner:function(){
    this.$.dialog.toggle();
    var spin=document.querySelector('paper-spinner');
    spin.active=!spin.active;
  }
});
