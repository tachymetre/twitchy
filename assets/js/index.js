document.addEventListener('DOMContentLoaded', function() {
    var defaultQuery = "starcraft"; // Default query variable

    // Setup and and interact with Twitch API using JSONP
    function loadJSONPData(url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };

        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }

    // Inject data from service calls to DOM
    function displayData(streamData) {
        // Add in the total number of streams
        document.getElementById("total-stream").innerHTML = streamData._total;

        // Invoke the navigation function to generate navigation page(s)
        displayStreamNavigation(streamData._total, streamData.streams.length, streamData._links.prev, streamData._links.next);

        // Clear the previous streams if exist
        var unorderedList = document.getElementById("stream-list");
        while (unorderedList.firstChild) {
            unorderedList.removeChild(unorderedList.firstChild);
        }

        // Process the stream data subsequently 
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
                element.innerHTML = content.viewers + " viewers";
            }

            // Add in content for appropriate node elements
            switch (classNameArray[i]) {
                case 'title':
                    element.innerHTML = content.channel.display_name;
                    break;
                case 'game-name':
                    element.innerHTML = content.game + " - ";
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
        // Iterate through DOM elements to create nested level architecture
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

    // Generate TwitchAPI URL nased on query
    function searchStreamAction(searchQuery) {
        // If there are space(s) in search query, replace with "%20" in Unicode
        if (searchQuery.indexOf(" ") > -1) {
            searchQuery = searchQuery.split(" ").join("%20");
        }
        return "https://api.twitch.tv/kraken/search/streams?q=" + searchQuery;
    }

    // Generate navigation items based on the stream content(s)
    function displayStreamNavigation(elementTotal, eachPageElement, previousPageUrl, nextPageUrl) {
        var total,
            pageIndex,
            navigationDisplay = document.getElementById("navigation-page"),
            previousLink = document.getElementById("previous-link"),
            nextLink = document.getElementById("next-link");

        // Calculate the total page(s) needed for all the stream data
        total = (elementTotal % eachPageElement !== 0) ? (Math.floor(elementTotal / eachPageElement) + 1) : (elementTotal / eachPageElement);

        // If on the first page then set the page index to default value, otherwise retrieve it
        if (!previousPageUrl) {
            pageIndex = 1;
            localStorage.setItem("pageIndex", pageIndex);
        } else {
            pageIndex = parseInt(localStorage.getItem("pageIndex"));
        }

        // Display the navigation indicator
        navigationDisplay.innerHTML = pageIndex + "/" + total;

        // Add in event handler(s) for navigation action
        previousLink.addEventListener("click", function() {
            if (previousPageUrl) {
                pageIndex--;
                localStorage.setItem("pageIndex", pageIndex);
                loadData(previousPageUrl, displayData);
            }
        });
        nextLink.addEventListener("click", function() {
            if (nextPageUrl) {
                pageIndex++;
                localStorage.setItem("pageIndex", pageIndex);
                loadData(nextPageUrl, displayData);
            }
        });
    }

    // Retrieve the default data streams from Starcraft Twitch API
    loadJSONPData(searchStreamAction(defaultQuery), displayData);

    // Add click event action to perform a search for the input query
    document.getElementById("search-button").addEventListener("click", function() {
        var inputValue = document.getElementById("search-input").value;
        // Make sure input not empty before making service call
        if (inputValue) {
            loadData(searchStreamAction(inputValue), displayData);
        }
    });
});
