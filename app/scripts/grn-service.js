/**
 * Created by praba on 2/12/2016.
 */
//JS file for grn service
(function() {
  var intentstate;
  Polymer({
    is: "grn-service",
    ready:function()
    {
    },
    //Invoking service to fetch item under state according to the role logged in
    physicreadService:function(){
    
      var arg={"status":""};
      switch(parseInt(sessionStorage.getItem("curr_sess_roleflag"))){
        case 1:
              arg.status=localStorage.getItem("curr_sess_currflowstatus");
              break;
        case 2:
              arg.status=localStorage.getItem("curr_sess_currflowstatus");
              break;
        case 3:
              arg.status=localStorage.getItem("curr_sess_currflowstatus");
              break;
        case 4:
              arg.status=localStorage.getItem("curr_sess_currflowstatus");
              break;

      }
      this.param=arg;
      //alert(JSON.stringify(arg));
      this.url=sessionStorage.getItem("curr_sess_url")+"forwardflowitem-service";
      //this.url='http://127.0.0.1:3000/grn-service';
      this.$.physicitemreadajax.generateRequest();
    },
    //Received response for the requested state of items and bind it to the physicins page
    physicitemreadResponse:function(e)
    {
      var arr=e.detail.response;
      document.querySelector('physicins-page').itemArray=arr;
      
    },
    //Fetching history of the items correspoding to the item viewed by the current logged role
    flowphysicreadService:function(state){
      var arg={"status":"","inwardregno":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");
      arg.status=state;
      this.param1=arg;
      //alert(arg);
      //alert(localStorage.getItem("curr_sess_forwardstate"));
      this.url1=sessionStorage.getItem("curr_sess_url")+"backwardflowitem-service";
      this.$.flowphysicitemreadajax.generateRequest();
    },
    //Binding response info to the physicinsread card
    flowphysicitemreadResponse:function(e)
    {
      var arr=e.detail.response;
      //alert('coming....');
      //alert(JSON.stringify(arr));
      if(localStorage.getItem("curr_sess_forwardstate")=='0'){
        //document.querySelector('home-page').setPage('Inward Flow');
        document.querySelector('physicinsread-page').itemArray=arr;
        document.querySelector('physicqualifyread-card').physicqualifyreadService(sessionStorage.getItem("sess_curr_inwardregno"));
        //this.$.pqrc.physicqualifyreadService(sessionStorage.getItem("sess_curr_inwardregno"));
        //alert('done');
        //document.querySelector('home-page').setPage('Inward Flow');
      }
      if(localStorage.getItem("curr_sess_forwardstate")=='1'){
        document.querySelector('home-page').setPage('Inward Items');
        document.querySelector('physicins-page').itemArray=arr;
      }
    },
    //Requesting for item info which is requested by the user
    searchService:function(irn,invoice,item,state)
    {
      ///alert(irn+"  "+invoice+"   "+item+"  "+state);
      var arg={"irnno":"","invoiceno":"","item":"","state":""};
      arg.irnno=(irn.toUpperCase()).replace(/\s/g, "") ;
      arg.invoiceno=(invoice.toUpperCase()).replace(/\s/g, "") ;
      arg.item=item.toUpperCase();
      arg.state=state;
      this.searchparam=arg;
      this.searchurl=sessionStorage.getItem("curr_sess_url")+"search-service";
      this.$.searchitemreadajax.generateRequest();
    },
    //Binding search item response to the search view card
    searchitemreadResponse:function(e) {
      var arr = e.detail.response.itemarr;
      var rnflag = e.detail.response.rnflag;
      var inflag = e.detail.response.inflag;
      var itemflag = e.detail.response.itemflag;
      //alert(rnflag+"  "+inflag+"  "+itemflag);
      //alert(rnflag);
      if(rnflag=="no match"){
        document.querySelector('no-items').setErrorMessage('Please enter valid IRN/ORN number!');
        document.querySelector('app-homepage').setPage('no-items');
       // alert("Please enter valid search item!");
      }
      else {
        if (arr.length > 0) {
          if (rnflag != "1") {
            document.querySelector('app-homepage').setPage('Search Items');
            document.querySelector('searchread-page').itemArray = arr;
          }
          if (rnflag == "1") {
            //Setting current page in session for fetching labels dynamically
            localStorage.setItem("curr_sess_showpage", "outwardsearchread-page");
            //calling webcomponent service to fetch labels for current page
            document.querySelector('webcomponent-service').callWebcomponentService();
            document.querySelector('app-homepage').setPage('OutwardSearch Items');
            document.querySelector('outwardsearchread-page').itemArray = arr;
          }
        }
        else {
          //this.$.ID_Show_Dialog.FnShowDialog("No IRN/ORN Number available","");
          if(inflag=="no items"){
            document.querySelector('no-items').setErrorMessage('Sorry, No active Invoice in this number');
            document.querySelector('app-homepage').setPage('no-items');
          }
            //alert("No Invoice Number available!");
          else if(itemflag=="no items"){
            document.querySelector('no-items').setErrorMessage('Please choose valid item!');
            document.querySelector('app-homepage').setPage('no-items');
          }
            //alert("No Matching Item available!");
          else
          {
            document.querySelector('no-items').setErrorMessage('Sorry, No active IRN/ORN in this number');
            document.querySelector('app-homepage').setPage('no-items');
          }
            //alert("No IRN/ORN Number available!");
        }
      }
    },
    FnIntentitemReadService:function(){
     
      this.intenturl=sessionStorage.getItem("curr_sess_url")+"intentitemread-service";
      var arg={"loggeduser":"","state":"","loggedrole":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");
      arg.loggedrole=sessionStorage.getItem("loggedrole");
     // arg.state=state;
      this.intentparam=arg;
     
      /*if((sessionStorage.getItem("loggedrole")=="Stores manager")||(sessionStorage.getItem("loggedrole")=="Purchase manager")){
      //alert("yes");
      this.FnIntentsupplyitemReadService();
      }
      else
      {*/
        //alert("No");
        this.$.intentitemreadajax.generateRequest();        
     // }
    },
    intentitemreadResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      var itemarr=e.detail.response.itemarr;     
      var items=[];
      if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        for(var i=0;i<itemarr.length;i++){
          if(localStorage.getItem('curr_sess_postate')==itemarr[i].intentstate){          
            items.push(itemarr[i]);
          }
        }        
        document.querySelector('viewintent-page').itemArray=items;
      }
      else{        
      document.querySelector('viewintent-page').itemArray=e.detail.response.itemarr;
      }
      
    },
    FnIntentsupplyitemReadService:function(){
      //alert("coming...");
      //intentstate=state;
      this.intentsupplyurl=sessionStorage.getItem("curr_sess_url")+"intentsupplyitemread-service";
      var arg={"loggeduser":"","intentstate":"","state":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");   
      
      if(sessionStorage.getItem("loggedrole")=="Stores manager")
      {      
      arg.intentstate="Approved";
      arg.state="internal";
      }
      if(sessionStorage.getItem("loggedrole")=="Purchase manager"){
      intentstate="Approved";
      //arg.intentstate="Approved";
      arg.state="external";
      }
      this.intentsupplyparam=arg;
      //(JSON.stringify(arg));
      this.$.intentsupplyitemreadajax.generateRequest();
    },
    intentsupplyitemreadResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      //alert(sessionStorage.getItem("loggedrole"));
      //alert(intentstate);
      if(sessionStorage.getItem("loggedrole")=="Stores manager")
      document.querySelector('viewintent-page').itemArray=e.detail.response.itemarr;
      if(sessionStorage.getItem("loggedrole")=="Purchase manager")
      {
      document.querySelector('viewintent-page').itemArray=e.detail.response.itemarr;
      }     
      
    },
    FnIntentViewitemReadService:function(){
      this.intentviewurl=sessionStorage.getItem("curr_sess_url")+"intentviewitemread-service";
      var arg={"loggeduser":"","loggedrole":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");
      arg.loggedrole=sessionStorage.getItem("loggedrole");     
      this.intentviewparam=arg;
      this.$.intentviewitemreadajax.generateRequest();        
    },
    intentviewitemreadResponse:function(e){      
      document.querySelector('intentview-card').itemArray=e.detail.response.itemarr;      
    }
  });
})();
