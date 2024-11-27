---
title: "Tree"
layout: archive
permalink: /tree
author_profile: true
sidebar:
    nav: "sidebar-category"
---
{% assign posts = site.categories['tree']%}
{% for post in posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}