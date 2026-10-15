# NEXA DROID PC build plan

## Stage 1 — repository and source validation

- Keep the project reproducible and document what is implemented.
- Verify official Android 17/AOSP source availability and licensing.
- Identify whether a supported x86-64 target exists or whether substantial porting would be required.
- Do not label this stage a bootable operating system.

## Stage 2 — build feasibility

Before downloading the full source tree, verify:
- The exact manifest URL and branch/tag.
- The target device configuration and build target.
- Required disk space, RAM, runner limits, and build duration.
- Whether a supported cloud runner can handle the build or a different build host is needed.

A normal GitHub-hosted runner may not have enough storage or time for a full AOSP build. Do not start a massive sync until feasibility is established.

## Stage 3 — build and validate

Only after Stage 2 is confirmed:
- Add a pinned, auditable build workflow.
- Keep build output as a workflow artifact.
- Verify the output format, checksum, architecture, and boot method.
- Test in a virtual machine before considering USB testing.

## Stage 4 — hardware and app compatibility

- Test the x86-64 boot path and hardware drivers.
- Document known issues and minimum hardware requirements.
- Investigate Android app compatibility.
- Treat Google Play as a separate certification and licensing question; never promise it will work by default.

## Non-goals for early stages

- No automatic partitioning, formatting, or writing to the user's internal disk.
- No claim that a workflow-only scaffold is an Android build.
- No unverified Android 17 branches, manifests, or device targets.
