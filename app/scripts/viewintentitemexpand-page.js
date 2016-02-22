/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"viewintentitemexpand-page",
  ready:function(){
    this.intentexpandurl=sessionStorage.getItem("curr_sess_url")+"intentitemexpand-card";
  },
  //fetches item info under the INT corresponding to the user loggedin role
  intentexpanditemreadService:function(intentregno){
    //alert(intentregno);
    this.intentregno=intentregno;
    var arg={"intentregno":""};
    arg.intentregno=intentregno;
    this.intentexpandparam=arg;
    this.intentexpandurl=sessionStorage.getItem("curr_sess_url")+"intentitemexpand-card";
    this.$.intentexpanditemreadajax.generateRequest();

  },
  //Response binding to the card
  FnIntentexpanditemreadResponse:function(e)
  {
    var arr=e.detail.response.itemarr;
    //alert(JSON.stringify(arr));
    var commarr=[];
    var prodarr=[];
    var potempflag="";
    for(var i=0;i<arr.length;i++)
    {
      var obj={"itemdes":"","quantity":"","qtymeasure":"","remarks":"","unit":"","unitmeasure":"","specification":""};
      obj.itemdes=arr[i].itemdes;
      obj.quantity=arr[i].quantity+" "+arr[i].unitmeasure;
      obj.unit=arr[i].unit+"  "+arr[i].qtymeasure;
      obj.specification=arr[i].specification;
      obj.remarks=arr[i].remark;
      prodarr.push(obj);
    }

    this.itemArray=prodarr;

  },
  //Function to fetch labels for the card
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  FnWebcomponentreadResponse:function(e) {
    this.current_page="viewintentitemexpand-page";
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
  }
});
