---
layout: page
title: Building an LLM judge you can actually trust
description: Validating automated evaluation against human labels, and what to do when they disagree.
importance: 3
category: work
---

An _LLM judge_ is a language model you ask to grade another model's output
against a rubric. "Did this support reply answer the customer's question?" "Is
this summary faithful to the article?" "Did the tutor understand what the
learner said?" For anything conversational it is the only practical way to
evaluate at scale: you cannot read or listen to everything, and the quality you
care about can't be measured by comparing strings.

But a judge is itself a model, with its own failure modes. An unvalidated one is
worse than no metric at all, because it looks like data.

## Spend the effort on the disagreements

The usual validation is to have people label a sample, have the judge label the
same sample, and report the agreement rate. That number is worth having, but it
is not where the value is. The value is in the cases where the judge and the
humans disagree, read one by one.

Every disagreement has one of three causes, and each needs a different fix.

{% include figures/judge-triage.html %}

**The judge is wrong.** Say your rubric tells the judge to penalise made-up
facts, and it flags a support reply that quotes your actual refund window as a
hallucination, because it has never seen your refund policy. The fix is in the
judge: give it the reference material, or tighten the instruction.

**The rubric is ambiguous.** Ask "Is this reply concise?" and one person reads
it as _short_, while the judge reads it as _no wasted words_. A four-sentence
answer with no padding then gets a 2 from one and a 5 from the other. Both are
right under their reading. The fix is in the rubric: say what each point on the
scale means, with an example of each. "Rate warmth from 1 to 5" is not a rubric.

**The humans are wrong.** This is more common than people expect, and it is
usually the labelling tool's fault, not the labellers'. Imagine a support bot
that says _"As I mentioned, your refund went through on Tuesday."_ If the
labelling screen shows only the last exchange, a careful labeller marks that as
invented. The judge, which saw the whole conversation, marks it correct. The
labeller was reasoning well from less information.

That third case is exactly what happened with the judge that scores our voice
tutor's calls. Its first validation showed only 72% agreement with human labels,
which would normally send you back to rewrite the rubric. Reading the
disagreements showed most of them were labelling errors: the judge could see the
conversational memory the tutor was working from, and the labelling interface
wasn't showing it. Once it did, agreement rose to 92% on held-out data and 99%
(127 of 128) on a fixed gold set, without changing the judge at all.

The general lesson: **if your annotators cannot see what the model sees, your
ground truth is measuring your tooling.** Audit the labelling interface before
concluding anything about the judge or the labellers.

## Judges earn the right to decide

There are two jobs you can give a judge, and they need very different levels of
trust.

The first is to **explain**. You run the judge over a week of conversations and
it tells you that most failures are the bot ignoring the user's actual question,
and few are factual errors. Even if its numbers are a bit off, that tells you
where to look, and you will check by reading examples anyway.

The second is to **decide**: to gate a release, or settle an A/B test. Here
nobody reads the examples. The number _is_ the outcome, so any bias in the
judge flows straight into your product.

A well-documented case is _verbosity bias_. LLM judges tend to prefer
[longer answers](https://arxiv.org/abs/2306.05685), whether or not they are
better. Suppose a team lets such a judge pick between prompt variants. Each
round, the longer, more padded variant wins. The judge score rises steadily, and
users get replies that are harder to read. The same happens with a judge that
over-flags one failure type: you spend a quarter fixing a problem that was
mostly the judge's.

So until a judge has been audited, it only explains. Decisions rest on things
users do voluntarily and at some cost to themselves: coming back the next day,
staying in the conversation, rating a reply. These are things your own tooling
can't quietly change. The judge tells you _why_ those moved.

## Practical notes

**Report performance per category, not just overall.** A judge that is 90%
accurate overall might be 98% on factual errors and 60% on tone. Then you can
lean on its factual-error counts and should ignore its tone scores. Mine have
tended to be strongest on concrete, checkable errors and weakest at telling a
real problem from acceptable variation.

**Keep a small gold set that never changes.** Re-score it whenever you touch the
judge's prompt or model. If the gold-set score moves, the judge changed. If it
holds while production scores move, the system changed.

**Pick the judge model on your own data.** For the ASR error taxonomy in our
[INTERSPEECH paper]({{ '/work/1_asr/' | relative_url }}), I tested eighteen
candidate judge models against 210 human labels. The best reached 83.8% exact
agreement, up from 75.4% for our first setup. Public leaderboard rankings did
not predict which would win, and on a narrow task the gap between candidates
was large enough to be worth an afternoon of measurement.

**Read what the judge finds, not just its score.** The same ASR judge reported
that 68–70% of errors were "omissions": words the speaker said that never made
it into the transcript. That looked like a model problem. It was a
post-processing step deleting low-confidence words before anyone saw them,
including food, cultural, and code-switched terms that a learner would most want
recognised.
