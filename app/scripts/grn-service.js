
//JS file for grn service
(function() {
  var intentstate;
  var arrlength=0;
  var no=0;
  Polymer({
    is: "grn-service",
    ready:function()
    {
    },    
    updatequalityparameterService:function(qualityarray){
      arrlength=0;
      no=0;
      arrlength=qualityarray.length;
      for(var i=0;i<qualityarray.length;i++){
        var obj={"measure":"","inwardregno":"","containerid":"","name":"","minvalue":"","maxvalue":"","actualvalue":"","remarks":"","testdate":""};
        obj.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");
        obj.containerid=localStorage.getItem("curr_sess_expandedcontainer");
        obj.name=qualityarray[i].name;
        obj.minvalue=qualityarray[i].minvalue;
        obj.maxvalue=qualityarray[i].maxvalue;
        obj.actualvalue=qualityarray[i].actualvalue;
        obj.remarks=qualityarray[i].remarks;
        obj.testdate=qualityarray[i].testdate;
        obj.measure=qualityarray[i].measure;
        this.updatequalityparameterurl=sessionStorage.getItem("curr_sess_url")+"updatequalityparameter-service";
        this.updatequalityparameterparam=obj;
        this.$.updatequalityparameterajax.generateRequest();
      }
    },
    updatequalityparameterResponse:function(e){
      if(e.detail.response=="succ"){
        no=no+1;
      }
      if(arrlength==no){
        this.qualityparametersequenceurl=sessionStorage.getItem("curr_sess_url")+"qualityparametersequenceupdate-service";
        this.$.qualityparametersequenceajax.generateRequest();
      }
    },
    qualityparametersequenceResponse:function(e){
      if(e.detail.response=="succ") {
        alert("Updated!!");
        document.querySelector('physicqualifyitem-card').FnReferesh();
      }
    },
    //Invoking service to fetch item under state according to the role logged in
    physicreadService:function(){
      var arg={"status":"","roleid":"","empid":""};
      arg.empid=sessionStorage.getItem("loggeduser");
      arg.roleid=sessionStorage.getItem("curr_sess_roleflag");
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
      this.url=sessionStorage.getItem("curr_sess_url")+"forwardflowitem-service";
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
      this.url1=sessionStorage.getItem("curr_sess_url")+"backwardflowitem-service";
      this.$.flowphysicitemreadajax.generateRequest();
    },
    //Binding response info to the physicinsread card
    flowphysicitemreadResponse:function(e)
    {
      var arr=e.detail.response;      
      var temparr=[];
      temparr.push(arr[0]);      
      if(localStorage.getItem("curr_sess_forwardstate")=='0'){        
        document.querySelector('physicinsread-page').itemArray=temparr;
        document.querySelector('physicqualifyread-card').physicqualifyreadService(sessionStorage.getItem("sess_curr_inwardregno"));
      }
      if(localStorage.getItem("curr_sess_forwardstate")=='1'){
        document.querySelector('home-page').setPage('Inward Items');
        document.querySelector('physicins-page').itemArray=arr;
      }
    },
    //Requesting for item info which is requested by the user
    searchService:function(irn,invoice,item,state)
    {      
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
      if(rnflag=="no match"){
        document.querySelector('no-items').setErrorMessage('Please enter valid IRN/ORN number!');
        document.querySelector('app-homepage').setPage('no-items');       
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
          if(inflag=="no items"){
            document.querySelector('no-items').setErrorMessage('Sorry, No active Invoice in this number');
            document.querySelector('app-homepage').setPage('no-items');
          }            
          else if(itemflag=="no items"){
            document.querySelector('no-items').setErrorMessage('Please choose valid item!');
            document.querySelector('app-homepage').setPage('no-items');
          }            
          else
          {
            document.querySelector('no-items').setErrorMessage('Sorry, No active IRN/ORN in this number');
            document.querySelector('app-homepage').setPage('no-items');
          }            
        }
      }
    },
    FnIntentitemReadService:function(){
      this.intenturl=sessionStorage.getItem("curr_sess_url")+"intentitemread-service";
      var arg={"loggeduser":"","state":"","loggedrole":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");
      arg.loggedrole=sessionStorage.getItem("loggedrole");     
      this.intentparam=arg;
      this.$.intentitemreadajax.generateRequest();     
    },
    intentitemreadResponse:function(e){      
      var itemarr=e.detail.response.itemarr;
      // alert(JSON.stringify(itemarr));
      // alert(localStorage.getItem('curr_sess_postate'));
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
      arg.state="external";
      }
      this.intentsupplyparam=arg;      
      this.$.intentsupplyitemreadajax.generateRequest();
    },
    intentsupplyitemreadResponse:function(e){
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
    },
    retestitemreadService:function(){
      this.retesturl=sessionStorage.getItem("curr_sess_url")+"retestitemread-service";
      this.$.retestitemreadajax.generateRequest();
    },
    retestitemreadResponse:function(e){      
        document.querySelector('retest-card').itemArray = e.detail.response.itemarr;      
    },
    resenditemtoqualityService:function(inwardregno){
      this.resenditemtoqualityurl=sessionStorage.getItem("curr_sess_url")+"resenditemtoquality-service";      
        var obj={"inwardregno":"","updatestate":"","checkstate":""};
        obj.inwardregno=inwardregno;
        obj.updatestate='Quality';
        obj.checkstate='Confirm';
        this.resenditemtoqualityparam=obj;
        this.$.resenditemtoqualityajax.generateRequest();      
    },
    resenditemtoqualityResponse:function(e){      
      if(e.detail.response=="succ") {
        alert("Item sent for retesting!");
      }
      else
      alert("Failed to send item!");
    },
    FnFetchInternalIntentService:function(){
      // alert('calling.......');
      this.internalintentitemreadurl=sessionStorage.getItem("curr_sess_url")+"internalintentitemread-service";
      var arg={"loggeduser":"","intentstate":"","state":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");
      if(sessionStorage.getItem("loggedrole")=="Stores manager")
      {
      arg.intentstate="Approved";
      arg.state="internal";
      }
      this.internalintentitemreadparam=arg;      
      this.$.internalintentitemreadajax.generateRequest();
    },
    internalintentitemreadResponse:function(e){
      var arr=e.detail.response;
      // alert(JSON.stringify(arr));
      for(var i=0;i<arr.length;i++){
        arr[i].Quantity=arr[i].Quantity+" "+arr[i].Quantity_Measure;
        arr[i].unit=arr[i].unit+" "+arr[i].Unit_Measure;
      }
      if(sessionStorage.getItem("loggedrole")=="Stores manager")
      document.querySelector('internalintent-page').itemArray=arr;
    }

  });
})();
