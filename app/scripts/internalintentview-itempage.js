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
  Polymer({is:"internalintentview-itempage",
    ready:function(){
      //alert("call");
      this.icons="icons:arrow-drop-down";
      //this.$.osc.outwardsearchreadService(this.inwardregno);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){
      // alert(this.itemno);
      var n=1;
      var x=-4;

      sessionStorage.setItem("sess_curr_itemno",this.itemno);
      sessionStorage.setItem("sess_curr_intentregno",this.intentregno);
      sessionStorage.setItem("sess_curr_itemdes",this.itemdes);
      sessionStorage.setItem("sess_curr_lotno",this.lotno);
      sessionStorage.setItem("sess_curr_batchno",this.batchno);

      document.querySelector('inproduction-button-card').FnSetBatchInfo(this.batchno,this.lotno,this.containerid,this.intentregno);
      // document.querySelector('chemical-property-card').FnchemicalpropertyreadService();
      // document.querySelector('mechanical-property-card').FnmechanicalpropertyreadService();
      var all=document.querySelectorAll('.internalviewexpandcard');

      if(id=="true")
      {
        document.querySelector('app-homepage').FnSetInProductionVisibility('true');
        id= document.querySelector("#"+this.intentregno);        
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#"+this.intentregno))
        {
          id.opened=false;
        }
        document.querySelector('app-homepage').FnSetInProductionVisibility('false');
        id= document.querySelector("#"+this.intentregno);
        id.toggle();
      }
      if(clrid=="true")
      {
        for(var i= 0;i<all.length;i++){
          document.querySelector('app-homepage').FnSetInProductionVisibility('true');
          if(all[i].id==document.querySelector("#card"+this.intentregno).id){
            if(i!=0) {
              all[i].style.marginTop=((i*(x))-i-(i))+"%";
            }
            all[i].style.visibility='visible';
          }
          else
            all[i].style.visibility='hidden';
        }
        clrid= document.querySelector("#card"+this.intentregno);

      }
      else
      {
        if(clrid!=document.querySelector("#card"+this.intentregno))
        {
          //document.querySelector('my-app').setVisible("true");
          document.querySelector('app-homepage').FnSetInProductionVisibility('true');
          for(var i=0;i<all.length;i++){
            if(all[i].id==document.querySelector("#card"+this.intentregno).id){
              all[i].style.visibility='visible';
            }
            else
              all[i].style.visibility='hidden';
          }

          clrid= document.querySelector("#card"+this.intentregno);
        }
        else
        {
          document.querySelector('app-homepage').FnSetInProductionVisibility('false');
          for(var i=0;i<all.length;i++){
            if(i!=0)
              all[i].style.marginTop=(n)+"%";
            all[i].style.visibility='visible';
          }
          clrid="true";

        }
      }
    }
  });
})();
