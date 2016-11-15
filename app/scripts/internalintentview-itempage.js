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
      if(sessionStorage.getItem("loggedrole")=="Quality manager"){
        this.hidecheck=true;
      }
      if(sessionStorage.getItem("loggedrole")=="Production manager"){
        this.hidecheck=false;
      }
    },
    //Function which invokes when we change the checkbox state
    FnSelectCard:function(e){
      // alert('yes');
      document.querySelector('app-homepage').FnSetInProductionVisibility('true');
      sessionStorage.setItem("sess_curr_itemno",this.itemno);
      sessionStorage.setItem("sess_curr_intentregno",this.intentregno);
      sessionStorage.setItem("sess_curr_itemdes",this.itemdes);
      sessionStorage.setItem("sess_curr_lotno",this.lotno);
      sessionStorage.setItem("sess_curr_batchno",this.batchno);

      if(document.querySelector('#check'+this.intentregno).checked==true)
      document.querySelector('inproduction-button-card').FnSetBatchInfo(this.batchno,this.lotno,this.containerid,this.intentregno,true);
      if(document.querySelector('#check'+this.intentregno).checked==false)
      document.querySelector('inproduction-button-card').FnSetBatchInfo(this.batchno,this.lotno,this.containerid,this.intentregno,false);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){
        // alert('call');
      if(sessionStorage.getItem("loggedrole")=="Quality manager"){
        // alert('yes');
      var n=1;
      var x=-4;

      sessionStorage.setItem("sess_curr_itemno",this.itemno);
      sessionStorage.setItem("sess_curr_intentregno",this.intentregno);
      sessionStorage.setItem("sess_curr_itemdes",this.itemdes);
      sessionStorage.setItem("sess_curr_lotno",this.lotno);
      sessionStorage.setItem("sess_curr_batchno",this.batchno);

      document.querySelector('inproduction-button-card').FnSetBatchInfo(this.batchno,this.lotno,this.containerid,this.intentregno,true);
      // document.querySelector('chemical-property-card').FnchemicalpropertyreadService();
      // document.querySelector('mechanical-property-card').FnmechanicalpropertyreadService();
      var all=document.querySelectorAll('.internalviewexpandcard');

      if(id=="true")
      {
        document.querySelector('app-homepage').FnSetInProductionVisibility('true');
        id= document.querySelector("#lot"+this.lotno);        
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#lot"+this.lotno))
        {
          id.opened=false;
        }
        document.querySelector('app-homepage').FnSetInProductionVisibility('false');
        id= document.querySelector("#lot"+this.lotno);
        id.toggle();
      }
      if(clrid=="true")
      {
        for(var i= 0;i<all.length;i++){
          document.querySelector('app-homepage').FnSetInProductionVisibility('true');
          if(all[i].id==document.querySelector("#card"+this.lotno).id){
            if(i!=0) {
              all[i].style.marginTop=((i*(x))-i-(i))+"%";
            }
            all[i].style.visibility='visible';
          }
          else
            all[i].style.visibility='hidden';
        }
        clrid= document.querySelector("#card"+this.lotno);

      }
      else
      {
        if(clrid!=document.querySelector("#card"+this.lotno))
        {
          //document.querySelector('my-app').setVisible("true");
          document.querySelector('app-homepage').FnSetInProductionVisibility('true');
          for(var i=0;i<all.length;i++){
            if(all[i].id==document.querySelector("#card"+this.lotno).id){
              all[i].style.visibility='visible';
            }
            else
              all[i].style.visibility='hidden';
          }

          clrid= document.querySelector("#card"+this.lotno);
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
    }
  });
})();
