/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
 (function(){
  var poarray;

Polymer({is:"intentviewitemexpand-card",
  ready:function(){
    this.intentviewexpandurl=sessionStorage.getItem("curr_sess_url")+"intentviewitemexpand-card";
  },
  //fetches item info under the INT corresponding to the user loggedin role
  intentviewexpanditemreadService:function(intentregno){    
    //alert(intentregno);
    this.intentregno=intentregno;
    var arg={"intentregno":""};
    arg.intentregno=intentregno;
    this.intentviewexpandparam=arg;
    this.intentviewexpandurl=sessionStorage.getItem("curr_sess_url")+"intentviewitemexpand-card";
    this.$.intentviewexpanditemreadajax.generateRequest();
  },
  //Response binding to the card
  FnIntentviewexpanditemreadResponse:function(e)
  {
    var arr=e.detail.response.itemarr;
    //alert(JSON.stringify(arr));
    var commarr=[];
    var prodarr=[];
    var potempflag="";
    for(var i=0;i<arr.length;i++)
    {
      var obj={"disableflag":"","intentstate":"","itemdes":"","quantity":"","qtymeasure":"","duedate":"","unit":"","unitmeasure":"","specification":""};
      obj.itemdes=arr[i].itemdes;
      obj.quantity=arr[i].quantity+" "+arr[i].unitmeasure;
      obj.unit=arr[i].unit+"  "+arr[i].qtymeasure;
      obj.specification=arr[i].specification;
      obj.duedate=arr[i].duedate;
      obj.intentstate=arr[i].intentstate;
      if(obj.intentstate!='Approved')
        obj.disableflag=true;
      else
        obj.disableflag=false;
      prodarr.push(obj);
    }
    this.itemArray=prodarr;
    
    //alert(JSON.stringify(this.itemArray));
  },
  //Function to fetch labels for the card
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  FnWebcomponentreadResponse:function(e) {
    this.current_page="intentviewitemexpand-card";
    //alert(this.current_page);
    var arr = e.detail.response;
    //alert(arr.length);
    var labelvalue=[];
    var errorlabelvalue=[];
    //Binding labels to login-card
    for(var i=1;i<arr.length;i++) {
      //alert(arr[i].Page[0].page[0]);
      if ((arr[i].Page[0].page[0]) == this.current_page) {
        labelvalue = arr[i].Page[1].Label;
        /*Binding Labels and error message to the respective card*/
        this.label = labelvalue;
      }
    }
  },
  FnPOArrayInfo:function(poarr){
   poarray=poarr;
  },
  FnPromoteState:function(){

    this.$.intentservice.FnIntentViewPoCreateService(poarray);
   //alert(JSON.stringify(poarray));
   //alert('raise po');

  }
});
})();