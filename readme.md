# AJAX Web Crawler

This program crawls any user entered URL and supplies the raw HTML and a list of all `hrefs` within the website provided. The data provided written to the DOM via AJAX.

## Technologies:

- Django (for MTV app)
- BeautifulSoup4 (for crawling)
- jQuery

### Bugs:
+ Certain domains are not working (`sohumhealing.com`), and there may be an issue
with the secondary filtering of `hrefs`. Further testing with different URLs is required to pinpoint this issue.
