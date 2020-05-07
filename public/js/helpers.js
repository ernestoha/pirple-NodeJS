/*
 * Helpers
 *
 */

// Container for Helpers
var helpers = {};

helpers.ping = function () {
    console.log({cart_ping: cart.ping()});
    return 111;
};

helpers.userAuth = function() {
    if (!app.config.sessionToken){
    //   window.location = '/session/create';
        app.logUserOut();
        return false;
    } else {
        return true;
    }
}
  
helpers.camelize = function (str) {
    var arr = str.split('-');
    var capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
    return capital.join("");
}

helpers.addDiv = function (message, className) {
    var div = document.createElement("DIV"); // Create a <div> element
    div.innerHTML = message;                 //"This field can not be empty"; // Insert text
    div.className = className;               // Set Css class
    div.style.display = 'block';
    return div;
};

helpers.addForm = function (name, className) {
    className = className == undefined ? name : className;
    var form = document.createElement("FORM");
    form.name = name;
    form.classList.add(className);
    return form;
};

helpers.addInput = function (name, type, value, className) {
    var input = document.createElement('INPUT');
    input.name = name;
    input.type = type;
    input.value = value;
    if (className != undefined)
        input.classList.add(className);
    return input;
};

helpers.getInputVal = function(form, name) {
    return form.querySelector('input[name="'+name+'"]').value;
};

helpers.bindClick = function(objAll, objName, field="id", node = "document"){
    var objAll = document.querySelectorAll(objAll);
    for (var i = 0; i < objAll.length; i++) {// for all browsers and ES versions
      // console.log(objAll[i]);
      objAll[i].addEventListener("click", eval(objName + '.' + helpers.camelize(objAll[i][field])+"_onClick")); //the same id name is the JS function name+_onClick (names from kebab-case to camelCase)
      // objAll[i].addEventListener("click", eval(camelize(objAll[i].id)+"_onClick")); //the same id name is the JS function name+_onClick (names from kebab-case to camelCase)
      
    }
};