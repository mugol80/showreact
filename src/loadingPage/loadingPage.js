import './loadingPage.css';

function addEvent(obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    }
    else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj[type+fn] = function() {obj["e"+type+fn](window.event);
        }
        obj.attachEvent("on"+type, obj[type+fn]);
    }
}

function afterLoadedFn() {
    var loadingPageConatiner = document.getElementById("loadingPageConatiner");
    loadingPageConatiner.classList.add("hidden");
}

addEvent(window, 'load', function(){ afterLoadedFn() });
