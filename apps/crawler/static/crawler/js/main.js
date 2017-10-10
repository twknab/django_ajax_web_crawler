/*
Main.JS file for `crawler` application.
Performs jQuery actions after user submission to fulfill AJAX functionality.
*/

// When Document is ready:
$( document ).ready(function() {

    // ---------------------------------------- //
    // -- Setup CSRF Token for POST Requests -- //
    // ---------------------------------------- //
    // https://docs.djangoproject.com/en/1.11/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-is-true

    // Store CSRF Token for POST request:
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    // Setup CSRF Safe-mode for non POST requests:
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection:
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    // -------------------------- //
    // -- On Crawl Form Submit -- //
    // -------------------------- //

    // On `Crawl Form` submit, setup AJAX header and then make AJAX request:
    $( "#crawl_form" ).submit(function( event ) {
        // Runs POST method to server via AJAX call and appends response data to DOM.

        // ---------------- //
        // -- AJAX Setup -- //
        // ---------------- //

        // Because this is a  POST request, setup AJAX in advance:
        // https://docs.djangoproject.com/en/1.11/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-is-true
        // Note: `CSRF_USE_SESSIONS` has been set to `True` in `django_ajax_web_crawler/settings.py`
        $.ajaxSetup({
            // Gathers CSRF token and attaches it to request header for validation:
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        // ------------------------------- //
        // -- AJAX Request and Response -- //
        // ------------------------------- //

        // Use $.ajax() method to perform AJAX:
        // See https://learn.jquery.com/ajax/jquery-ajax-methods/ for more info:
        $.ajax({
            // The URL for the request
            url: "/crawl",

            // The data to send (will be converted to a query string)
            // Note: I think this is the proper way to send the entire form back:
            data: {
                url: $( "#website" ).val(),
            },

            // Whether this is a POST or GET request
            type: "POST",


            // The type of data we expect back
            dataType : "json",
        })
        // Code to run if the request succeeds (is done);
        // The response is passed to the function
        .done(function( response ) {

            // ----------------------------------------------- //
            // -- If user form submission fails Validations -- //
            // ----------------------------------------------- //

            // If `message` property was sent in `response` object by error:
            if (response.message) {
                console.log("ERROR")
                $( ".errors" ).html( "<p>" + response.message + "</p>" );
                // Prevent actual form submission after DOM is updated
                event.preventDefault();
            } else { // If no error message present:
                // Removes any error messages if present:
                $( ".errors" ).html( "" );

                // ------------------------------------------------------------ //
                // -- Setup HTML to Append to DOM with AJAX Response Objects -- //
                // ------------------------------------------------------------ //

                /*
                Note: I chose to use an html string approach to append my HTML data
                to the DOM following my AJAX request. I chose this approach to allow
                for developer readability. Indentations in javascript have been added
                to mirror the HTML formatting, for ease of reading. If editing, be
                cautious of the string quotation marks "" wrapped around each HTML line.
                */

                // Begin HTML String which will append to DOM:
                var html_str = "<!-- Show Crawler Results -->";
                html_str += "<fieldset class='result'><legend><h2>Results for: " + response.url + "</h2></legend>"; // URL address is added to results <h1>
                html_str += "<!-- Display Prettified HTML: -->";
                html_str += "<h3>Extracted HTML:</h3>";
                html_str += "<div id='results'>";
                html_str += "<textarea class='result_html'>" + response.html + "</textarea>"; // appends HTML text to response
                html_str += "</div>";
                html_str += "<hr>";
                html_str += "<!-- Display Crawler HREF Results (Table): -->";
                html_str += "<h3>Extracted URLs and their Occurrences:</h3>";
                html_str += "<table>";
                html_str += "<tr>";
                html_str += "<th>URL:</th>";
                html_str += "<th>Occurrences:</th>";
                html_str += "</tr>";
                html_str += "<!-- use Django to iterate through items inside of `hrefs` dictionary -->";
                // # Begin URL Output Table:
                // Loop through each key in `response.hrefs` Object:
                for (var url in response.hrefs){
                    console.log ('>>> ');
                    // If `response.hrefs` has key, print URL and URL count:
                    if (response.hrefs.hasOwnProperty(url)) {
                        html_str += "<tr>";
                        html_str += "<!-- Print the URL -->";
                        html_str += "<td>" + url + "</td>";
                        html_str += "<!-- Print the occurrences of the URL -->";
                        html_str += "<td>" + response.hrefs[url] + "</td>";
                        html_str += "</tr>";
                    }
                }
                // # End URL Output Table
                html_str += "</table>";
                html_str += "</fieldset>";
                // End HTML String.

                // Append this HTML string to `<body>`:
                $( "body" ).append( html_str );
            }

        })
        // Code to run if the request fails; the raw request and
        // status codes are passed to the function
        .fail(function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            $( ".errors" ).html( "<p>Website not valid and cannot be crawled.</p>" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        })
        // Code to run regardless of success or failure;
        .always(function( xhr, status ) {
            alert( "The request is complete!" );
            console.log(status);
        });
        // Prevent actual form submission after DOM is updated
        event.preventDefault();
    });

});
