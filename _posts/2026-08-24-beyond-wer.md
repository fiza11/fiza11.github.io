---
layout: post
title: Why word error rate is the wrong target
description: Two systems with the same WER can differ completely in usefulness
date: 2026-08-24
---

A learner says *"I went to Yogyakarta with Rina."* The transcriber returns
*"I went to Jakarta with Rena."*

Two words wrong out of seven, so the word error rate is about 0.29 — unremarkable
for accented conversational speech, the kind of number you would see and move on
from. But the sentence has lost the only two things it was about. Every noun that
carried information is gone, and what remains is a grammatically clean sentence
that means something else.

Now consider the opposite failure. The same system transcribes *"I, um, I went
to— I went to Yogyakarta"* as *"I went to Yogyakarta."* WER improves. If you are
building fluency feedback, you have just deleted your entire signal.

Both of these are invisible to the metric everyone reports.

## The problem is in the construction

WER is an edit distance between hypothesis and reference, normalised by reference
length. Insertions, deletions, and substitutions each cost one, and every word is
worth the same.

That last property is the whole difficulty. It is not a bug in any particular
implementation, it is the definition, and it encodes an assumption that is
plainly false: that all words in an utterance carry comparable information.

They do not, and the mismatch is systematic rather than random. Named entities
are rare, high-information, and disproportionately likely to be misrecognised —
they are out-of-vocabulary or near enough, they are frequently non-English in
regions where speakers code-switch by default, and a language model prior will
happily replace an unfamiliar name with a familiar one. *Yogyakarta* becomes
*Jakarta* precisely because the model knows *Jakarta* better. The substitution is
confident, fluent, and wrong, and it costs the same as dropping an article.

Disfluencies fail in the other direction. Most production ASR removes them
deliberately, and for most applications that is correct — nobody wants *um* in a
meeting transcript. But a system that scores speaking fluency is measuring
hesitation, and hesitation is exactly what the cleanup step throws away. The
system is optimised to destroy its own input.

## What the rankings actually look like

Here is the part I found genuinely surprising when we measured it. If WER
correlated well enough with usefulness, none of this would matter much in
practice. It does not.

On our India test set, Whisper posts 9.63% WER and recovers 78.59% of named
entities. A zero-shot 30B multimodal model posts **7.13%** WER — clearly better —
and recovers **76.60%** of entities, clearly worse. Pick your model on WER and
you take the one that loses more of the words your product exists to hear.

Filler recall separates them further. A strong commercial API reaches 7.22% WER
on the same set while recovering 25.37% of filled pauses. The 30B model, with
worse WER, recovers 91.27%. If you are building fluency assessment those two
systems are not close, and WER puts them within half a point of each other.

## Measure the thing directly

The fix is not clever. Once you accept that WER is a lossy summary, you measure
the specific things it loses.

**Entity recall** — of the named entities in the reference, what fraction appear
in the hypothesis. You need entity annotations on your test set, which is real
work, and it is the single highest-leverage evaluation investment I have made.

**Filler recall** — of the filled pauses in the reference, what fraction survive.
Cheap, since fillers come from a small closed set.

Report both alongside WER rather than instead of it. WER remains a decent
aggregate health check; it tells you when something has broken badly. It just
should not be the number you optimise.

For us the gap between the two views was large. Our fine-tuned models reach
80–85% entity recall against a prior production baseline at 53–55%, and 76–86%
filler recall against under 5%. On WER alone the improvement looks respectable.
On the metrics that matter it is the difference between a product that works and
one that does not.

## The general version

Every metric is a compression of the thing you care about, and every compression
has a kernel — the set of differences it maps to zero. WER's kernel contains
"which words were wrong," and for a language tutor that is most of the signal.

So the question worth asking of any metric you have inherited is not whether it
is well-defined or widely used. It is: *what can change a lot without moving this
number?* Then go and look at whether those things matter to you. In our case the
answer was sitting in the first ten transcripts I read by hand, and no amount of
staring at the aggregate would have surfaced it.

---

This is drawn from our INTERSPEECH 2026 paper, *Beyond WER: Entity and
Disfluency Recall in Accented Conversational ASR*, with Ankit Pandey and Yash
Singh. The [paper]({{ '/assets/pdf/husain2026-beyond-wer-interspeech.pdf' | relative_url }})
has the full tables across all three regions.
