/**
 * Created by praba on 2/13/2016.
 */
//JS componet for search expand card
(function() {
  var arr=[];
  var id="true";
  var clrid="true";
  var regno="";
  var n=1;
  Polymer({is:"searchitem-card",
    ready:function(){
      this.icons="icons:arrow-drop-down";
      //alert(this.inwardregno+"   "+id+"   "+clrid);
    },
    //Function which invokes when click on expand icon button
    FnExpandItemCard:function(){
      var n=1;
      var x=-4;
      sessionStorage.setItem("sess_curr_inwardregno",this.inwardregno);
      //document.querySelector('my-app').setVisible("true");
      this.$.sc.searchreadService(this.inwardregno);
      this.$.sc.callWebcomponentService();
      var all=document.querySelectorAll('.expandcard');
      if(id=="true")
      {

        id= document.querySelector("#"+this.inwardregno);
        id.toggle();
      }
      else
      {
        if(id!=document.querySelector("#"+this.inwardregno))
        {
          id.opened=false;
        }

        id= document.querySelector("#"+this.inwardregno);
        id.toggle();
      }
      if(clrid=="true")
      {
        localStorage.setItem("curr_sess_POchangeflag","0");
        for(var i=0;i<all.length;i++){

          if(all[i].id==document.querySelector("#card"+this.inwardregno).id){
            if(i!=0){
              all[i].style.marginTop=((i*(x))-i)+"%";
              /* if(i%2==0)
               x=x-0.2;
               if(i%3==0)
               x=x-0.3;
               if(i%4==0)
               x=x-0.4;*/
            }
            if(i>10){
              all[i].style.marginTop=((i*(x+(-.5)))-i)+"%";
            }
            all[i].style.visibility='visible';

          }
          else
            all[i].style.visibility='hidden';
        }

        clrid= document.querySelector("#card"+this.inwardregno);

      }
      else
      {
        if(clrid!=document.querySelector("#card"+this.inwardregno))
        {
          localStorage.setItem("curr_sess_POchangeflag","0");
          //document.querySelector('my-app').setVisible("true");
          for(var i=0;i<all.length;i++){
            if(all[i].id==document.querySelector("#card"+this.inwardregno).id){
              all[i].style.visibility='visible';
            }
            else
              all[i].style.visibility='hidden';
          }

          clrid= document.querySelector("#card"+this.inwardregno);
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
    setToggle:function()
    {
      var toggleid=sessionStorage.getItem("sess_curr_inwardregno");
      if(id=="true"){}
      else{
        id = document.querySelector("#" + toggleid);
        id.opened = false;
      }
    }
  });
})();
