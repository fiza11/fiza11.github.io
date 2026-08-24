---
layout: page
title: Building an LLM judge you can actually trust
description: Validating automated evaluation against human labels, and what to do when they disagree.
importance: 4
category: work
---

An LLM judge is the only practical way to evaluate conversational quality at any
scale — you cannot listen to everything, and the thing you care about is not
measurable by string comparison. But a judge is itself a model with its own
failure modes, and an unvalidated one is worse than no metric at all, because it
looks like data.

## Spend the effort on the disagreements

The usual validation is an agreement rate against human labels. That number is
worth having and is not where the value is. What matters is the sample where the
judge and the humans disagree, read case by case.

This has repeatedly been the most informative work I have done on evaluation,
because a disagreement has three possible causes and they need different
responses. The judge may be wrong, which means fixing the rubric. The rubric may
be ambiguous, meaning both parties were right under different readings. Or the
humans may be wrong.

That third case is more common than people expect, and it is usually not about
the annotators. More than once I have traced disagreements to a labelling
interface that was not showing annotators context the judge could see. The
humans were reasoning correctly from less information. The agreement rate was
measuring the interface.

The generalisable version: **if your annotators cannot see what the model sees,
your ground truth is measuring your tooling.** It is worth auditing the labelling
interface before concluding anything about either the judge or the labellers.

## Judges earn the right to decide

Until a judge has been through that audit, it explains rather than decides. It
tells you *why* something is failing and which failure modes dominate; it does
not get to gate a release or settle an A/B test.

This distinction is easy to lose. A judge that produces plausible numbers gets
treated as measurement very quickly, and teams start optimising against it. If it
has a systematic bias — over-flagging a category, being lenient about a failure
mode — you will optimise straight into that bias and see your metric improve
while the product does not.

## Practical notes

Report per-category performance, not just an overall rate. A judge is rarely
uniformly good; mine have tended to be strongest on concrete factual errors and
weakest at distinguishing genuine problems from acceptable variation. Knowing
which categories are reliable tells you which conclusions you can lean on.

Keep a small gold set that never changes, so you can tell judge drift from real
movement in the system. And when you compare candidate judges, compare them on
your data — public benchmark rankings have not predicted which model would do
well on a specific rubric in my experience, and the gap between candidates on a
narrow task is often large enough to be worth an afternoon of measurement.
