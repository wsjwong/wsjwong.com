---
title: "The RTX 5090 Setup That Let Me Run Qwen and ComfyUI Together"
description: "After testing several combinations on one RTX 5090, I landed on a setup that kept Qwen loaded while still generating images safely."
pubDatetime: 2026-03-12T09:00:00Z
tags: ["ai", "gpu", "benchmarks", "local-ai"]
draft: false
---

I wanted one machine to do two jobs at the same time:

- keep a large language model loaded for chat and tools
- still generate images without the GPU constantly running into memory trouble

The machine was an RTX 5090.
The text model was `qwen3.5:27b`.
The image side was ComfyUI running `z_image_turbo_nvfp4.safetensors`.

The simple question was:

Can I keep Qwen resident in VRAM and still use ComfyUI without turning the whole setup into a crash-prone science project?

After benchmarking a few combinations, the answer was yes, but only if I stopped chasing the absolute fastest result.

## The setup I kept

This is the configuration I ended up keeping:

- Qwen: `qwen3.5:27b`
- Ollama: `FLASH_ATTENTION=1`
- Ollama KV cache: `q8_0`
- Ollama context length: `28672`
- ComfyUI: `--lowvram`
- Workflow UNet: `z_image_turbo_nvfp4.safetensors`

I also kept two operating rules:

- heavy GPU jobs should run one at a time
- if free VRAM drops below `4GB`, stop Qwen before starting a heavy image run

That was the best balance between speed and stability.

## Why the fastest setup was not the right setup

The fastest ComfyUI profile I tested finished 3 images in `9.972s`.

That sounds great until you look at the memory headroom:

- lowest free VRAM: `233MB`

That is effectively no safety margin.

It might survive a clean benchmark run, but it leaves almost no room for background overhead, slightly heavier prompts, or a different workload later.

The setup I actually kept was slower:

- 3 images in `16.615s`
- lowest free VRAM: `7913MB`

That tradeoff was easy to accept.

I gave up a bit of raw speed, but in return I got a much larger buffer and a setup I could trust for normal use.

## The small surprise on the Qwen side

I also tested different KV cache formats for Qwen at a `28k` context length.

These were the results:

- `q4_0`: `23075.8MB`
- `q8_0`: `23523.8MB`
- `f16`: `24243.8MB`

The useful part was this:

`q8_0` only used about `448MB` more VRAM than `q4_0`.

That was a smaller penalty than I expected, and it made `q8_0` feel like the sensible default for a large context setup.

`f16` used about `1.17GB` more than `q4_0`, which felt harder to justify in a shared-GPU workflow.

## My practical takeaway

If you want one RTX 5090 to handle both a large local LLM and image generation, the winning strategy is not "push the card until it almost explodes".

The better strategy is:

- keep the language model efficient but not too aggressive
- let ComfyUI use a safer memory mode
- leave real VRAM headroom
- serialize heavy work instead of pretending everything should run at once

For me, that meant:

- Qwen with `q8_0` and `28k` context
- ComfyUI with `--lowvram`
- a hard fallback rule below `4GB` free VRAM

That setup was not the benchmark winner on paper.

It was the setup that actually made sense to live with.

If you want the full benchmark numbers, I also published the detailed write-up: [Benchmarking Qwen 27B and ComfyUI on One RTX 5090](/posts/2026/benchmarking-qwen-27b-and-comfyui-on-one-rtx-5090).
