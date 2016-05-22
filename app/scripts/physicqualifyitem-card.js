/**
 * Created by praba on 2/12/2016.
 */
(function() {

  Polymer({
    is: "physicqualifyitem-card",
    ready: function () {
      this.updateflag = "false";
      this.hideradio=true;
      this.url = sessionStorage.getItem("curr_sess_url") + "physicqualifyitem-card";
      if(sessionStorage.getItem("curr_sess_roleflag") == "3")
      this.hideradio=false;
    },

    FnSaveItem: function () {

      document.querySelector("#cont" + this.inwardno).validate();
      document.querySelector("#heat" + this.inwardno).validate();
      document.querySelector("#qty" + this.inwardno).validate();
      if ((this.ponumber == null || this.ponumber == "") && (localStorage.getItem("curr_sess_POchangeflag") != 1)) {
        alert("PO number should be filled out!");
      }
      else {
        this.inspectionstatus = "1";
        this.podate = localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber = localStorage.getItem("curr_sess_PONumber");
        //alert("session:"+localStorage.getItem("curr_sess_PONumber"));
        //alert(this.ponumber);
        switch (parseInt(sessionStorage.getItem("curr_sess_roleflag"))) {
          case 1:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 2:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 3:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 4:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
        }
        //alert(this.status+"  "+this.newstatus);
        this.$.form.submit();
      }
      //}
    },
    FnRejectItem: function () {
      if ((this.ponumber == null || this.ponumber == "") && (localStorage.getItem("curr_sess_POchangeflag") != 1)) {
        alert("PO number should be filled out!");
      }
      else {
        //alert(this.containerid);
        this.inspectionstatus = "0";
        this.podate = localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber = localStorage.getItem("curr_sess_PONumber");
        switch (parseInt(sessionStorage.getItem("curr_sess_roleflag"))) {
          case 1:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 2:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 3:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 4:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;

        }
        this.$.form.submit();
      }
    },
    FnResponse: function (e) {
      this.$.ID_Show_Dialog.FnShowDialog(e.detail.response.flag, "");
    },
    FnExpandInnerCard: function () {
      //alert(this.containerid);
      if (document.querySelector('#radio' + this.containerid).checked == true && sessionStorage.getItem("curr_sess_roleflag") == "3") {
        localStorage.setItem("curr_sess_expandedcontainer", this.containerid);
        this.$.specificationcard.FnspecificationitemreadService();
        this.$.qualityparameterdisplay.FnparameterdisplayService();
        document.querySelector("#inner" + this.containerid).toggle();
      }
      if (document.querySelector('#radio' + this.containerid).checked == false && sessionStorage.getItem("curr_sess_roleflag") == "3") {
        document.querySelector("#inner" + this.containerid).toggle();
        this.$.specificationcard.FnHideSpeccard();
      }
    }
  });
})();
