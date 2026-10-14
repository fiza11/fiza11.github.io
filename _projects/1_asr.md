---
layout: page
title: Teaching ASR to keep the words that matter
description: Entity- and disfluency-aware speech recognition for accented conversational English. INTERSPEECH 2026.
importance: 1
category: work
---

Word error rate quietly rewards a transcriber for discarding exactly what a
language tutor needs. If a learner says _"I went to Yogyakarta with Rina,"_ a
system that returns _"I went to Jakarta with Rena"_ barely moves its WER — two
short words out of seven — while getting wrong the only two things the sentence
was about. The same is true in the other direction: every production ASR system
strips _um_, _uh_, and false starts by design, and those are precisely the signal
a fluency assessment is computed from.

This was the problem behind the paper at **INTERSPEECH 2026**,
[_Beyond WER: Entity and Disfluency Recall in Accented Conversational ASR_](https://arxiv.org/abs/2609.20828). The argument is that WER is the wrong optimisation
target for a language-learning product, that entity recall and filler recall
should be measured directly, and that doing so changes which model you would pick.

## The pipeline

{% include figures/asr-pipeline.html %}

**Curating entity-rich data with SQL rather than annotators.** Only 24–28% of
real learner utterances contain a proper noun, so random sampling produces
training data that is mostly entity-free — you pay for annotation and buy very
little of what you need. Instead I wrote lexical filters that run in the data
warehouse before anything is labelled, keeping utterances of four or more words
that contain consecutive capitalised words, acronyms, honorifics, or
mid-sentence capitalisation. The filtered pool runs at 70–78% entity density,
roughly **2.8× enrichment**, which cut annotation effort by about 65%.

**Regional adapters rather than one model.** India, Indonesia, and Latin America
fail differently, so each got its own LoRA adapter on Qwen2.5-Omni-3B — rank 32,
attention projections only, base weights frozen, two epochs on 9k utterances.
About six hours per adapter on a single A100.

**Two transcripts from one forward pass.** Each inference returns structured
JSON containing both a verbatim transcript, which preserves fillers,
accent-influenced pronunciations, and false starts, and a corrected one. A
boolean `comprehensible` flag gates the output, so genuinely degraded audio
returns empty strings instead of a confident hallucination. Every metric below is
computed on the harder verbatim transcript.

**A judge to diagnose the errors.** A six-category error taxonomy — phonetic
substitution, named-entity error, gibberish, hallucination, omission,
non-actionable audio — scored by an LLM. I benchmarked eighteen candidate judge
models against 210 human labels before selecting one at 83.8% exact agreement.

## Results

{% include figures/asr-recall.html %}

| Region    | Model                     | WER       | Entity recall | Filler recall |
| --------- | ------------------------- | --------- | ------------- | ------------- |
| India     | Prior production baseline | 13.01     | 53.59         | 0.37          |
|           | Whisper                   | 9.63      | 78.59         | 1.63          |
|           | **Ours**                  | **5.95**  | **79.52**     | **76.79**     |
| Indonesia | Prior production baseline | 18.18     | 55.23         | 4.15          |
|           | Whisper                   | 12.70     | 79.16         | 7.12          |
|           | **Ours**                  | **7.36**  | **84.60**     | **85.68**     |
| LatAm     | Prior production baseline | 21.12     | 54.31         | 1.18          |
|           | Whisper                   | 16.44     | 76.92         | 2.66          |
|           | **Ours**                  | **10.00** | **81.87**     | **76.47**     |

Entity recall moved from 53–55% to 80–85%, filler recall from under 5% to
76–86%, and WER fell by 53–60% relative to the prior baseline. The fine-tuned 3B
model matches or beats a zero-shot 30B model on entity recall with **ten times
fewer parameters**, and serves at around 800ms P95 against roughly 16.5 seconds
for a commercial API.

The result I find most interesting is the ablation. Training an otherwise
identical adapter on randomly sampled data isolates what the curation stage was
worth on its own: paired bootstrap tests over 10,000 iterations attribute
+4.19pp, +2.84pp, and +2.76pp of entity recall to curation alone, all at
p&lt;0.0001. A day of writing SQL was worth more than most of the modelling.

## Around the paper

The paper reports the final pipeline. The experiments that led to it, and some
that followed, had findings of their own.

- **Backbone.** Qwen2.5-Omni beat Gemma-3n in every region (India 8.99% vs
  9.71% WER, Indonesia 11.88% vs 13.21%, LatAm 13.01% vs 24.00%). The same
  runs showed that segmenting audio with a voice-activity detector before
  recognition hurts (LatAm 13.01% → 14.19%). A later study on 919 Indonesian
  samples found out why: the detector placed the start of speech within 100ms
  81% of the time, but the end only 44% of the time. Endpointing is where the
  losses are.
- **Region-specific adapters beat one mixed model** by about one point of WER
  in every region. **LoRA rank barely matters** (r=16: 7.97%, r=64: 7.99%), so
  I stopped spending compute on it. Giving the model what the tutor had just
  said as context produced the best India result, 7.49%.
- **Size.** Across all regions, fine-tuned 3B and 7B models (WER 7.83% and
  7.14%, entity F1 0.75 and 0.77) both beat a zero-shot 30B model (11.63%,
  0.56). The 30B model also barely used the confidence tags the transcripts
  carry, however it was prompted.
- **Over-correction.** The corrected transcript is supposed to fix only what
  the _recogniser_ got wrong, and leave the _learner's_ mistakes alone, because
  those are what the tutor gives feedback on. Suppose a learner says _"Yesterday
  I go to the beach with my sister."_ The right corrected transcript keeps
  _"I go"_. An over-corrected one returns _"Yesterday I went to the beach with
  my sister,"_ and the tutor has nothing left to correct. The model was doing
  this kind of rewriting in about a third of outputs. Preference tuning (DPO)
  on about 2,500 pairs, each contrasting a faithful correction with an
  over-eager one, cut the over-correction rate from 18.6% to 9.9% and raised
  good corrections from 62.9% to 72.3%, on 1,824 judged samples. That version
  runs in production.

## What I would flag about it

The test-set references are silver-standard — generated by a large multimodal
model, with only 250 utterances per region human-verified. A gap remains against
the 30B model on filler recall specifically. And the evaluation is English-only,
which leaves code-switching, constant in all three of these markets, entirely to
future work.
