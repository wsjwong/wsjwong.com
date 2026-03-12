---
title: "Benchmarking Qwen 27B and ComfyUI on One RTX 5090"
description: "I benchmarked several memory and cache combinations to see which RTX 5090 setup gave the best balance between image speed and VRAM safety."
pubDatetime: 2026-03-12T09:30:00Z
tags: ["ai", "gpu", "benchmarks", "local-ai"]
draft: false
---

I recently wanted to keep `qwen3.5:27b` loaded on a single RTX 5090 while still using ComfyUI for image generation.

That sounds simple until you remember what is really happening:

- one large model already occupies a lot of VRAM
- image generation can spike memory at the wrong moment
- the fastest profile is not always the one you can safely keep using

So I ran a benchmark to answer one practical question:

What is the best setup if I want both decent image speed and enough VRAM headroom to avoid constant trouble?

## Test goal

The goal was not to find the single fastest benchmark score.

The goal was to find the best *shared GPU* setup while Qwen stayed resident in memory.

In other words:

- keep Qwen alive
- generate 3 images
- compare speed
- compare the lowest free VRAM
- pick the setup that is fast enough without becoming fragile

## Test setup

These settings stayed fixed during the benchmark:

- GPU: RTX 5090
- LLM: `qwen3.5:27b`
- Context length: `28672`
- Image model: `z_image_turbo_nvfp4.safetensors`
- Workload: `1024x1024`, `steps=9`, 3 images per run

I compared 8 combinations across three ideas:

- `normal` vs `lowvram`
- default caching vs `cacheNone`
- default memory reserve vs a `reserve4` variant

You do not need to care about every implementation detail to understand the result.
The main thing is this:

- `normal` was more aggressive
- `lowvram` was safer
- `cacheNone` reduced memory pressure but usually hurt throughput

## The main result

Here is the simplified version of the benchmark:

| Setup | 3-image time | Lowest free VRAM | Takeaway |
|---|---:|---:|---|
| `normal_reserve4` | `9.972s` | `233MB` | Fastest, but too close to the edge |
| `normal_default` | `11.467s` | `212MB` | Also fast, also risky |
| `lowvram_default` | `16.615s` | `7913MB` | Best balance |
| `lowvram_reserve4` | `19.105s` | `7913MB` | Safer, but slower than needed |
| `normal_cacheNone_reserve4` | `19.748s` | `7433MB` | Safe, but throughput drops |
| `normal_cacheNone` | `20.475s` | `7403MB` | Safe, but throughput drops |
| `lowvram_cacheNone_reserve4` | `35.328s` | `10185MB` | Very conservative, too slow |
| `lowvram_cacheNone` | `38.991s` | `10155MB` | Very conservative, too slow |

The fastest setup was clearly `normal_reserve4`.

But that profile only left `233MB` of free VRAM at its lowest point.

That is not really operational headroom.
That is a benchmark run gambling that nothing slightly heavier happens next.

`lowvram_default` was slower, but it was still reasonably fast and left almost `8GB` of free VRAM.

That made it the clear winner for real usage.

## Why I chose `lowvram_default`

This was the decision logic:

`normal_reserve4` won on speed, but it behaved like a setup that would eventually bite me.

`lowvram_default` lost a few seconds across 3 images, but gave me a much healthier margin.

That mattered more because I was not building a one-off benchmark demo.
I was trying to build a machine I could keep using without constantly watching memory graphs.

So my final ComfyUI choice was:

- use `--lowvram`
- keep the default cache path
- avoid the extra-slowness `cacheNone` profiles unless I ever need them as a fallback

## The second test: Qwen KV cache format at 28k context

I also compared Qwen's KV cache modes because the LLM side matters just as much in a shared setup.

The measured dedicated VRAM usage looked like this:

| KV cache mode | VRAM used | Difference vs `q4_0` | Eval rate |
|---|---:|---:|---:|
| `q4_0` | `23075.8MB` | baseline | `62.17 tok/s` |
| `q8_0` | `23523.8MB` | `+448MB` | `62.94 tok/s` |
| `f16` | `24243.8MB` | `+1168MB` | `59.44 tok/s` |

This was useful for one reason:

`q8_0` was not dramatically more expensive than `q4_0`.

At a `28k` context, the extra cost was only about `0.45GB`.

That made `q8_0` feel like a practical default for this kind of setup.
It keeps the memory increase modest while avoiding the larger jump of `f16`.

## The final operating rules I kept

After the benchmark, I settled on a simple operating policy:

- run Qwen with `q8_0`
- keep context length at `28672`
- run ComfyUI in `--lowvram`
- serialize heavy GPU work
- if free VRAM falls below `4096MB`, stop Qwen before starting a heavy image request

That last rule matters because it turns "maybe the system survives" into a clearer control point.

I would rather accept a cold start on the language model than keep pretending every workload should run concurrently.

## Final takeaway

The most useful lesson from this benchmark was simple:

On a shared RTX 5090 workflow, the best setup is usually not the fastest one.

The best setup is the one that leaves enough headroom to stay stable when the workload stops being perfectly clean.

For me, that meant accepting `16.615s` instead of `9.972s` for 3 images, because the safer profile left almost `8GB` free instead of almost nothing.

That is a good trade if the goal is to keep both text and image workflows on one machine without constant babysitting.
