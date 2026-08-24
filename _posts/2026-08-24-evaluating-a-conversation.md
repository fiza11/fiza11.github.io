---
layout: post
title: How do you evaluate a conversation?
description: What to measure when there is no reference to compare against
date: 2026-08-24
---

Speech recognition is comfortable to evaluate. There is a thing the person said,
there is a thing the model wrote down, and you compare them. The metric may be
[the wrong one]({{ '/blog/2026/beyond-wer/' | relative_url }}), but at least the
shape of the problem is clear.

Speech-to-speech breaks that. Ask a model to hold a conversation and there is no
reference — no single correct reply that you can diff against. Two completely
different responses can both be excellent, and a response that is word-for-word
plausible can still be the wrong thing to say. Word error rate does not apply.
Perplexity is measuring the wrong object. And latency, which is the metric
everyone reaches for because it is the easiest one to collect, is necessary and
nowhere near sufficient: a fast, fluent, irrelevant reply is still a failed turn.

So the first thing I do is refuse to produce a single number.

## Three axes that fail independently

The reason a single score is a bad idea is not aesthetic. It is that these
systems fail in ways that are close to uncorrelated, and averaging uncorrelated
failures destroys exactly the information you need to fix them.

**Did it understand?** This is the only part that resembles a recognition
problem, and it is worth isolating precisely because of what it tells you about
where to work. A model that mishears is a different engineering problem from a
model that hears correctly and reasons badly — different component, different
data, different fix.

That distinction is easier to state than to make, and getting it wrong is
expensive. It is very natural to hear a bad response, assume the audio front end
garbled the input, and go spend a month on the recogniser. The check is cheap:
look at what the model actually received, in text, and ask whether a competent
human reading only that would have replied better. If yes, your problem is
downstream and the audio was never the issue. I would run that check before
touching either component, every time.

**Was the reply worth making?** Relevance, whether it engaged with what the user
actually said, whether it moved the conversation somewhere. This is where an LLM
judge earns its keep, because the thing you are assessing is semantic and there
is no string to match against.

**Did it sound like something a person wants to keep talking to?** Naturalness,
prosody, warmth. This is substantially orthogonal to the other two — a model can
be perfectly correct and unpleasant to listen to, and it will lose the user just
as reliably as being wrong. It is also the axis most likely to be quietly
sacrificed, because it is the hardest to put a number on.

## Two failure modes worth knowing about in advance

**Training loss and perceived quality can move in opposite directions.** In
speech generation this is not a rare pathology; it is close to the default. The
training objective is teacher-forced and measures something adjacent to what you
want, so a model can improve steadily on the loss while getting worse at the
task. If the loss curve is your only instrument, you will ship the regression and
feel good about it. I now treat a training-side improvement as a hypothesis, not
a result, until something perceptual confirms it.

**Frozen components constrain the ones you adapt.** A common and sensible
architecture for these systems is to fine-tune the part that reasons and leave
the part that produces audio frozen — it is far cheaper, and the frozen half is
usually the part you have no good data for. The catch is that the two halves meet
at an interface, and adapting one of them moves it relative to that interface.
Push far enough and the audio degrades even though nothing about the audio
component changed.

What makes this genuinely hard to diagnose is that neither component looks broken
on its own. The adapted half evaluates well on text. The frozen half was never
touched and is bit-identical to the version that worked. Only the composition
fails. The practical consequence is that how strongly you apply an adaptation
becomes a parameter you have to tune against end-to-end quality, rather than an
implementation detail you set once — and that you cannot catch any of this
without an evaluation that exercises the whole path.

## Rubrics are specifications

If you use an LLM judge for the second axis, the rubric is the part that
determines whether you get a signal or noise, and it is the part everyone
underinvests in.

"Rate warmth 1 to 5" is not a rubric. It is a prompt that will produce numbers,
and those numbers will drift every time you touch the surrounding text, because
nothing anchors them. A rubric is what each point on the scale means, with an
example of each. Writing that is tedious and unglamorous and takes an afternoon,
and it is the difference between a metric you can make decisions with and one
that merely looks like data.

A useful test before you trust any rubric: give the same exchange to two people
and see whether they land on the same score. If they do not, the model has no
chance, and the disagreement is telling you which part of the rubric is
underspecified.

## Where this leaves you

You end up with three numbers instead of one, and people will ask you to
collapse them. Resist that for as long as you can. The three-number version tells
you what to do next; the average tells you only whether today was better than
yesterday, and usually not even that.

The broader point is one I keep relearning. When a metric does not exist for what
you care about, the temptation is to use the metric that does exist and quietly
redefine the goal to match it. That is how you end up optimising word error rate
on a system whose job is to have a conversation.

---

Related: [why word error rate is the wrong target]({{ '/blog/2026/beyond-wer/' | relative_url }}),
and [building an LLM judge you can actually trust]({{ '/work/4_judge/' | relative_url }})
on validating the judge doing the scoring.
