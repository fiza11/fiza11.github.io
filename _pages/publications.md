---
layout: page
permalink: /publications/
title: publications
description: Peer-reviewed work in speech recognition, cloud systems, and privacy-preserving machine learning.
years: [2026, 2024, 2022]
nav: true
nav_order: 4
---

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}

  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>

<h2 class="year">Patents</h2>

<div class="publications">
  <ol class="bibliography">
    <li>
      <div class="pub-title">Monitor class recommendation framework</div>
      <div class="periodical">United States patent application 18/593,338, 2025</div>
      <div class="author">Anjaly Parayil, Ayush Choure, Chetan Bansal, Saravan Rajmohan, Pooja Srinivas, <em>Fiza Husain</em></div>
    </li>
  </ol>
</div>
