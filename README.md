# NEXA DROID PC 17

An experimental project to investigate building an Android-based x86-64 PC operating system with GitHub Actions.

> **Status: early scaffolding only.** This repository does not yet contain Android Open Source Project (AOSP) source code and does not produce a bootable ISO.

## Goals

- Target x86-64 PCs such as the Dell Vostro 3910.
- Keep development and build orchestration in GitHub Actions where practical.
- Eventually test from a USB drive without modifying the Windows installation.
- Investigate Android app compatibility and Google Play eligibility separately. Google Play certification is not guaranteed.

## Important technical constraints

A complete AOSP build needs a large source checkout, substantial disk space, memory, and build time. Standard GitHub-hosted runners may not be sufficient for a full Android build. This project must not report a successful OS build until a real image has been produced and validated.

Android 17 source availability, an x86-64 device target, required proprietary firmware, and a viable image-generation path must be verified before attempting a full build.

## Repository layout

- `.github/workflows/project-check.yml` — lightweight repository checks.
- `docs/BUILD-PLAN.md` — staged technical plan.
- `tools/check_project.py` — checks the project structure and reports whether AOSP source is present.

## Current development

Run the **Project checks** workflow from the Actions tab, or push a commit. It checks project structure only; it does not compile Android.

## Safety

Do not write an image to a disk or USB automatically. Any future image-writing instructions must identify the exact target device and require an explicit manual confirmation. Keep Windows and its recovery options intact.
