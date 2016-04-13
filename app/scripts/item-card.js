/**
 * Created by praba on 2/12/2016.
 */
(function(){
  Polymer({is:"item-card",
    ready:function(){
      this.qty=null;
      this.comments="";
      this.unit;
      this.containerunit=true;
      this.qtymeasure=true;

      var auto_input="autoinput"+localStorage.getItem("curr_sess_unitset");
      var txt_input1="textinput1"+localStorage.getItem("curr_sess_unitset");
      var txt_input3="textinput3"+localStorage.getItem("curr_sess_unitset");
      var txt_input5="textinput5"+localStorage.getItem("curr_sess_unitset");
      var txt_input6="textinput6"+localStorage.getItem("curr_sess_unitset");
      var txt_input2="textinput2"+localStorage.getItem("curr_sess_unitset");
      var txt_input4="textinput4"+localStorage.getItem("curr_sess_unitset");
      var date_input="dateinput"+localStorage.getItem("curr_sess_unitset");

      //It would hide remarks and adjust the style properties of the item card components when reusing this card for the outward mode
      if(localStorage.getItem("curr_sess_wardflag")=="0") {
        // alert("0");
        if( localStorage.getItem("curr_sess_othersupplierflag")=="true"){
          this.FnChangeField();
          this.querySelector("#" + txt_input6).style.width = '30%';
        }
        else {
          this.querySelector("#" + auto_input).style.width = '25%';
          this.querySelector("#" + txt_input1).style.width = '12%';
          this.querySelector("#" + txt_input1).style.marginLeft = '-14%';
          this.querySelector("#" + txt_input3).style.width = '14%';
          this.querySelector("#" + txt_input3).style.marginLeft = '2%';
          this.querySelector("#" + txt_input5).style.width = '16%';
          this.querySelector("#" + txt_input5).style.marginLeft = '-9%';
          this.querySelector("#" + txt_input6).style.visibility = 'hidden';
          this.querySelector("#" + date_input).style.visibility = 'hidden';          
        }
      }
      if(localStorage.getItem("curr_sess_wardflag")=="1") {
        // alert("1");
        this.querySelector("#" + auto_input).style.width = '27%';
        this.querySelector("#" + txt_input1).style.width = '19%';
        this.querySelector("#" + txt_input1).style.marginLeft = '-10%';
        this.querySelector("#" + txt_input3).style.width = '19%';
        this.querySelector("#" + txt_input3).style.marginLeft = '5%';
        this.querySelector("#" + txt_input5).style.visibility = 'hidden';
        this.querySelector("#" + txt_input6).style.visibility = 'hidden';
        this.querySelector("#" + date_input).style.visibility = 'hidden';
      }
      else if(localStorage.getItem("curr_sess_wardflag")=="2") {
        // alert("2");
        //alert('hi'+this.querySelector("#" + txt_input6));
        this.querySelector("#" + auto_input).style.width = '20%';
        this.querySelector("#" + txt_input1).style.width = '9%';
        this.querySelector("#" + txt_input6).style.marginLeft = '-2%';
        this.querySelector("#" + txt_input6).style.width = '9%';
        this.querySelector("#" + txt_input6).style.visibility = 'visible';
        this.querySelector("#" + date_input).style.visibility = 'visible';
      }

    },
    FnChangeField:function(){
      //alert('yes');
      var auto_input="autoinput"+localStorage.getItem("curr_sess_unitset");
      var txt_input1="textinput1"+localStorage.getItem("curr_sess_unitset");
      var txt_input3="textinput3"+localStorage.getItem("curr_sess_unitset");
      var txt_input5="textinput5"+localStorage.getItem("curr_sess_unitset");
      var txt_input6="textinput6"+localStorage.getItem("curr_sess_unitset");
      var txt_input2="textinput2"+localStorage.getItem("curr_sess_unitset");
      var txt_input4="textinput4"+localStorage.getItem("curr_sess_unitset");
      var date_input="dateinput"+localStorage.getItem("curr_sess_unitset");
      this.querySelector("#" + auto_input).style.visibility = 'hidden';
      this.querySelector("#" + date_input).style.visibility = 'hidden';
      //this.querySelector("#" + txt_input1).style.width = '9%';

      this.querySelector("#" + txt_input6).style.width = '22%';
      this.querySelector("#" + txt_input6).style.visibility = 'visible';
      this.querySelector("#" + txt_input6).style.marginLeft = '-25%';

      this.querySelector("#" + txt_input1).style.visibility = 'visible';
      this.querySelector("#" + txt_input1).style.marginLeft = '2%';
      this.querySelector("#" + txt_input1).style.width = '8%';
      this.querySelector("#" + txt_input2).style.visibility = 'visible';
      this.querySelector("#" + txt_input2).style.marginLeft = '1%';
      this.querySelector("#" + txt_input2).label="unit";
      this.querySelector("#" + txt_input3).style.visibility = 'visible';
      this.querySelector("#" + txt_input3).style.marginLeft = '3%';
      this.querySelector("#" + txt_input3).style.width = '8%';
      this.querySelector("#" + txt_input4).style.visibility = 'visible';
      this.querySelector("#" + txt_input4).style.marginLeft = '1%';
      this.querySelector("#" + txt_input4).label="measure";
      this.querySelector("#" + txt_input4).style.width = '5%';
      this.querySelector("#" + txt_input5).style.visibility = 'visible';
      this.querySelector("#" + txt_input5).style.width = '16%';

      this.querySelector("#" + txt_input5).style.marginLeft = '-10%';
      //this.querySelector("#" + txt_input5).style.width = '5%';

      this.containerunit=false;
      this.qtymeasure=false;
    },
    //Function Invoked when input changing in input fields
    FnInputChanged:function(e) {

      /*var currid="input"+localStorage.getItem("curr_sess_unitset");
      this.querySelector("#"+currid).value=localStorage.getItem("curr_sess_showunitvalue");*/
      if(localStorage.getItem("curr_sess_othersupplierflag")=="true") {

        document.querySelector('item-page').FnSetCustomInputValue(this.specification, this.container, this.qtyreceived, this.comments, this.unit, this.measure, 'nopo', 'others');
      }
      else {

        var txt_input2 = "textinput2" + localStorage.getItem("curr_sess_unitset");
        this.querySelector("#" + txt_input2).value = localStorage.getItem("curr_sess_showmeasurevalue");
        var txt_input4 = "textinput4" + localStorage.getItem("curr_sess_unitset");
        this.querySelector("#" + txt_input4).value = localStorage.getItem("curr_sess_showunitvalue");
        this.weight = this.container;
        this.qty = this.qtyreceived;
        this.remark = this.comments;
        this.specification = this.specification;
        //Setting info in localstorage to refer in item page
        localStorage.setItem("localsess_curr_qtyreceived", this.qtyreceived);
        localStorage.setItem("localsess_curr_remark", this.remark);
        //Binding info to the item page
        if (localStorage.getItem("curr_sess_wardflag") != "1") {
          document.querySelector('item-page').FnSetIteminfo(this.weight, this.qty, this.remark);
        }
        if (localStorage.getItem("curr_sess_wardflag") == "1") {
          document.querySelector('outwarditem-page').FnSetIteminfo(this.weight, this.qty);
        }
        if (localStorage.getItem("curr_sess_wardflag") == "2") {
          document.querySelector('intent-page').FnSetIteminfo(this.specification, this.weight, this.qty, this.remark);
        }
      }
    },
    FnsetValue:function(){
      this.container="";
      this.unit="";
      this.qtyreceived="";
      this.measure="";

    }
  });
})();
