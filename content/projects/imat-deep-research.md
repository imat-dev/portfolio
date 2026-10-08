---
layout: Post
title: Imat Deep Research
description: Open-source multi-agent research assistant. A clarifier and four AI agents plan web searches, run them in parallel, write a long-form report and email it to you.
date: '2026-09-22'
url: https://github.com/imat-dev/imat_researcher
tags:
  - Python
  - OpenAI Agents SDK
  - Multi-agent
  - Pydantic
  - Gradio
logo:
  src:
  alt:
images:
  - src: /projects/researcher-ui.png
    alt: Imat Deep Research interface
    overlay:
      src: /projects/researcher-report.png
      alt: A generated research report
attributes:
  - label: Type
    value: Open source, solo build
  - label: Role
    value: AI Engineer (design and build)
---

Imat Deep Research turns one question into a sourced, long-form report. It is built in Python on the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) and runs as a Gradio web app. [View the code on GitHub](https://github.com/imat-dev/imat_researcher).

### How it works

1. **Clarifier agent** decides whether the question can be researched, and asks you two follow-up questions to narrow it.
2. **Planner agent** turns the question and your answers into a typed search plan: each search with the reason for running it.
3. **Search agent** runs every planned search concurrently with a web-search tool and summarizes each result.
4. **Writer agent** synthesizes the summaries into a structured report: a short summary, the full Markdown report and follow-up questions.
5. **Email agent** delivers the report as HTML email over SMTP, with a Pushover notification as the fallback.

### Engineering decisions

- **Typed contracts between agents.** Every stage hands the next a Pydantic model, so the planner's output is validated before any search runs.
- **Parallel tool calls.** Planned searches run concurrently instead of one after another.
- **Streaming progress.** The orchestrator is an async generator, so each stage streams a status line into the UI as it finishes.
- **Tracing.** Each run is wrapped in one trace, so every agent step can be inspected in the OpenAI traces dashboard.
- **Guarding the pipeline.** Requests that can't be researched stop at the clarifier, before any search or model spend.

**Stack:** Python 3.12, OpenAI Agents SDK, Pydantic, Gradio, uv, ruff.
