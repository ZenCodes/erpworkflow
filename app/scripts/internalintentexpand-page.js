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
    // alert(JSON.stringify(arr));
    /*this.intentregno=arr[0].Intent_Register_Number;
    this.intentdate=arr[0].Intent_Date;  
    this.itemdes=arr[0].Product_ID;
    this.requnit=arr[0].requnit;
    this.requnitmeasure=arr[0].requnitmeasure;
    this.reqquantity=arr[0].reqquantity;
    this.reqquantitymeasure=arr[0].reqquantitymeasure;*/
    this.availunit=arr[0].availcontainer;
    this.availunitmeasure=arr[0].Container_Measure;
    this.availquantity=arr[0].availquantity;
    this.availquantitymeasure=arr[0].Quantity_Measure;
    this.callBatchnoService();    
  },
  callBatchnoService:function(){
    var arg={"itemno":""};
    arg.itemno=sessionStorage.getItem("sess_curr_itemno");
    // arg.intentregno=intentregno;
    this.fetchbatchnoparam=arg;
    this.fetchbatchnourl=sessionStorage.getItem("curr_sess_url")+"fetchbatchnos-service";
    this.$.fetchbatchnoajax.generateRequest();    
  },
  fetchbatchnoResponse:function(e){    
    var arr=e.detail.response;
    var temparr=[];
    for(var i=0;i<arr.length;i++){
    temparr.push({"Batch_No":arr[i].Batch_No+"-"+arr[i].quantity+" "+this.availquantitymeasure});
    }
    // alert(JSON.stringify(temparr));
    this.batcharr=temparr;
  },
  FnSelectBatch:function(e){
    var batchno = e.target.selectedItem.textContent.trim();
    batchno=(batchno.substring(0,batchno.indexOf('-'))).trim();
    localStorage.setItem("curr_sess_batchno",batchno);
    var arg={"batchno":""};
    arg.batchno=batchno;    
    this.fetchcontainerparam=arg;
    this.fetchcontainerurl=sessionStorage.getItem("curr_sess_url")+"fetchcontainer-service";
    this.$.fetchcontainerajax.generateRequest(); 
  },
  fetchcontainerResponse:function(e){
    var arr=e.detail.response;
    var ctemparr=[];
    for(var i=0;i<arr.length;i++){
    ctemparr.push({"Container_ID":arr[i].Container_ID+"-"+arr[i].quantity+" "+this.availquantitymeasure});
    }
    this.containerarr=ctemparr;
  },
  FnSelectContainer:function(e){
    var container = e.target.selectedItem.textContent.trim();
    var containerid=(container.substring(0,container.indexOf('-'))).trim();
    var quantity=(container.substring((container.indexOf('-')+1),container.indexOf(' '))).trim();
    var reqquantity=this.reqquantity.substring(0,this.reqquantity.indexOf(' ')).trim();
    // alert(reqquantity+"  "+quantity);
    if(parseInt(reqquantity)>parseInt(quantity)){
      alert("Requested quantity more than the available quantity!!");
    }
    else{
      // alert("Ok!");
      localStorage.setItem("curr_sess_containerid",containerid);
      localStorage.setItem("curr_sess_reqquantity",reqquantity);
    }
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
