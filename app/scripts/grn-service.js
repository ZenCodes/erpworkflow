/**
 * Created by praba on 2/12/2016.
 */
//JS file for grn service
(function() {
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
      arg.irnno=irn;
      arg.invoiceno=invoice;
      arg.item=item;
      arg.state=state;
      this.searchparam=arg;
      this.searchurl=sessionStorage.getItem("curr_sess_url")+"search-service";
      this.$.searchitemreadajax.generateRequest();
    },
    //Binding search item response to the search view card
    searchitemreadResponse:function(e) {
      var arr = e.detail.response.itemarr;
      var rnflag = e.detail.response.rnflag;
      //alert(JSON.stringify(arr));
      //alert(rnflag);
      if (rnflag != "1") {
      document.querySelector('app-homepage').setPage('Search Items');
      document.querySelector('searchread-page').itemArray = arr;
      }
      if(rnflag=="1"){
        //Setting current page in session for fetching labels dynamically
        localStorage.setItem("curr_sess_showpage","outwardsearchread-page");
        //calling webcomponent service to fetch labels for current page
        document.querySelector('webcomponent-service').callWebcomponentService();
        document.querySelector('app-homepage').setPage('OutwardSearch Items');
        document.querySelector('outwardsearchread-page').itemArray=arr;
      }
    },
    FnIntentitemReadService:function(){
      this.intenturl=sessionStorage.getItem("curr_sess_url")+"intentitemread-service";
      this.$.intentitemreadajax.generateRequest();
    },
    intentitemreadResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      document.querySelector('viewintent-page').itemArray=e.detail.response.itemarr;
    }
  });
})();
