---
layout: post
title: Curating training data with SQL, not annotators
description: Buying entity density cheaply, before you spend the labelling budget
date: 2026-08-24
---

We needed a speech recognition model that could hold on to names — of people,
places, dishes, bands. The obvious plan was to sample production audio, have it
transcribed carefully, and fine-tune on the result.

Then we counted. Only **24–28%** of real learner utterances contain a proper noun
at all.

So the obvious plan spends roughly three quarters of its annotation budget on
audio that cannot teach the model the thing we care about. The data is not bad —
it is perfectly good speech, and it will improve general transcription. It just
contains almost none of the phenomenon we are targeting. You could double the
budget and still be mostly paying for sentences with no names in them.

## Filter before you label, not after

The move is to spend a cheap signal to avoid spending an expensive one. We
already had a large corpus of existing production transcripts sitting in the
warehouse — imperfect, machine-generated, but free. Imperfect text is more than
good enough to *decide what to annotate*, even when it is not good enough to
train on.

So the curation runs as SQL, before anything is sent for careful transcription.
Keep an utterance of four or more words if it contains any of:

- **Consecutive capitalised words** — *Taylor Swift*, *New Delhi*
- **Acronyms**, two or more uppercase letters — *UNESCO*, *BTS*
- **Honorifics and titles** — *Mr*, *Dr*, *Prof*, *President*
- **Mid-sentence capitalisation**, which catches most single-token names

These are crude. They are also almost free to run, and they need to be crude,
because the input is machine-generated text with its own errors.

The filtered pool comes out at **70–78% entity density**, against 24–28% for
random sampling. Call it **2.8× enrichment**, which translates to roughly **65%
less annotation** for the same number of entity-bearing examples.

## The objection, which is correct

You have deliberately skewed your training distribution away from reality. Your
model now sees far more names per utterance than the world contains.

Yes. That is the point — it is oversampling of hard cases, the same logic as hard
negative mining, and it is a legitimate technique. But it does impose one
discipline that is easy to get wrong: **evaluate on the natural distribution, not
the filtered one.**

If you build your test set with the same filters, your numbers will be beautiful
and meaningless, because you will have measured performance on the world you
constructed. We held out evaluation sets drawn without the heuristics, so
training oversamples entities and evaluation does not. This is the part I would
check first in anyone else's curation pipeline, my own included.

The second thing to watch is what the heuristics systematically miss.
Capitalisation-based rules are biased toward entities that a transcriber already
capitalised, which means they under-select exactly the unfamiliar regional names
that get lowercased because the upstream system did not recognise them either.
That bias points the wrong way — the hardest cases are the least likely to be
selected. We partly compensated by mining error analysis for entities the models
were failing on, and feeding those back into curation, but it is a real
limitation rather than one I would wave away.

## Did it actually work?

This is where it would be easy to declare victory. The models trained on curated
data were better, and it would be tempting to attribute that to the curation.

But the curated run differed from our earlier runs in more than one way, and by
that point we had also changed the prompt format, the checkpoint selection, and
the reference transcripts. Any of those could account for the gain.

So we isolated it: train an otherwise identical adapter on randomly sampled data
of the same size, same hyperparameters, same everything, and compare. Then paired
bootstrap over 10,000 resamples for confidence intervals, because a couple of
points of difference on a few thousand utterances is exactly the regime where
eyeballing fails.

Curation alone accounts for **+4.19pp** entity recall on India, **+2.84pp** on
Indonesia, and **+2.76pp** on Latin America, all at *p* < 0.0001 with confidence
intervals excluding zero.

Those are not huge numbers. They are, however, *real* numbers, and I would rather
have a small effect I can defend than a large one I cannot attribute. The
ablation cost one extra training run and it is the reason the claim survived peer
review.

## What generalises

Cheap lexical heuristics over data you already have are undervalued relative to
labelling more or reaching for a bigger model. The asymmetry is stark: an
afternoon of SQL against weeks of annotation spend.

The precondition is that the property you want correlates with something visible
on the surface. Named entities do — capitalisation is a genuine signal.
Sarcasm does not, and no regex is going to find it.

So the question to ask of any labelling budget is whether the thing you are
paying to teach the model appears often enough in a random sample to be worth the
sampling. If it does not, look for a cheap proxy that finds it, and check
afterwards how much the proxy was worth on its own.

---

This is drawn from our INTERSPEECH 2026 paper, *Beyond WER: Entity and
Disfluency Recall in Accented Conversational ASR*, with Ankit Pandey and Yash
Singh. See also [why WER is the wrong target]({{ '/blog/2026/beyond-wer/' | relative_url }}),
on what we measured instead.
