---
layout: page
title: What actually improved a speech-to-speech tutor
description: Five architectures, a fine-tuning programme on Qwen3-Omni, and the finding that the largest gains came from outside the model.
importance: 2
category: work
---

Between February and September 2026 I led the research behind Stimuler's
speech-to-speech tutor, an always-available voice partner for English learners
calling from noisy phones. It had to do three things at once: understand heavily
accented speech, reply fast enough to feel like a conversation, and sound like
someone a learner would want to keep talking to. Every off-the-shelf model I
tried failed at least one of them.

This page covers the comparison that picked the architecture, what fine-tuning
bought, and the result that surprised me most: once the system was
live, the biggest quality gains came from fixing the pipeline around the model,
not the model.

## Five architectures

I built or benchmarked five approaches before committing to one.

{% include figures/s2s-architectures.html %}

In more detail:

| Approach                                                      | What I tested                                                                                                                                                           | Outcome                                                                                                                                                          |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full-duplex Moshi-style model (7B)                            | LoRA (r=128) on 1,154 hours of real learner calls                                                                                                                       | Rejected. The voice sounded robotic because of the 1.1 kbps Mimi codec, which no adapter can fix. Bolting on a separate TTS "mouth" broke duplex timing.         |
| Cascade: Whisper Large v3 → Llama 3.2 3B + LoRA → 3B TTS      | Seven duplex control tokens (_user is interrupting_, _user backchannel_, …) learned from 50K dialogues split into micro-turns, with loss up-weighted on turn boundaries | Worked as a proof of concept. Compute latency fell from 2.82s to 0.80s, but about 2.5s as heard, and three models to maintain.                                   |
| NVIDIA Nemotron VoiceChat (12B)                               | Benchmarked on 325 DailyTalk samples                                                                                                                                    | Best conversational style, but its duplex loop treated background noise, mic hum and its own output as user speech. Closed container, so it can't be fine-tuned. |
| Covo-Audio, MiniCPM-o-4.5                                     | One-day spikes                                                                                                                                                          | Below the quality bar.                                                                                                                                           |
| **Qwen3-Omni-30B-A3B** (MoE, 3B active), base + system prompt | Served with vLLM-Omni                                                                                                                                                   | **Shipped**, at under 600ms to first audio.                                                                                                                      |

On the DailyTalk benchmark, the base Qwen3-Omni model talked like an assistant
rather than a conversation partner: long replies that almost always asked a
question. Fine-tuning fixed the style, at a small cost in intelligibility.

| Metric (325 DailyTalk samples)       | Qwen3-Omni base | Qwen3-Omni fine-tuned | Nemotron VoiceChat |
| ------------------------------------ | --------------- | --------------------- | ------------------ |
| Words per response                   | 19.8            | 5.8                   | 10.7               |
| Question rate                        | 98.8%           | 9.2%                  | 11.4%              |
| WER of the spoken reply              | 7.63%           | 9.83%                 | 7.86%              |
| Style distance to human dialogue (↓) | 0.180           | 0.115                 | **0.099**          |

## What fine-tuning bought

I adapted only the Thinker, the part of Qwen3-Omni that decides what to say, and
left the Talker and the audio decoder frozen. Over seven rounds of data (4,693 to
13,877 examples) and a rank sweep at 8, 16 and 32, the best adapter improved an
LLM judge's overall score from 2.78 to 3.14, warmth from 3.74 to 3.95, and WER
of the spoken output from 3.5% to 2.1%.

## Where the gains actually came from

After launch, the largest improvement came from finding bugs in the pipeline
that fed the model, rather than from anything inside it. Together these fixes
cut severe comprehension failures by about two thirds.

{% include figures/s2s-fixes.html %}

- **The model was reading its own words.** Our first prompt A/B test (n=2,250)
  showed two very different prompts performing _identically_. That should not
  happen, so instead of picking a winner I went looking for why. Past learner
  turns were being stored as a placeholder that echoed the tutor's previous
  reply, so the model was rebuilding the conversation from its own side only.
  Fixing it halved severe comprehension failures on its own.
- **More context helped, up to a point.** Doubling history from 4 to 8 turns
  helped. Doubling again to 16 did nothing: about 95% of long-call failures
  happen in the moment, not because something was forgotten. That falsified
  the "long calls need more memory" hypothesis, so we reverted.
- **Interruptions evicted history.** About half of all turns are interrupted,
  and a turn store capped at 12 entries was silently evicting real context.
- **Connections reset mid-call.** About 5% of calls reconnected with an empty
  history. I traced it to a WebSocket library's 16-frame buffer stalling the
  keep-alive after a learner barged in. It never appeared in our analytics
  tables.
- **Background noise kept turns open.** Noise held the voice-activity detector
  above its deactivation threshold, so the learner's turn never closed and the
  call stalled. Adding noise cancellation in front of it raised real-speech turn
  commits from 49.7% to 89.3%.

## How I measured it

Speech-to-speech has no reference transcript, so word error rate doesn't apply,
and latency is necessary but nowhere near sufficient. I scored three axes that
fail independently: _did it understand_, _was the reply worth making_, and _does
it sound like someone you want to keep talking to_. I kept them separate rather
than blending them into one score.

The rule that saved me most often was a hierarchy of trust. A metric decides
only if it is a voluntary, costly user action that our own instruments can't
change underneath it, such as whether a learner comes back. Judge scores
_explain_ why something changed and never decide. Twice an apparent win failed
that test. A memory feature looked like it added 100 seconds of talk time, and
a rolling summary looked like it raised return rates by 14 points. Both were
selection bias: the users the feature fired for were already the engaged ones.
A quantised model went the other way. It was 9–11% faster to first audio, but
learners came back measurably less, so I turned it off.

How the judge itself was validated is on
[its own page]({{ '/work/4_judge/' | relative_url }}), and the reasoning behind
the three axes is in
[How do you evaluate a conversation?]({{ '/blog/2026/evaluating-a-conversation/' | relative_url }}).

## What I would flag

The architecture comparison was shaped by our constraints, so a team without
the latency budget or accent mix we had might rank Nemotron or the cascade
differently. And the pipeline fixes were measured
as before-and-after comparisons on live traffic, with matched cohorts where
possible but not always as randomised experiments.
