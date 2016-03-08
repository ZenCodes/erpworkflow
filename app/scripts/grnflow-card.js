/**
 * Created by praba on 2/12/2016.
 */
(function() {
  this.forwardflowenableflag = "1";
  Polymer({
    is: "grnflow-card",
    ready: function () {
      this.searchstateflag = "true";
      //this.enabled=true;
      this.idval = ["Stores", "Production", "Quality", "Purchase", "Confirm"];
      this.flag = "true";
      this.flowenableflag = "";

      var role = [{"rolename": "Stores manager", "index": "0"},
        {"rolename": "Production manager", "index": "1"},
        {"rolename": "Quality manager", "index": "2"},
        {"rolename": "Purchase manager", "index": "3"},
        {"rolename": "manager", "index": "4"}];

      for (var i = 0; i < role.length; i++) {
        if (role[i].rolename == sessionStorage.getItem("loggedrole")) {
          this.flowenableflag = role[i].index;
        }
      }

      // alert(this.flowenableflag);
      var buttongroup = this.querySelectorAll('paper-button');

      //Logged as general role for search disable all state
      if (this.flowenableflag == 4) {
        // alert("true");
        for (var i = 0; i < buttongroup.length; i++) {
          //alert("in"+  this.querySelector("#"+buttongroup[i].id));
          this.querySelector("#" + buttongroup[i].id).disabled = true;
          //this.querySelector("#"+buttongroup[i].id).style.backgroundColor="#e5efe2";
          this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
        }
      }
      //Logged as other flow managers
      else {
        for (var i = 0; i < buttongroup.length; i++) {
          if (i == this.flowenableflag)
            this.querySelector("#" + buttongroup[i].id).disabled = false;

          else {
            this.querySelector("#" + buttongroup[i].id).disabled = true;
            this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
          }
        }
      }

      if (sessionStorage.getItem("curr_sess_roleflag") == "1") {
        this.querySelector("#" + this.idval[0] + "1").id = this.idval[0];
        this.querySelector("#" + this.idval[0]).style.backgroundColor = '#bfbfbf';
        //this.querySelector("#"+this.idval[0]).style.color='white';
        this.flag = this.idval[0];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "2") {
        this.querySelector("#" + this.idval[1] + "1").id = this.idval[1];
        this.querySelector("#" + this.idval[1]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[1];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "3") {
        this.querySelector("#" + this.idval[2] + "1").id = this.idval[2];
        this.querySelector("#" + this.idval[2]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[2];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "4") {
        this.querySelector("#" + this.idval[3] + "1").id = this.idval[3];
        this.querySelector("#" + this.idval[3]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[3];
      }
    },
    click: function (e) {
      //alert(this.flag+"  "+e.target.id);
      if (this.flag == "true") {
        this.querySelector("#" + e.target.id + "1").id = e.target.id;
        this.querySelector("#" + e.target.id).style.backgroundColor = '#bfbfbf';
        this.flag = e.target.id;
      }
      else {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + e.target.id + "1").id = e.target.id;
        this.querySelector("#" + e.target.id).style.backgroundColor = '#bfbfbf';
        this.flag = e.target.id;
      }
      document.querySelector('home-page').setPage('Inward Flow');
      localStorage.setItem("curr_sess_forwardstate", '0');
      if (sessionStorage.getItem("curr_sess_roleflag") == "1") {
        var flowflag = localStorage.getItem('curr_sess_flowstate');
        if (e.target.id == 'Stores' && flowflag == "1" || e.target.id == 'Stores' && flowflag == "0") {
          window.location.href = "indexhome.html";
        }
      }
      if (sessionStorage.getItem("curr_sess_roleflag") == "2") {
        var flowflag = localStorage.getItem('curr_sess_flowstate');
        if (e.target.id == 'Stores' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldStores');
          document.querySelector('physicinsread-page').setState('OldStores');
        }
        if (e.target.id == 'Production' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("true");
          document.querySelector('home-page').setPage('Inward Items');
        }
        if (e.target.id == 'Production' && flowflag == "1") {
          window.location.href = "indexhome.html";
        }
      }

      if (sessionStorage.getItem("curr_sess_roleflag") == "3") {
        var flowflag = localStorage.getItem('curr_sess_flowstate');
        if (e.target.id == 'Stores' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldStores');
          document.querySelector('physicinsread-page').setState('OldStores');
        }
        if (e.target.id == 'Production' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldProduction');
          document.querySelector('physicinsread-page').setState('OldProduction');
        }
        if (e.target.id == 'Quality' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("true");
          document.querySelector('home-page').setPage('Inward Items');
        }
        if (e.target.id == 'Quality' && flowflag == "1") {
          window.location.href = "indexhome.html";
        }
      }


      if (sessionStorage.getItem("curr_sess_roleflag") == "4") {
        var flowflag = localStorage.getItem('curr_sess_flowstate');
        if (e.target.id == 'Stores' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldStores');
          document.querySelector('physicinsread-page').setState('OldStores');
        }
        if (e.target.id == 'Production' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldProduction');
          document.querySelector('physicinsread-page').setState('OldProduction');
        }
        if (e.target.id == 'Quality' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("false");
          localStorage.setItem("curr_sess_expandstate", 'OldQuality');
          document.querySelector('physicinsread-page').setState('OldQuality');
        }
        if (e.target.id == 'Purchase' && flowflag == "0") {
          document.querySelector('app-homepage').setVisible("true");
          document.querySelector('home-page').setPage('Inward Items');
          //localStorage.setItem("curr_sess_expandstate",'qualified');
          //localStorage.setItem("curr_sess_forwardstate",'1');
          //document.querySelector('physicinsread-page').setState('qualified');
        }
        if (e.target.id == 'Purchase' && flowflag == "1") {
          window.location.href = "indexhome.html";
          //document.querySelector('home-page').setPage('Inward Items');
          //document.querySelector('grn-service').physicreadService();
        }
      }

    },
    setFlag: function () {
      if (sessionStorage.getItem("curr_sess_roleflag") == "1") {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + this.idval[1] + "1").id = this.idval[1];
        this.querySelector("#" + this.idval[1]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[1];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "2") {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + this.idval[2] + "1").id = this.idval[2];
        this.querySelector("#" + this.idval[2]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[2];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "3") {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + this.idval[3] + "1").id = this.idval[3];
        this.querySelector("#" + this.idval[3]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[3];
      }
      else if (sessionStorage.getItem("curr_sess_roleflag") == "4") {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + this.idval[4] + "1").id = this.idval[4];
        this.querySelector("#" + this.idval[4]).style.backgroundColor = '#bfbfbf';
        this.flag = this.idval[4];
      }
    },
    disableBackstate: function () {
      var flowflag = localStorage.getItem('curr_sess_flowstate');

      /*var alldiv=this.querySelectorAll('.div');
       for(var i=0;i<alldiv.length;i++)
       alert(this.querySelector("#"+alldiv[i].id));*/

      if (flowflag == "1") {
        // alert(this.flowenableflag);
        var buttongroup = this.querySelectorAll('paper-button');
        for (var i = 0; i < buttongroup.length; i++) {
          if (i == (parseInt(this.flowenableflag)) || i == (parseInt(this.flowenableflag) + 1)) {
            this.querySelector("#" + buttongroup[i].id).disabled = false;
            if (i == (parseInt(this.flowenableflag) + 1)) {
              this.querySelector("#" + buttongroup[i].id).disabled = false;
              this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
            }
            //this.querySelector("#Purchase").innerHTML = "hello";
          }

          else {
            this.querySelector("#" + buttongroup[i].id).disabled = true;
            this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
          }
        }
      }
    },
    setSearchflowState: function (state, stateno) {

      if (this.searchstateflag == "true") {
        this.querySelector("#" + (this.idval[stateno - 1]) + "1").id = this.idval[stateno - 1];
        this.querySelector("#" + (this.idval[stateno - 1])).style.backgroundColor = "#bfbfbf";
        this.searchstateflag = this.idval[stateno - 1];
      }
      else {
        this.querySelector("#" + this.searchstateflag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.searchstateflag).id = this.searchstateflag + "1";
        this.querySelector("#" + (this.idval[stateno - 1]) + "1").id = this.idval[stateno - 1];
        this.querySelector("#" + (this.idval[stateno - 1])).style.backgroundColor = '#bfbfbf';
        this.searchstateflag = this.idval[stateno - 1];
      }
    },
    forwardDisableBackState: function () {
      var flowflag = localStorage.getItem('curr_sess_forwarddisablestate');
      var buttongroup = this.querySelectorAll('paper-button');
      //alert(flowflag);
      this.flowenableflag = parseInt(sessionStorage.getItem("curr_sess_roleflag")) - 1;
      if (flowflag == "0") {
        //alert(this.flowenableflag);
        //Logged as general role for search disable all state
        if (this.flowenableflag == 4) {
          // alert("true");
          for (var i = 0; i < buttongroup.length; i++) {
            //alert("in"+  this.querySelector("#"+buttongroup[i].id));
            this.querySelector("#" + buttongroup[i].id).disabled = true;
            //this.querySelector("#"+buttongroup[i].id).style.backgroundColor="#e5efe2";
            this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
          }
        }
        //Logged as other flow managers
        else {
          for (var i = 0; i < buttongroup.length; i++) {
            if (i <= this.flowenableflag)
              this.querySelector("#" + buttongroup[i].id).disabled = false;

            else {
              this.querySelector("#" + buttongroup[i].id).disabled = true;
              this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
            }
          }
        }
      }
      else if(flowflag=="1"){
        if (this.flowenableflag == 4) {
          // alert("true");
          for (var i = 0; i < buttongroup.length; i++) {
            //alert("in"+  this.querySelector("#"+buttongroup[i].id));
            this.querySelector("#" + buttongroup[i].id).disabled = true;
            //this.querySelector("#"+buttongroup[i].id).style.backgroundColor="#e5efe2";
            this.querySelector("#" + buttongroup[i].id).style.backgroundColor = "transparent";
          }
        }
        //Logged as other flow managers
        else {
          for (var i = 0; i < buttongroup.length; i++) {
            if (i <= this.flowenableflag)
              this.querySelector("#" + buttongroup[i].id).disabled = true;
          }
        }

      }
    }
  });
})();
