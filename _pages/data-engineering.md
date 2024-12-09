---
title: "Data Engineering"
layout: archive
permalink: /de/
author_profile: true
sidebar:
    nav: "sidebar-category"
---
{% assign posts = site.categories['de']%}
{% for post in posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}