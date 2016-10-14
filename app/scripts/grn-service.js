
//JS file for grn service
(function() {
  var intentstate;
  var arrlength=0;
  var no=0;
  var tcmecharr=[];
  var tcchemicarr=[];
  var tcchemic=[];
  var tcmechanic=[];
  var mechtitle=[];
  var chemictitle=[];
  var mechvalue=[];
  var chemicvalue=[];
  var batchcount=0;
  Polymer({
    is: "grn-service",
    ready:function()
    {
    }, 
    // updateproductionstatusService:function(batchno,lotno,containerid,intentregno){
      updateproductionstatusService:function(batcharr){
        this.batcharrlength=batcharr.length;
      var obj={"batchno":"","lotno":"","containerid":"","intentregno":"","loggedrole":""};
        for(var i=0;i<batcharr.length;i++){
        obj.batchno=batcharr[i].batchno;
        obj.containerid=batcharr[i].containerid;
        obj.lotno=batcharr[i].lotno;
        obj.intentregno=batcharr[i].intentregno;
        obj.loggedrole=sessionStorage.getItem("loggedrole");  
        this.updateproductionstatusurl=sessionStorage.getItem("curr_sess_url")+"updateproductionstatus-service";
        this.updateproductionstatusparam=obj;
        this.$.updateproductionstatusajax.generateRequest();
        }
    },
    updateproductionstatusResponse:function(e){
      // alert(e.detail.response);
      batchcount++;
      if(batchcount==this.batcharrlength){
      alert("Updated!!");
      window.location.href="../elements/indexhome.html";
      batchcount=0;
      this.batcharrlength=0;
      }
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
    },
     FnFetchInternalIntentViewService:function(){
      // alert('calling.......');
      this.internalintentviewitemreadurl=sessionStorage.getItem("curr_sess_url")+"internalintentviewitemread-service";
      var arg={"loggedrole":"","intentstate":"","state":""};
      arg.loggedrole=sessionStorage.getItem("loggedrole");
     
      this.internalintentviewitemreadparam=arg;      
      this.$.internalintentviewitemreadajax.generateRequest();
    },
    internalintentviewitemreadResponse:function(e){
      var arr=e.detail.response;
      // alert(JSON.stringify(arr));
      for(var i=0;i<arr.length;i++){
        arr[i].Quantity=arr[i].Quantity+" "+arr[i].Quantity_Measure;
        arr[i].unit=arr[i].Container+" "+arr[i].Container_Measure;
      }
      // alert(JSON.stringify(arr));
      if(sessionStorage.getItem("loggedrole")=="Production manager"||sessionStorage.getItem("loggedrole")=="Quality manager")
      document.querySelector('internalintentview-page').itemArray=arr;
    },
    FncallinsertchemicalService:function(chemicarr){
      // arrlength=chemicarr.length;
      for(var i=0;i<chemicarr.length;i++){
        var obj={"intentregno":"","itemid":"","itemname":"","batchno":"","lotno":"","containerid":"","propertyname":"","actualvalue":"","remarks":"","testdate":""};
      obj.intentregno=chemicarr[i].intentregno;
      obj.containerid=chemicarr[i].containerid;
      obj.itemid=chemicarr[i].itemid;
      obj.itemname=chemicarr[i].itemname;
      obj.batchno=chemicarr[i].batchno;
      obj.lotno=chemicarr[i].lotno;
      obj.propertyname=chemicarr[i].propertyname;
      obj.actualvalue=chemicarr[i].actualvalue;
      obj.remarks=chemicarr[i].remarks;
      obj.testdate=chemicarr[i].testdate;
      obj.createdby=sessionStorage.getItem("loggeduser");

        this.insertchemicaltesturl=sessionStorage.getItem("curr_sess_url")+"insertchemicaltest-service";
        this.insertchemicaltestparam=obj;
        this.$.insertchemicaltestajax.generateRequest();
      }
    },
    insertchemicaltestResponse:function(e){
      alert(e.detail.response);
    },
    FncallinsertmechanicalService:function(mechanicarr){
      
      for(var i=0;i<mechanicarr.length;i++){
        var obj={"intentregno":"","itemid":"","itemname":"","batchno":"","lotno":"","containerid":"","propertyname":"","actualvalue":"","remarks":"","testdate":""};
      obj.intentregno=mechanicarr[i].intentregno;
      obj.containerid=mechanicarr[i].containerid;
      obj.itemid=mechanicarr[i].itemid;
      obj.itemname=mechanicarr[i].itemname;
      obj.batchno=mechanicarr[i].batchno;
      obj.lotno=mechanicarr[i].lotno;
      obj.propertyname=mechanicarr[i].propertyname;
      obj.actualvalue=mechanicarr[i].actualvalue;
      obj.remarks=mechanicarr[i].remarks;
      obj.testdate=mechanicarr[i].testdate;
      obj.createdby=sessionStorage.getItem("loggeduser");
        
        this.insertmechanicaltesturl=sessionStorage.getItem("curr_sess_url")+"insertmechanicaltest-service";
        this.insertmechanicaltestparam=obj;
        this.$.insertmechanicaltestajax.generateRequest();
      }
      
    },
    insertmechanicaltestResponse:function(e){
      alert(e.detail.response);
    },
    Fnfetchtcchemicinfo:function(batchno,containerid){
      var obj={"batchno":"","containerid":""};
      obj.batchno=batchno;
      obj.containerid=containerid;
      this.batchno=batchno;
      this.containerid=containerid;
      this.fetchtcchemicinfourl=sessionStorage.getItem("curr_sess_url")+"fetchtcchemicinfo-service";
      this.fetchtcchemicinfoparam=obj;
      this.$.fetchtcchemicinfoajax.generateRequest();

    },
    fetchtcchemicinfoResponse:function(e){
      tcchemicarr=e.detail.response;
      document.querySelector('test-certificate').itemid=tcchemicarr[0].Item_ID;
      document.querySelector('test-certificate').itemname=tcchemicarr[0].Item_Name;
      document.querySelector('test-certificate').batchno=tcchemicarr[0].Batch_No;
      if(tcchemicarr.length>0)
      {
        this.Fnfetchtcmechinfo(this.batchno,this.containerid);
      }
      // alert(JSON.stringify(e.detail.response));      
    },
    Fnfetchtcmechinfo:function(batchno,containerid){
      var obj={"batchno":"","containerid":""};
      obj.batchno=batchno;
      obj.containerid=containerid;
      this.fetchtcmechinfourl=sessionStorage.getItem("curr_sess_url")+"fetchtcmechinfo-service";
      this.fetchtcmechinfoparam=obj;
      this.$.fetchtcmechinfoajax.generateRequest();
    },
    fetchtcmechinfoResponse:function(e){
      tcmecharr=e.detail.respons
      e;
      if(tcmecharr.length>0)
      {
        this.fetchtcchemic();
      }
      // alert(JSON.stringify(e.detail.response));      
    },
    fetchtcchemic:function(){
      this.chemicalpropertyreadurl=sessionStorage.getItem("curr_sess_url")+"chemicalpropertyread-service";
      // this.chemicalpropertyreadparam=obj;
      this.$.chemicalpropertyreadajax.generateRequest();
    },
    chemicalpropertyreadResponse:function(e){
      tcchemic=e.detail.response;
      // alert(JSON.stringify(tcchemic));
      if(tcchemic.length>0)
      {
        document.querySelector('test-certificate').chemicTitle=tcchemic;
        this.fetchtcmechanic();
      }
    },
    fetchtcmechanic:function(){
      this.mechanicalpropertyreadurl=sessionStorage.getItem("curr_sess_url")+"mechanicalpropertyread-service";
      // this.mechanicalpropertyreadparam=obj;
      this.$.mechanicalpropertyreadajax.generateRequest();
    },
    mechanicalpropertyreadResponse:function(e){
      tcmechanic=e.detail.response;
      document.querySelector('test-certificate').mechanicTitle=tcmechanic;
      // alert(JSON.stringify(tcmechanic));
      var k=0;

      for(var j=0;j<tcchemic.length;j++){
          var obj={};
          var flag=0;
          var temp="";
          for(var i=0;i<tcchemicarr.length;i++){ 

          // alert(tcchemicarr[i].Property_Name+"   "+tcchemic[j].Property_Name);                 
          if((tcchemicarr[i].Property_Name).trim()==(tcchemic[j].Property_Name).trim()){
            // alert('eq');
            obj['property'+(k+1)]=tcchemicarr[i].Property_Value;
            temp=tcchemicarr[i].Property_Value;
            flag=1;
          }
          // else
          //   obj['property'+(k+1)]="Nil";
        }
        if(flag==1)
          chemicvalue.push(temp);
        else
          chemicvalue.push("Nil");
      }


       for(var j=0;j<tcmechanic.length;j++){
          var obj={};
          var flag=0;
          var temp="";
          for(var i=0;i<tcmecharr.length;i++){  
          // alert(tcmecharr[i].Property_Name+"   "+tcmechanic[j].Property_Name);                  
          if((tcmecharr[i].Property_Name).trim()==(tcmechanic[j].Property_Name).trim()){
            // alert('eq');
            obj['property'+(k+1)]=tcmecharr[i].Property_Value;
            temp=tcmecharr[i].Property_Value;
            flag=1;
          }
          // else
          //   obj['property'+(k+1)]="Nil";
        }
        if(flag==1)
          mechvalue.push(temp);
        else
          mechvalue.push("Nil");
        // mechvalue.push(obj);
      }

      document.querySelector('test-certificate').chemicValue=chemicvalue;
      document.querySelector('test-certificate').mechanicValue=mechvalue;
      // alert(JSON.stringify(chemicvalue));
      // alert(JSON.stringify(mechvalue));
    }
  });
})();
