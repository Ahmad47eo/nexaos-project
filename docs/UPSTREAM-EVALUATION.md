# Upstream evaluation: AOSP 17 PC port

Reviewed on 2026-10-15.

## Candidate

- Repository: https://github.com/somalapuram/aosp-pc-x86_64
- License file in upstream repository: Apache License 2.0.
- Purpose: an Android 17 bare-metal x86-64 PC port, with a custom device target, Linux kernel configuration/patch, and scripts to assemble and test a disk image.

## What the upstream README reports

The project reports booting to Launcher on Intel Meteor Lake, with an Intel graphics path and QEMU support. It explicitly reports limitations: AMD graphics acceleration is incomplete, NVIDIA acceleration is not implemented, and verified boot is disabled.

These are upstream maintainer claims, not independently tested by NEXA DROID PC.

## Prebuilt-image audit (2026-10-15)

A read-only check of the upstream GitHub repository found:

- No published GitHub Releases.
- No tracked ISO, disk-image, VM-image, or archive artifacts in the repository tree.
- The `demo/` folder documents demo-video material and measurements; it does not provide a bootable OS image.
- The upstream README describes creating an image with its build script, rather than downloading a ready-made one.

Result: **no verified prebuilt bootable PC image was found**. Do not treat the repository source code or the official Android 17 x86_64 GSI as a PC installer ISO. Google's GSI is a generic system image for supported-device testing, not a ready-to-boot PC image: https://developer.android.com/about/versions/17/gsi-release-notes

## Build requirements and blockers

The upstream README says its AOSP and kernel source trees are not committed and are reproduced from pinned upstream revisions. It estimates around 400 GB for the first source sync plus build. Its QEMU helper configures an 8 GB guest. That means:

- A normal GitHub-hosted runner is not a credible place to assume a complete build will succeed.
- The current NEXA project checker only validates scaffolding.
- We must not run the upstream build script automatically until its code and all build/write steps have been reviewed.
- The USB-writing command is not part of CI and must never run as an automated step.

## NEXA strategy

1. Treat the upstream project as a technical reference and possible base, not as code we wrote ourselves.
2. Keep NEXA documentation and project automation separate, and preserve attribution/license notices if code is later reused.
3. Run a lightweight GitHub Actions audit that verifies the upstream repository and key files are reachable without cloning AOSP or executing upstream scripts.
4. Since no ready-made image was found, do not create a download link or claim an ISO exists. Next, inspect whether the upstream maintainer publishes an image elsewhere; otherwise the realistic path is to plan a controlled build on a sufficiently powerful host, not a standard runner or this 4 GB PC.
5. Only after a real image exists, validate its checksum and boot it in a VM before considering a USB test. Never modify the Windows internal disk.

## References

- Upstream project: https://github.com/somalapuram/aosp-pc-x86_64
- Android AOSP build requirements: https://source.android.com/docs/setup/start/requirements
- Android 17 GSI notes: https://developer.android.com/about/versions/17/gsi-release-notes
