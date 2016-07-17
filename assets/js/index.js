window.onload = function() {
    // Setup and perform async service calls
    function loadData(url, callback) {
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    // Inject data from service calls to DOM
    function displayData(data) {
        var streamData = JSON.parse(data.response);
        streamData.streams.forEach(function(value, index) {
            if (value) {
                // Configure the element and structure for easy iterating list elements
                var elementArrayToCreate = ["li", "div", "img", "section", "h2", "p", "p", "span"],
                    classNameArrayToCreate = ["item", "content", "thumbnail", "section", "title", "game-name", "description", "viewer"],
                    nestedLevel = {
                        "li": ["stream-content"],
                        "div": ["stream-thumbnail", "stream-section"],
                        "section": ["stream-title", "stream-game-name", "stream-description"],
                        "p": ["stream-viewer"]
                    };
                createTemplateData(elementArrayToCreate, classNameArrayToCreate, value, nestedLevel);
            }
        });
    }

    // Given the template elements and classNames, setup the node elements
    function createTemplateData(elementArray, classNameArray, content, DOMLevel) {
        var templateArray = [];
        // Check input params before processing
        if (!Array.isArray(elementArray) && !Array.isArray(classNameArray)) {
            return;
        }

        // Ensure that each element will have the appropriate classname
        if (elementArray.length !== classNameArray.length) {
            return;
        }

        // Iterate through all elements to create and set features
        for (var i = 0; i < elementArray.length; i++) {
            var element = document.createElement(elementArray[i]);
            element.setAttribute("class", "stream-" + classNameArray[i]);

            // Add in source for image or viewer counts for span
            if (elementArray[i] == 'img') {
                element.setAttribute("src", content.preview.medium);
            } else if (elementArray[i] == 'span') {
                element.innerHTML = content.viewers;
            }

            // Add in content for appropriate node elements
            switch (classNameArray[i]) {
                case 'title':
                    element.innerHTML = content.channel.display_name;
                    break;
                case 'game-name':
                    element.innerHTML = content.game;
                    break;
                case 'description':
                    element.innerHTML = content.channel.status;
                    break;
            }

            templateArray.push(element);
        }
        buildTemplateElement(templateArray, DOMLevel);
    }

    // Create and append node elements into DOM
    function buildTemplateElement(DOMElementArray, levelObject) {
        for (var j = DOMElementArray.length - 1; j >= 0; j--) {
            var nodeClassName = DOMElementArray[j].className,
                nodeName = DOMElementArray[j].nodeName.toLowerCase();
                
            // Make sure the element exists in object before processing
            if (levelObject[nodeName]) {
                for (var k = 0; k < DOMElementArray.length; k++) {
                    for (var m = 0; m < levelObject[nodeName].length; m++) {
                        if (DOMElementArray[k].className === levelObject[nodeName][m]) {
                            DOMElementArray[j].appendChild(DOMElementArray[k]);
                            var unorderedList = document.getElementById("stream-list");
                            unorderedList.appendChild(DOMElementArray[j]);
                        }
                    }
                }
            }
        }
    }

    // Retrieve the data streams from Twitch API
    loadData("https://api.twitch.tv/kraken/search/streams?q=starcraft", displayData);
}
