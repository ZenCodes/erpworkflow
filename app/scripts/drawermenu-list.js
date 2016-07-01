
//JS file for drawer menu list
Polymer({is:"drawermenu-list",
  ready:function(){
    //Calling service to fetch drawer menu items
    this.$.ID_webcomponent_service.drawermenureadService();
  }
});
