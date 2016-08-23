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
  Polymer({is:"internalintentitem-page",
    ready:function(){
      //alert("call");
      this.icons="icons:arrow-drop-down";
      //this.$.osc.outwardsearchreadService(this.inwardregno);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){

      var n=1;
      var x=-4;

      sessionStorage.setItem("sess_curr_itemno",this.itemno);
      sessionStorage.setItem("sess_curr_intentregno",this.intentregno);
      sessionStorage.setItem("sess_curr_itemdes",this.itemdes);

      this.$.ps.internalintentexpandreadService(this.itemno,this.intentregno);
      var all=document.querySelectorAll('.internalintentexpandcard');


      if(id=="true")
      {
        document.querySelector('app-homepage').FnSetSupplyVisibility('true');
        id= document.querySelector("#"+this.itemno);        
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#"+this.itemno))
        {
          id.opened=false;
        }
        document.querySelector('app-homepage').FnSetSupplyVisibility('false');
        id= document.querySelector("#"+this.itemno);
        id.toggle();
      }
      if(clrid=="true")
      {
        for(var i= 0;i<all.length;i++){
          document.querySelector('app-homepage').FnSetSupplyVisibility('true');
          if(all[i].id==document.querySelector("#card"+this.itemno).id){
            if(i!=0) {
              all[i].style.marginTop=((i*(x))-i-(i))+"%";
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
          document.querySelector('app-homepage').FnSetSupplyVisibility('true');
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
          document.querySelector('app-homepage').FnSetSupplyVisibility('false');
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
