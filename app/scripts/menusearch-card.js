/**
 * Created by praba on 2/15/2016.
 */

//JS file for menusearch card
Polymer({is:"menusearch-card",
  ready:function(){
    this.$.ID_accard.setDefaultval();
  },
  //Method will clear the inputs when expanding menu
  FnMenuExpand:function(e){
    this.invoice="";
    this.irn="";
    this.$.ID_accard.setDefaultval();
    //document.querySelector('autocompleteitemlist-card').setDefaultval("");
  },
  //Method will invoke the service to fetch the info of currently given ORN/IRN number
  irnsearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService(this.irn,"","","");
  },
  //Method will invoke the service to fetch the info of currently given invoice number of inward/outward
  invoicesearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService("",this.invoice,"","");
  },
  //Method will invoke the service to fetch the info of currently choosen item name
  itemsearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService("","",this.item,"");
  }
});
