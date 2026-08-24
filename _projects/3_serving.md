---
layout: page
title: Serving speech models when the metrics lie
description: Why GPU utilisation is the wrong signal for multi-model inference pipelines, and what to instrument instead.
importance: 3
category: work
---

A speech pipeline is rarely one model. It is usually two or more with different
appetites sharing a device — a language model that generates tokens in bursts,
an audio codec that decodes steadily, sometimes a vocoder after that. Each is
well behaved alone. Together they produce a class of failure that standard
observability handles badly.

## The dashboard is measuring the wrong thing

GPU utilisation is a time-average of whether the device is busy. A language model
generating tokens in short bursts leaves large gaps, so a pipeline that is
already saturated can report near-zero utilisation. I have watched a service fail
under load while every graph insisted there was headroom.

The bottleneck in these systems is almost never the device. It is a queue in
front of one component, and queues are invisible to device-level metrics. So the
first thing I instrument is depth and wait time per stage, not utilisation. If
you only have budget for one number, take the queue.

## Find the cliff, don't estimate the headroom

Capacity estimates derived from throughput are optimistic in a specific way: they
assume degradation is gradual. In practice these pipelines are fine, then
briefly marginal, then falling over — the interesting region is narrow and you
want its actual boundaries, not an extrapolation.

So I ramp concurrency until failures start and record the number where the first
one appears, the number where the rate becomes material, and the number where it
collapses. Three real numbers beat one modelled one. They also give you a
concrete autoscaling threshold instead of a guess.

Two smaller things worth measuring while you are there. First-call latency is
often dramatically worse than steady-state because of lazy initialisation and
JIT compilation, so warm-up needs to be explicit rather than incidental — this
shows up as a mysteriously slow first user and then never reproduces. And any
compilation or graph-capture step interacts badly with cold starts, which makes
eager-versus-compiled a latency decision, not just a throughput one.

## Colocation is a correctness question first

When two models share a process and a device, the interesting failures are not
about speed. Independent execution streams without explicit synchronisation can
let one component write into memory the other has not finished with. That
surfaces as sporadic corruption or a hard device-side fault under load, and it
looks like a capacity problem right up until you notice it is not.

My default now is that separate models get separate workers with explicit
fractional resource allocation, and they get to share a process only when there
is a measured reason. Most of the throughput I have recovered came from
separating things that were never safe together, rather than from making either
one faster.

## Autoscale on the right signal, and be asymmetric about it

For very fast tasks, in-flight request counts are too noisy to scale on — the
metric oscillates faster than the scaler can react. A target concurrency per
replica is steadier.

Scale up fast and down slowly. The cost of being briefly over-provisioned is
money; the cost of being under-provisioned is dropped user requests. Those are
not symmetric, and the delays should not be either.

Finally: check the front door. I have twice found that after carefully scaling
the expensive component, the real constraint was a single ingress serialising
requests before they ever reached it.
