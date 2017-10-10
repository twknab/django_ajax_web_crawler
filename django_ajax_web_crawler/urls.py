"""django_ajax_web_crawler URL Configuration

Sets up URL patterns for applications related to `django_ajax_web_crawler.`

Current Applications in this Project:
- `crawler` - a Django powered web crawler with AJAX.
"""
from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('apps.crawler.urls')), # loads `apps/crawler` urls
]
