---
layout: about
title: about
permalink: /
subtitle: Machine learning engineer · multimodal models, post-training & evaluation

profile:
  align: right
  image: profile_pic.jpeg
  image_circular: false
  more_info:

news: false
selected_papers: true
social: true
---

I'm a machine learning engineer who likes the whole loop: choosing the right
question, training and adapting models to answer it, building evaluations honest
enough to say when they haven't, and then running the result in front of real
users. The problems I find most interesting are in **multimodal and language
models**, especially speech and audio, in **post-training** (fine-tuning,
preference optimisation, adapting large models to narrow domains), and in
**measurement**: LLM judges, metrics and experiments you can actually trust. In
my experience, the number everyone optimises is often not the thing that
matters. Finding that out early is most of the job.

Since June 2025 I've been the Founding ML Engineer at
[Stimuler](https://www.stimuler.tech/), a conversational English-fluency
platform for learners around the world, where I own the speech models end to
end. My first-author **INTERSPEECH 2026** paper,
[_Beyond WER_](https://www.isca-archive.org/interspeech_2026/husain26_interspeech.pdf),
came out of that work: it shows that entity and filler recall, not word error
rate, should decide which ASR model a language-learning product uses. I also led
the research behind Stimuler's [voice tutor]({{ '/work/2_voice_agent/' | relative_url }}),
comparing full-duplex, cascaded and omni speech-to-speech models before
shipping it on Qwen3-Omni at under 600ms to first audio. Before that I was a
Research Fellow at
[Microsoft M365 Research](https://www.microsoft.com/en-us/research/group/m365-research/),
applying foundation models to incident management and
[intelligent monitoring](https://www.microsoft.com/en-us/research/blog/intelligent-monitoring-towards-ai-assisted-monitoring-for-cloud-services/)
for large cloud services. That work led to papers at
[FSE 2026](https://dl.acm.org/doi/10.1145/3803437.3805243) (first author),
[FSE 2024](https://dl.acm.org/doi/10.1145/3663529.3663861) and
[ICSE 2024](https://dl.acm.org/doi/10.1145/3639477.3639753), and a
[patent](https://patents.google.com/patent/US20250200432A1/en). Earlier, at
[IIIT Hyderabad](https://www.iiit.ac.in/), I worked with Prof.
[Praveen Paruchuri](https://sites.google.com/view/praveen-paruchuri/) and Prof.
[Sujit Gujar](https://www.sujitgujar.com/) on privacy in deep reinforcement
learning, published at [AAAI 2022](https://ojs.aaai.org/index.php/AAAI/article/view/20772).
Alongside that, at [OpenMined](https://openmined.org/), I added differential
privacy support to the PySyft library and fixed vulnerabilities in it.

When I'm not working, I'm usually drawing or painting, cooking, finding new
places to eat, working through a maths problem for no reason at all, or
chasing after a cat.

<h2 class="fh-section"><a href="/work/">selected work</a></h2>

<div class="projects">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-2">
  {% for project in sorted_projects %}
    {% include projects.liquid %}
  {% endfor %}
  </div>
</div>
