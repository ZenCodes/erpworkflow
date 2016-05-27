/**
 * Created by praba on 2/12/2016.
 */
//JS file for the supplierlist page
//The same card is reused in inwardslip page and the additem card
(function() {
  var retestarr=[];
  Polymer({is:"retest-card",
    ready:function() {

      //Setting current page in session for fetching labels dynamically
      localStorage.setItem("curr_sess_showpage","retest-card");
      //calling webcomponent service to fetch labels for current page
      this.$.ID_Webcomponent_Service.callWebcomponentService();
      //To initially show current logged role state items requesting service component to make req to the server
      this.$.gs.retestitemreadService();
    },
    FnCallPage:function(){
      //Setting current page in session for fetching labels dynamically
      localStorage.setItem("curr_sess_showpage","retest-card");
      //calling webcomponent service to fetch labels for current page
      this.$.ID_Webcomponent_Service.callWebcomponentService();
      //To initially show current logged role state items requesting service component to make req to the server
      this.$.gs.retestitemreadService();
    },
    Fngetresendvalue:function(retestirn){
      retestarr.push(retestirn);
    },
    FnSendtoretest:function(e){
      this.$.gs.resenditemtoqualityService(sessionStorage.getItem("sess_curr_inwardregno"));
    }
  });
})();
