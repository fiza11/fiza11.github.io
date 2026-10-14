---
layout: page
title: work
permalink: /work/
description: Research on speech models in production — what I tested, what held up, and what didn't.
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
