---
layout: page
title: work
permalink: /work/
description: Speech systems I've built, and how I approach the problems they raise.
nav: true
nav_order: 2
horizontal: false
---

<div class="projects">
{% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-2">
  {% for project in sorted_projects %}
    {% include projects.liquid %}
  {% endfor %}
  </div>
</div>
