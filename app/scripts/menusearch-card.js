/**
 * Created by praba on 2/15/2016.
 */

//JS file for menusearch card
Polymer({is:"menusearch-card",
  ready:function(){
  },
  irnsearch:function(e){
    this.invoice="";
    this.$.searchitem.setToggle();
    this.$.gs.searchService(this.irn,"","","");
    this.invoice="";
    this.irn="";
  },
  invoicesearch:function(e){
    this.irn="";
    this.$.searchitem.setToggle();
    this.$.gs.searchService("",this.invoice,"","");
    this.invoice="";
    this.irn="";
  },
  itemsearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService("","",this.item,"");
  }
});
