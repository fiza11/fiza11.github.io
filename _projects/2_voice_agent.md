---
layout: page
title: How I evaluate a voice agent
description: What to measure in a speech-to-speech system when there is no reference transcript to compare against.
importance: 2
category: work
---

Speech-to-speech systems break the measurement tools that speech recognition
gave us. There is no reference transcript for a conversation, because there is no
single right thing the model should have said. Word error rate does not apply.
Latency is necessary and nowhere near sufficient — a fast, fluent, irrelevant
reply is still a failed turn.

So the first thing I do is refuse to compress it into one score.

## Three axes that fail independently

**Did it understand?** This is the only part that resembles a recognition
problem, and it is worth isolating, because a model that mishears is fixable in
ways a model that misunderstands is not. Keeping them separate matters more than
it sounds: teams routinely attribute comprehension failures to the audio front
end and spend months on the wrong component. Establishing which one you actually
have is cheap, and I would do it before touching either.

**Was the reply worth making?** Relevance, whether it moved the conversation
somewhere, whether it respected what the user actually said. This is where an
LLM judge earns its keep, and where a rubric has to be specific enough that two
people scoring the same exchange agree.

**Did it sound like something a person wants to keep talking to?** Naturalness,
warmth, and prosody. Largely orthogonal to the first two — a model can be
perfectly correct and unpleasant to listen to, and that will lose the user just
as reliably as being wrong.

## Two things I have learned to watch for

**Training loss and perceived quality can move in opposite directions.** In
speech generation this is not a rare pathology, it is the default failure mode.
Teacher-forced objectives measure something adjacent to what you want, and a
model can improve steadily on the objective while getting worse at the task. If
your only instrument is the loss curve, you will ship the regression. I now
require a perceptual read before believing any training-side improvement.

**Frozen components constrain the ones you adapt.** In architectures where you
fine-tune part of the model and leave another part frozen — common with omni
models, where adapting the reasoning half while leaving the vocoder alone is far
cheaper than training everything — the frozen half sets a boundary on how far the
adapted half can travel before their interface breaks. What makes this hard is
that neither component looks broken in isolation. The adapted half evaluates
well on text, the frozen half was never touched, and the audio comes out wrong
anyway. You have to measure end to end, and the strength at which you merge the
adaptation becomes a real parameter to tune rather than an implementation detail.

## On rubrics

A judge rubric is a specification, and vague specifications produce noisy scores.
"Rate warmth 1–5" is not a rubric. What each point on the scale means, with an
example, is a rubric. The effort is front-loaded and dull, and it is the
difference between a number you can act on and a number that drifts every time
you change the prompt.
