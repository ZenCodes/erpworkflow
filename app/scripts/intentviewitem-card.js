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
  Polymer({is:"intentviewitem-card",
    ready:function(){
      this.icons="icons:arrow-drop-down";
      //this.$.osc.outwardsearchreadService(this.inwardregno);
    },

    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){
      var n=1;
      var x=-4;

      sessionStorage.setItem("sess_curr_inwardregno",this.intentregno);
      //document.querySelector('my-app').setVisible("true");
      this.$.ps.intentviewexpanditemreadService(this.intentregno);
      this.$.ps.callWebcomponentService();
      //this.$.sc.callWebcomponentService();
      var all=document.querySelectorAll('.intentviewexpandcard');
      if(id=="true")
      {
        document.querySelector('app-homepage').FnSetPromoteVisibility('true');
        id= document.querySelector("#"+this.intentregno);
        //alert(id);
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#"+this.intentregno))
        {
          id.opened=false;
        }
        document.querySelector('app-homepage').FnSetPromoteVisibility('false');
        id= document.querySelector("#"+this.intentregno);
        id.toggle();
      }
      if(clrid=="true")
      {

        for(var i= 0;i<all.length;i++){
          document.querySelector('app-homepage').FnSetPromoteVisibility('true');
          if(all[i].id==document.querySelector("#viewcard"+this.intentregno).id){
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
        clrid= document.querySelector("#viewcard"+this.intentregno);

      }
      else
      {
        if(clrid!=document.querySelector("#viewcard"+this.intentregno))
        {
          //document.querySelector('my-app').setVisible("true");
          for(var i=0;i<all.length;i++){
            document.querySelector('app-homepage').FnSetPromoteVisibility('true');
            if(all[i].id==document.querySelector("#viewcard"+this.intentregno).id){
              all[i].style.visibility='visible';
            }
            else
              all[i].style.visibility='hidden';
          }

          clrid= document.querySelector("#viewcard"+this.intentregno);
        }
        else
        {
          document.querySelector('app-homepage').FnSetPromoteVisibility('false');
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
