---
title: "linked_list"
layout: archive
permalink: /linked_list
author_profile: true
sidebar:
    nav: "sidebar-category"
---
{% assign posts = site.categories['linked_list']%}
{% for post in posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}