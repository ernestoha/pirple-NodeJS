/*
 * Shoppin Cart Logic
 *
 */

// Container for Shopping Cart methods
var cart = {};

cart.ping = function(){
    console.log("pong - 123");
    // /helpers.epa();
    return 11;
};

// Add Item to Cart
cart.addToCart_onClick = function(e){
  e.preventDefault();
  var form = this.parentNode;//e.path[1];
  // console.log(form);
  var queryStringObject = {
    'menuId' : parseInt(helpers.getInputVal(form, "id")),
    'qty' : parseInt(helpers.getInputVal(form, "qty"))
  };
  cart.callAPIandSetMsg('POST', "Added to Shopping Cart", queryStringObject, (ret) => {
    console.log(ret);
  });
};

cart.reCalculateTotals = function(tr) {
  // cart-total-amount
  // cart-total-items
  var amount = document.getElementById("cart-total-amount");
  var items = document.getElementById("cart-total-items");
  var td = tr.querySelectorAll('td');
  // console.log(td);
  // console.log(parseInt(td[1].innerText));
  // console.log(parseFloat(td[3].innerText.substr(2)));
  // amount.innerText -= parseFloat(td[3].innerText.substr(2)); // ... ~ ... --).toFixed(2)
  amount.innerText = (amount.innerText - td[3].innerText.substr(2)).toFixed(2); // ... ~ ...
  items.innerText -= td[1].innerText;
  if ((items.innerText)==0)
    window.location = "cart/list";
}

//Delete Item from Cart
cart.deleteFromCart_onClick = function(e){
  e.preventDefault();
  var form = this.parentNode;//e.path[1];
  // console.log(form);
  var queryStringObject = {
    'id' : helpers.getInputVal(form, "id")
  };
  cart.callAPIandSetMsg('DELETE', "Deleted from Shopping Cart", queryStringObject, (ret) => {
    // console.log(form.parentNode.parentNode);
    cart.reCalculateTotals(form.parentNode.parentNode);
    form.parentNode.parentNode.remove()
  });
};

cart.callAPIandSetMsg = function (method, okMsg, queryStringObject, callback){
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
    app.client.request(undefined,'api/cart', method, byUrl, byForm, function(statusCode,responsePayload){
      if(statusCode == 200){
        console.log(responsePayload);
        if (method=='POST')
          okMsg = responsePayload.qty+" "+responsePayload.name+((responsePayload.qty>1)?'s':'')+" "+okMsg;
        outPut.appendChild(helpers.addDiv(okMsg, "formSuccess"));//.formError and .formSuccess
        callback(true);
      } else {
        outPut.appendChild(helpers.addDiv((responsePayload.Error==undefined)?"Error. Check and Try again.":responsePayload.Error, "formError"));//.formError and .formSuccess
        callback(false);
      }
    });
  }
};
  
// Load the dashboard page specifically
cart.loadCartListPage = function(){
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if(phone){
      // Fetch the user data
      var queryStringObject = {
        'phone' : phone
      };
      // app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
        if(statusCode == 200){
          // Determine how many checks the user has
          console.log(responsePayload);
          var allItems = typeof(responsePayload.cart) == 'object' && responsePayload.cart instanceof Array && responsePayload.cart.length > 0 ? responsePayload.cart : [];
          if(allItems.length > 0){
            var subTotal = 0;
            var itemTotal = 0;
            var c = 1;
            
            // Show each created check as a new row in the table
            allItems.forEach(function(cartId){
              console.log(cartId);
              var newqueryStringObject = {
                'id' : cartId
              };
              app.client.request(undefined,'api/cart','GET',newqueryStringObject,undefined,function(statusCode, item){
                if(statusCode == 200){
                  var form  = helpers.addForm("cart-form")
                  var table = document.getElementById("menuListTable");// Make the check data into a table row
                  console.log(responsePayload);
                  var tr = table.insertRow(-1);
                  tr.classList.add('checkRow');
                  var td0 = tr.insertCell(0);
                  var td1 = tr.insertCell(1);
                  var td2 = tr.insertCell(2);
                  var td3 = tr.insertCell(3);
                  var td4 = tr.insertCell(4);
                  
                  form.appendChild(helpers.addInput("id", "HIDDEN", item.id));
                  form.appendChild(helpers.addInput("delete-from-cart", "submit", "X", "btn-del"));
  
                  td4.classList.add('text-center');
                  td4.appendChild(form);
                  // td0.innerHTML = item.id;
                  td0.innerHTML = item.name;
                  td1.classList.add('text-center');
                  td1.innerHTML = item.qty;
                  td2.classList.add('text-right');
                  td2.innerHTML = '$ ' + item.price;
                  td3.classList.add('text-right');
                  td3.innerHTML = '$ ' + (item.price * item.qty).toFixed(2);
                  subTotal += item.price * item.qty;
                  itemTotal += item.qty;
                }
                if (c==allItems.length){
                  tr = table.insertRow(-1);
                  tr.classList.add('checkRow');
                  tr.classList.add('text-right');
                  
                  var td0 = tr.insertCell(0);
                  td0.colSpan = 4;
                  td0.innerHTML = "<b>Total: Items (<span id='cart-total-items'>"+itemTotal+"</span>) Amount ($ <span id='cart-total-amount'>" + subTotal.toFixed(2) + "</span>)</b>";
                  helpers.bindClick("form.cart-form input[type='submit'].btn-del", "cart", "name");
                } else {
                  c++;
                }
              });
            
            });
  
            var createNewOrder = document.getElementById("createNewOrder");
            createNewOrder.style.display = 'block';
            //createNewOrder.querySelector('button').addEventListener("click", order.createNewOrder_onClick);
            createNewOrder.querySelector("input[type='submit']").addEventListener("click", order.createNewOrder_onClick);
          } else {
            // Show 'you have no items' message
            document.getElementById("noCartItemsMessage").style.display = 'table-row';
  
            // Show the createCheck CTA
            document.getElementById("addNewItemToCart").style.display = 'block';
  
          }
        } else {
          // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
          console.log(111);
          app.logUserOut();
        }
      });
    } else {
      console.log(112);
      app.logUserOut();
    }
};
