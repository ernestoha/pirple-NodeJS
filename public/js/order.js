/*
 * Order Logic
 *
 */

// Container for Order methods
var order = {};

//Create new Order
order.createNewOrder_onClick = function(e){
    e.preventDefault();
    var form = this.parentNode.parentNode;//e.path[1];
    // Fetch the user data
    var queryStringObject = {
    'sourceType' : helpers.getInputVal(form, "sourceType")
    };

    order.callAPIandSetMsg('POST', "Order created", queryStringObject, (ret) => {
        console.log({responseOrder: ret});
        if (ret){
            document.getElementById("menuListTable").remove();
        }
    });
  };
  
order.callAPIandSetMsg = function (method, okMsg, queryStringObject, callback){
  if (helpers.userAuth()){
    if (['GET', 'DELETE'].includes(method)){
      byUrl = queryStringObject;
      byForm = undefined;
    } else {
      byUrl = undefined;
      byForm = queryStringObject;
    }   
    var outPut = document.getElementById("formOutPut");
    outPut.innerHTML = ""; //outPut.style.display = 'none';
    app.client.request(undefined,'api/orders', method, byUrl, byForm, function(statusCode,responsePayload){
      if(statusCode == 200){
        console.log(responsePayload);
        outPut.appendChild(helpers.addDiv(okMsg, "formSuccess"));//.formError and .formSuccess
        callback(true);
      } else {
        outPut.appendChild(helpers.addDiv((responsePayload.Error==undefined)?"Error. Check and Try again.":responsePayload.Error, "formError"));//.formError and .formSuccess
        callback(false);
      }
    });
  }
};
  