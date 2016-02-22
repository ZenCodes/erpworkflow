/**
 * Created by praba on 2/15/2016.
 */

//JS file for menusearch card
Polymer({is:"menusearch-card",
  ready:function(){
  },
  irnsearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService(this.irn,"","","");

  },
  invoicesearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService("",this.invoice,"","");
  },
  itemsearch:function(e){
    this.$.searchitem.setToggle();
    this.$.gs.searchService("","",this.item,"");
  }
});
