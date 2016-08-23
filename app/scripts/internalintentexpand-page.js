/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"internalintentexpand-page",
  ready:function(){    
  },
  //fetches item info under the INT corresponding to the user loggedin role
  internalintentexpandreadService:function(itemno,intentregno){
    this.itemno=itemno;
    this.intentregno=intentregno;
    var arg={"itemno":"","intentregno":""};
    arg.itemno=itemno;
    arg.intentregno=intentregno;
    this.internalintentexpandreadparam=arg;
    this.internalintentexpandreadurl=sessionStorage.getItem("curr_sess_url")+"internalintentexpandread-service";
    this.$.internalintentexpandreadajax.generateRequest();
  },
  //Response binding to the card
  FnInternalintentexpandreadResponse:function(e)
  {
    var arr=e.detail.response;
    alert(JSON.stringify(arr));
    this.intentregno=arr[0].Intent_Register_Number;
    this.intentdate=arr[0].Intent_Date;  
    this.itemdes=arr[0].Product_ID;
    this.requnit=arr[0].requnit;
    this.requnitmeasure=arr[0].requnitmeasure;
    this.reqquantity=arr[0].reqquantity;
    this.reqquantitymeasure=arr[0].reqquantitymeasure;
    this.availunit=arr[0].availunit;
    this.availunitmeasure=arr[0].availunitmeasure;
    this.availquantity=arr[0].availquantity;
    this.availquantitymeasure=arr[0].availquantitymeasure;    
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
