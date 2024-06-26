// ==UserScript==
// @name         Kavita customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set width of manga pages
// @author       You
// @match        http://kavita/*
// @grant        none
// ==/UserScript==

(function(){"use strict";function setCookie(name,value,dayToExpire){var expDate=new Date;expDate.setDate(expDate.getDate+dayToExpire);value=encodeURIComponent(value)+"; expires="+expDate.toUTCString();document.cookie=name+"="+value}function getCookie(name){var cookieName=name+"=";var decodedCookie=decodeURIComponent(document.cookie);var cookieArray=decodedCookie.split(";");for(var i=0;i<cookieArray.length;i++){var cookie=cookieArray[i];while(cookie.charAt(0)==" "){cookie=cookie.substring(1)}if(cookie.indexOf(cookieName)==0){return cookie.substring(cookieName.length,cookie.length)}}return""}var currentValue=getCookie("page-width");var newScaling=document.createElement("input");newScaling.type="range";newScaling.className="form-range";newScaling.min=0;newScaling.max=100;newScaling.value=currentValue;newScaling.addEventListener("input",function(){modifyImageWidth(this.value);setCookie("page-width",this.value,30)});function modifyImageWidth(percentage){const styleSheets=document.styleSheets;for(let i=0;i<styleSheets.length;i++){const styleSheet=styleSheets[i];const cssRules=styleSheet.cssRules||styleSheet.rules;for(let j=0;j<cssRules.length;j++){const rule=cssRules[j];if(rule.selectorText&&rule.selectorText.includes("img")&&rule.selectorText.includes("content")){rule.style.width=percentage+"%"}}}}function replace(){var scaling=document.getElementById("page-fitting");if(!scaling)return;scaling.replaceWith(newScaling)}setTimeout(function(){modifyImageWidth(currentValue)},1e3);setInterval(replace,100)})();