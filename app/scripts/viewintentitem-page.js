/**
 * Created by praba on 2/13/2016.
 */
//JS componet for search expand card
(function() {
  var arr=[];
  var id="true";
  var clrid="true";
  var regno="";
  //var n=1;
  Polymer({is:"viewintentitem-page",
    ready:function(){

      //alert("call");
      this.icons="icons:arrow-drop-down";
      //this.$.osc.outwardsearchreadService(this.inwardregno);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){

      var n=1;
      var x=-4;
      //alert(this.intentregno);

      this.$.intentservice.FnPurchaseorderService();

      sessionStorage.setItem("sess_curr_inwardregno",this.itemno);
      sessionStorage.setItem("sess_curr_intentregno",this.intentregno);
      sessionStorage.setItem("sess_curr_itemdes",this.itemdes);
      //document.querySelector('my-app').setVisible("true");
      this.$.ps.intentexpanditemreadService(this.itemdes,this.intentregno);
      this.$.ps.callWebcomponentService();
      //this.$.sc.callWebcomponentService();
      var all=document.querySelectorAll('.intentexpandcard');
      if(id=="true")
      {
        id= document.querySelector("#"+this.itemno);
        //alert(id);
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#"+this.itemno))
        {
          id.opened=false;
        }

        id= document.querySelector("#"+this.itemno);
        id.toggle();
      }
      if(clrid=="true")
      {
        for(var i= 0;i<all.length;i++){

          if(all[i].id==document.querySelector("#card"+this.itemno).id){
            if(i!=0) {

              if(i!=0){
                all[i].style.marginTop=((i*(x))-i)+"%";
              }
              if(i>10){
                all[i].style.marginTop=((i*(x+(-.5)))-i)+"%";
              }
            }
            all[i].style.visibility='visible';
          }
          else
            all[i].style.visibility='hidden';
        }
        clrid= document.querySelector("#card"+this.itemno);

      }
      else
      {
        if(clrid!=document.querySelector("#card"+this.itemno))
        {
          //document.querySelector('my-app').setVisible("true");
          for(var i=0;i<all.length;i++){
            if(all[i].id==document.querySelector("#card"+this.itemno).id){
              all[i].style.visibility='visible';
            }
            else
              all[i].style.visibility='hidden';
          }

          clrid= document.querySelector("#card"+this.itemno);
        }
        else
        {

          for(var i=0;i<all.length;i++){
            if(i!=0)
              all[i].style.marginTop=(n)+"%";
            all[i].style.visibility='visible';
          }
          clrid="true";

        }
      }
    },
    //Function to toggle the card which already opened,while navigating to another page
    setToggle:function()
    {
      var toggleid=sessionStorage.getItem("sess_curr_inwardregno");
      id= document.querySelector("#"+toggleid);
      id.opened=false;
    }
  });
})();
