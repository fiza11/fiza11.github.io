---
layout: about
title: about
permalink: /
subtitle: Founding Machine Learning Engineer

profile:
  align: right
  image: profile_pic.jpeg
  image_circular: false
  more_info:

news: false
selected_papers: true
social: true
---

I build machine learning systems end to end — data, models, serving, and the
evaluation that proves they work. Most of what I do sits between research and
production: reading the literature and running the experiments, then owning the
result once it's live and real users are hitting it. I've found the two halves
are hard to separate, and that the interesting problems tend to appear where they
meet.

Right now that means **multimodal models**. I'm the founding machine learning
engineer at [Stimuler](https://www.stimuler.tech/), where I own the speech stack
behind a conversational English-fluency platform — fine-tuning audio language
models for recognition and speech-to-speech, and serving them fast enough to hold
a real conversation. The users are non-native English speakers across India,
Indonesia, and Latin America, which makes almost every published benchmark a poor
guide; accented, conversational, noisy speech is exactly the regime where
general-purpose models quietly fall apart.

Before this I was a Research Fellow at
[Microsoft M365 Research](https://www.microsoft.com/en-us/research/group/m365-research/),
working on **AIOps** — applying foundation models to incident management and to
the [Intelligent Monitoring](https://www.microsoft.com/en-us/research/blog/intelligent-monitoring-towards-ai-assisted-monitoring-for-cloud-services/)
problem for large cloud services, using operational telemetry at a scale that
made most conventional approaches fall over. That work appeared at FSE and ICSE.
Earlier still, at [IIIT Hyderabad](https://www.iiit.ac.in/), I worked with
Prof. [Praveen Paruchuri](https://sites.google.com/view/praveen-paruchuri/) and
Prof. [Sujit Gujar](https://www.sujitgujar.com/) on privacy in **deep
reinforcement learning**, published at AAAI. Five peer-reviewed papers, two as
first author, and a patent.

The thread through all of it is measurement. It is usually harder than the
modelling, and it is where I have been most wrong. A model that scores well on
the metric everyone reports can be useless for the thing you're actually
building, and finding that out early is most of the job.

Outside of tech I draw and paint, and I remain devoted to cats and to
mathematics.

<h2 class="fh-section"><a href="{{ '/work/' | relative_url }}">selected work</a></h2>

<div class="projects">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-2">
  {% for project in sorted_projects %}
    {% include projects.liquid %}
  {% endfor %}
  </div>
</div>
