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
      this.icons="icons:arrow-drop-down";
      //this.$.osc.outwardsearchreadService(this.inwardregno);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){
      var n=1;
      var x=3;
      sessionStorage.setItem("sess_curr_inwardregno",this.intentregno);
      //document.querySelector('my-app').setVisible("true");
      this.$.ps.intentexpanditemreadService(this.intentregno);
      this.$.ps.callWebcomponentService();
      //this.$.sc.callWebcomponentService();
      var all=document.querySelectorAll('.expandcard');
      if(id=="true")
      {
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

        id= document.querySelector("#"+this.intentregno);
        id.toggle();
      }
      if(clrid=="true")
      {
        for(var i= 0;i<all.length;i++){
          //alert(all.length);
          if(all[i].id==document.querySelector("#card"+this.intentregno).id){
            if(i!=0) {

              if((all.length-i)>4) {
                //alert((((-i) + (all.length - i)) + 20));
                all[i].style.marginTop = (((-i) + (all.length - i)) + 20)+ "%";
              }
              else {

                // var r=(((-i) + (all.length - i))+15)/3;
                //alert((((-i) + (all.length - i))+15+r));
                all[i].style.marginTop = (((-i) + (all.length - i))+15) + "%";
              }
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
