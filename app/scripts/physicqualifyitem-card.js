/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"physicqualifyitem-card",
  ready:function(){
    this.updateflag="false";
    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualifyitem-card";
  },
  FnSaveItem:function(){
    //Validating container and quantity fields,if container or quantity accepted fileds are greater than received fields it will throw error
    //Validating quantity field
   /*if(parseInt(this.qtyaccepted)>parseInt(this.qtyyreceived)){
      this.querySelector('#qty'+this.inwardno).validate();
      this.$.ID_Show_Dialog.FnShowDialog("Accepted quantity shouldn't greater than received quantity!","");
    }
    //validating Container field
    else if(parseInt(this.containeraccepted)>parseInt(this.ctrreceived)){
      this.querySelector('#ctr'+this.inwardno).validate();
      this.$.ID_Show_Dialog.FnShowDialog("Accepted container quantity shouldn't greater than received container quantity!","");
    }*/
    //if all validations are done it will call ajax component to update the changes
    //else{
    document.querySelector("#cont"+this.inwardno).validate();
    document.querySelector("#heat"+this.inwardno).validate();
    document.querySelector("#qty"+this.inwardno).validate();
      if((this.ponumber==null||this.ponumber=="")&&(localStorage.getItem("curr_sess_POchangeflag")!=1))
      {
        alert("PO number should be filled out!");
      }
      else
      {
        this.inspectionstatus="1";
        this.podate=localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber=localStorage.getItem("curr_sess_PONumber");

        switch(parseInt(sessionStorage.getItem("curr_sess_roleflag"))){
          case 1:
            this.status=localStorage.getItem("curr_sess_currflowstatus");
            this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
            break;
          case 2:
            this.status=localStorage.getItem("curr_sess_currflowstatus");
            this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
            break;
          case 3:
            this.status=localStorage.getItem("curr_sess_currflowstatus");
            this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
            break;
          case 4:
            this.status=localStorage.getItem("curr_sess_currflowstatus");
            this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
            break;
        }
        this.$.form.submit();
    }
    //}
  },
  FnRejectItem:function(){
    if((this.ponumber==null||this.ponumber=="")&&(localStorage.getItem("curr_sess_POchangeflag")!=1))
    {
      alert("PO number should be filled out!");
    }
    else
    {
      this.inspectionstatus="0";
      this.podate=localStorage.getItem("localsess_curr_inwarddate");
      this.ponumber=localStorage.getItem("curr_sess_PONumber");
      switch(parseInt(sessionStorage.getItem("curr_sess_roleflag"))){
        case 1:
          this.status=localStorage.getItem("curr_sess_currflowstatus");
          this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
          break;
        case 2:
          this.status=localStorage.getItem("curr_sess_currflowstatus");
          this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
          break;
        case 3:
          this.status=localStorage.getItem("curr_sess_currflowstatus");
          this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
          break;
        case 4:
          this.status=localStorage.getItem("curr_sess_currflowstatus");
          this.newstatus=localStorage.getItem("curr_sess_currflownewstatus");
          break;
      }
      this.$.form.submit();
    }
  },
  FnResponse:function(e)
  {
    this.$.ID_Show_Dialog.FnShowDialog(e.detail.response.flag,"");
  }
});
