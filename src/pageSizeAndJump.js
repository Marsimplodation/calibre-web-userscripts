// ==UserScript==
// @name         Calibreweb customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set width of manga pages
// @author       You
// @match        https://manga/*
// @grant        none
// ==/UserScript==


(function() {
        'use strict';

        function setCookie(name, value, dayToExpire) {
                var expDate = new Date();
                expDate.setDate(expDate.getDate + dayToExpire);
                value = encodeURIComponent(value) + "; expires=" + expDate.toUTCString();
                document.cookie = name + "=" + value;
        }

        function getCookie(name) {
                var cookieName = name + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var cookieArray = decodedCookie.split(';');
                for (var i = 0; i < cookieArray.length; i++) {
                        var cookie = cookieArray[i];
                        while (cookie.charAt(0) == ' ') {
                                cookie = cookie.substring(1);
                        }
                        if (cookie.indexOf(cookieName) == 0) {
                                return cookie.substring(cookieName.length, cookie.length);
                        }
                }
                return "";
        }

        // Function to set the width of elements with a specific class name
        function setWidthForClass(className, width) {
                // Select all elements with the specified class name
                const elements = document.querySelectorAll(`.${className}`);

                // Iterate over the elements and set their width
                elements.forEach(element => {
                        element.style.width = width;
                });
        }

        // Function to inject a button into the title bar after a delay
        function injectElements() {
                // Identify the title bar element 
                const titleBar = document.getElementById('titlebar');

                // Create a slider element
                const container = document.createElement('div');
                const slider = document.createElement('input');


                var size = getCookie("page-width");
                if (size === "") { size = 1.0;}


                slider.className = 'slider';
                slider.type = 'range'; // Set input type to range
                slider.min = 0; // Minimum value
                slider.max = 100; // Maximum value (100%)
                slider.value = 100; // Initial value (50%)

                function change(e) {
                        const percentage = parseFloat(e.value) / 100; // Convert value to a percentage between 0 and 1
                        const desiredWidth = `${percentage * 100}%`; // Convert percentage to width value (e.g., '50%' for 50%)
                        const className = 'mainImage';
                        setCookie("page-width", percentage, 60);
                        setWidthForClass(className, desiredWidth);

                }

                slider.addEventListener('input', function(){change(this)});
                slider.value = 100 * size;
                change(slider);
                container.appendChild(slider);
                titleBar.appendChild(container);
                
                //handle resize
                window.addEventListener("resize", function(){change({'value': 100*getCookie('page-width')})});
        }
        setTimeout(injectElements, 500);

        //--------- Page Jump ------//
        function handleKeyPress(event) {
                // Check if the pressed key is 'g' (you can use any key you prefer)
                if (event.key === 'g') {
                        // Ask for a number using a prompt dialog
                        const page = prompt('Jump to page:');
                        //current Image is a variable used by calibreweb
                        var delta = page - currentImage;
                        if (delta == 0) return;
                        var direction = 'next';
                        if (delta < 0) { delta = -delta; direction = 'prev'; }
                        for (var i = 0; i < delta; i++) {
                                if (direction == 'prev') showPrevPage();
                                else showNextPage();
                        }
                        currentImage = page;
                }
        }

        document.addEventListener('keypress', handleKeyPress);


        //custom CSS
        // Define your CSS styles here
        const customCSS = `
/* Your CSS styles here */
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;  
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%; 
  background: #04AA6D;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #04AA6D;
  cursor: pointer;
}
`;

        function injectCSS(css) {
                // Create style element
                const style = document.createElement('style');
                style.textContent = css;
                // Append style element to the head of the document
                document.head.appendChild(style);
        }

        // Call the function to inject CSS
        injectCSS(customCSS);

})();


