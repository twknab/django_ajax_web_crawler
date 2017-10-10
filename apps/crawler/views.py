#-------------------------------------#
#-- Setup Application Dependencies: --#
#-------------------------------------#
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, redirect
from django.http import JsonResponse # for sending json
from urllib2 import urlopen # import Python native HTML parser so we may feed a URL to beautifulsoup4
from bs4 import BeautifulSoup # import `beautifulsoup4` for extracting information from HTML

#-------------------#
#-- Route Methods --#
#-------------------#
def index(request):
    """Loads homepage (index.html)."""

    return render(request, "crawler/index.html")

def crawl(request):
    """Crawls user provided URL and returns JSON data."""

    # Check if method is `POST`:
    if request.method == "POST":

        # Validation:
        # If no data is provided:
        if not (request.POST.get('url')):
            return JsonResponse({'message': "Web address required."})

        # Note: `request.POST.get('url')` is the URL from form submission:
        print "Crawling: {} ....".format(request.POST.get('url'))

        # Use `BeautifulSoup` to parse all HTML for our given web address:
        soup = BeautifulSoup(urlopen(request.POST.get('url')), "html.parser")

        # Dictionary object to hold crawled data:
        crawled_data = {
            "url" : request.POST.get('url'), # url requested to crawl
            "html" : soup.prettify(), # `soup` object prettified
            "hrefs" : __make_url_dict(soup), # dictionary of urls and occurrences - see `__make_url_dict()` method below
        }

        # Return JSON data with crawled data (HTML and URL Dictionary):
        return JsonResponse(crawled_data)

    else:
        # Flash Error Message
        messages.error(request, 'Request not accepted.')
        return redirect('/')

def __make_url_dict(soup_data):
    """Makes dictionary of each URL along with a count of how often it occurs in the HTML document.

    Parameters:
    -`soup_data`: This is a `beautifulsoup4` object, normally should be the returned object from the `crawl()` method.
    """

    # Create empty dictionary file which will hold URLs and a count for how often each occur:
    url_dict = {}

    print "Extracting `href` tags and counting occurrences from crawled website data..."

    # Loop through each `<a>` tag inside of `soup_data` object:
    for i in range(len(soup_data('a'))):
        # If the URL already exists in our dictionary, increase its count:
        if url_dict.has_key(soup_data('a')[i]['href']):
            # Increase the value (which is a count) by `1`:
            url_dict[soup_data('a')[i]['href']] += 1
        # Otherwise, set the URL to the dictionary key and set the count to `1`:
        else:
            url_dict[soup_data('a')[i]['href']] = 1

    print "Extraction complete."

    # Return the new URL dictionary:
    return url_dict
