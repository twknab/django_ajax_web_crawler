"""crawler application URL Configuration

URL patterns related to `crawler.`

Current Routes for this Application:
- `/` - delivers index.html homepage.
- `/crawl` - crawls page and returns JSON data.
"""
from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.index), # delivers homepage (index.html)
    url(r'^crawl$', views.crawl), # crawls webpage and returns JSON
]
