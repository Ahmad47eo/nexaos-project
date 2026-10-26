# One UI PC experiment

**Status: research scaffold only — no bootable One UI image exists in this repository.**

This experiment investigates whether genuine Samsung One UI components can legally and technically be adapted to run on an x86-64 HP 250 G7 laptop. The requirement is specifically **Samsung One UI**, not a generic Android distribution with a One UI-like theme.

## Hardware target

The initial target reported by the project owner is an HP 250 G7 with an Intel Core i3-1005G1, 4 GB RAM, a 1 TB hard drive, and integrated Intel graphics. Confirm the exact submodel, Wi-Fi chipset, firmware mode, and available storage before any hardware-specific work.

## Reality check

Samsung One UI is built around Samsung's Android platform, device-specific kernel and vendor components, proprietary services, and hardware integration. A Samsung phone firmware package is not a generic PC installer. Simply extracting a phone ROM or renaming another Android ISO would not create a genuine One UI PC port.

This repository must not claim that One UI boots on x86-64 until an actual image has been built and independently tested.

## Non-negotiable safety rules

- Preserve the existing Windows installation and recovery options.
- Research and test in source code, CI, and a virtual machine first.
- Never repartition, format, or write to an internal disk automatically.
- Do not distribute Samsung proprietary firmware, binaries, keys, or copyrighted system images.
- Do not call generic Android/AOSP, a desktop theme, or a phone-mirroring app "One UI for PC."
- Any future boot-image artifact must include its source, build logs, checksum, architecture, known limitations, and explicit test status.

## Current milestones

1. **Feasibility research:** identify the lawful source and licensing situation, One UI version dependencies, kernel/vendor requirements, and x86-64 boot blockers.
2. **Architecture decision:** determine whether a genuine port is technically possible with available public source and legally redistributable components.
3. **Prototype:** only proceed if milestone 2 identifies a realistic implementation path.
4. **Validation:** build a reproducible image, test in a VM, then document careful USB-only hardware testing if possible.

At this stage, this repository contains documentation only. It does not download Samsung firmware or build an OS.
