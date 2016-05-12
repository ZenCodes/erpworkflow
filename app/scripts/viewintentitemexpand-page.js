/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"viewintentitemexpand-page",
  ready:function(){
    this.poraiseflag=0;
    this.hidesupplier=true;
    this.hideprintpdf=true;
    this.promotestate=["Created","Approved","POCreated","POSent","Accepted"];
    this.promotebtn=["Approve","Create PO","Send PO","Accept"];
    this.inpromotestate=["Created","Approved","Supplied","Accepted"];
    this.inpromotebtn=["Approve","Supply","Accept"];
    this.spotpromotestate=["SpotCreated","SpotApproved"];
    this.spotpromotebtn=["Approve"];
    this.intentexpandurl=sessionStorage.getItem("curr_sess_url")+"intentitemexpand-card";
  },
  //fetches item info under the INT corresponding to the user loggedin role
  intentexpanditemreadService:function(itemdes,intentregno){
    
    //alert(intentregno);
    this.itemdes=itemdes;
    this.intentregno=intentregno;
    var arg={"itemdes":"","intentregno":""};
    arg.itemdes=itemdes;
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
      var obj={"intentstate":"","promote":"","itemdes":"","quantity":"","qtymeasure":"","remarks":"","unit":"","unitmeasure":"","specification":"","state":"","createdby":""};
      obj.itemdes=arr[i].itemdes;
      obj.quantity=arr[i].quantity+" "+arr[i].unitmeasure;
      obj.unit=arr[i].unit+"  "+arr[i].qtymeasure;
      obj.specification=arr[i].specification;
      obj.remarks=arr[i].remark;
      obj.intentstate=arr[i].intentstate;
      obj.state=arr[i].state;      
      this.createdby=arr[i].createdby;
      //alert(obj.intentstate);
      if(obj.state=='external'){
      for(var j=0;j<(this.promotestate).length;j++){  
      //alert(obj.intentstate); 
      //alert(this.promotestate[j]);     
        if(obj.intentstate==this.promotestate[j]){
          this.promote=this.promotebtn[j];
          if(this.promote=="Send PO"){
            this.hideprintpdf=false;
          } 
        }
      }
      }
      if(obj.state=='internal'){
      for(var j=0;j<(this.promotestate).length;j++){  
      //alert(obj.intentstate); 
      //alert(this.promotestate[j]);     
        if(obj.intentstate==this.inpromotestate[j]){
          this.promote=this.inpromotebtn[j]; 
          //if(this.promote=="Supply")
            //this.hidesupplier=true;
        }
      }
      }
      if(obj.state=='spot'){
      for(var j=0;j<(this.promotestate).length;j++){  
      //alert(obj.intentstate); 
      //alert(this.promotestate[j]);     
        if(obj.intentstate==this.spotpromotestate[j]){
          this.promote=this.spotpromotebtn[j]; 
          //if(this.promote=="Supply")
            //this.hide=true;
        }
      }
      }
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
  },
  FnPromoteState:function(e){
    //alert(this.promote+" "+this.poraiseflag);  
  if(this.promote=="Create PO"&&this.poraiseflag==0){
  //alert('show supplier');
    for(var i=0;i<(this.promotebtn).length;i++){
    if(this.promote==this.promotebtn[i]){      
      //this.$.intentservice.FnIntentPoItemRead();
      this.FnIntentPoItemRead();
    }
  }
  }
  else if(this.promote=="Create PO"&&this.poraiseflag==1){
    //alert('raise po');
    for(var i=0;i<(this.promotebtn).length;i++){
      if(this.promote==this.promotebtn[i])
        this.$.intentservice.FnIntentStateUpdate(this.promotestate[i+1]);
    }
  }
  else{
  for(var i=0;i<(this.promotebtn).length;i++){
    if(this.promote==this.promotebtn[i]){      
      this.$.intentservice.FnIntentStateUpdate(this.promotestate[i+1]);
      //alert(this.promotestate[i+1]);
    }
    else if(this.promote==this.inpromotebtn[i]){
      this.$.intentservice.FnIntentStateUpdate(this.inpromotestate[i+1]);
      //alert(this.promotestate[i+1]);
    }
    else if(this.promote==this.spotpromotebtn[i]){
      this.$.intentservice.FnIntentStateUpdate(this.spotpromotestate[i+1]);
      //alert(this.promotestate[i+1]);
    }
  }
  }
  },
   FnIntentPoItemRead:function(){
         var obj={"intentregno":"","itemdes":""};
         obj.intentregno=sessionStorage.getItem("sess_curr_intentregno");
         obj.itemdes=sessionStorage.getItem("sess_curr_itemdes");
         this.intentpourl=sessionStorage.getItem("curr_sess_url")+"intentpoitemread-service";
         this.intentpoparam=obj;
         this.$.intentpoitemajax.generateRequest();      
      },
      FnintentpoitemResponse:function(e){
        this.suppliernamearr=e.detail.response.itemarr;
        this.hidesupplier=false;
        // alert(JSON.stringify(e.detail.response.itemarr));
        //document.querySelector('viewintentitemexpand-page').suppliernamearr=e.detail.response.itemarr;
        //alert(document.querySelector('viewintentitemexpand-page').suppliernamearr);
        //document.querySelector('viewintentitemexpand-page').FnShowSupplierDiv();
      },
  FnShowSupplierDiv:function(){
    //alert("hi");
    this.hidesupplier=false;    
  },
  FnSelectSupplier:function(e){
      this.poraiseflag=1;
      var selectedsupplier=e.target.selectedItem.textContent.trim();
      //alert(selectedsupplier);
      this.$.intentservice.FnCreatePO(selectedsupplier);      
  },
  FnSetPoRaiseFlag:function(){

    this.poraiseflag=1;
  }
});
