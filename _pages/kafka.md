---
title: "Kafka"
layout: archive
permalink: /kafka
author_profile: true
# sidebar:
#     nav: "sidebar-category"
---
{% assign posts = site.categories['kafka']%}
{% for post in posts %}
  {% include archive-single.html type=page.entries_layout %}
{% endfor %}