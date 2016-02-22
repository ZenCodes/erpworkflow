/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"physicqualifyitemread-card",
  ready:function(){
    //Setting url to make request
    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualifyitem-card";

  }
});
