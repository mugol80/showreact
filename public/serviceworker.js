importScripts("/js/db_main.js");
/*
var db = openDatabase();

var lead = {id: 1, name: 'Tomek'}
addToObjectStore('leads', lead);

var lead = {id: 2, name: 'Test', val: 'Xcz'}
addToObjectStore('leads', lead);
*/


self.addEventListener("fetch", function(event) {
    var requestURL = new URL(event.request.url);
    // console.log(requestURL);

    if (requestURL.pathname === "/offline/leads") {
        console.log('Get offline leads');
    }
});
