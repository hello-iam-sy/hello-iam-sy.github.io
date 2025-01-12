---
title: "Spark"
layout: archive
permalink: /spark/
author_profile: true
sidebar:
    nav: "sidebar-category"
---
{% assign posts = site.categories['spark']%}
{% for post in posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}