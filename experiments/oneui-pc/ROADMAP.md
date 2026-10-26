# Roadmap

## Phase 0 — truthful project scaffold
- [x] Create an isolated experiment directory without replacing existing NEXA project files.
- [x] Document the specific One UI requirement and the distinction from generic Android.
- [x] Set safety and evidence requirements.

## Phase 1 — source and licensing research
- [ ] Find authoritative source-release and licensing information for the targeted One UI version.
- [ ] List the Samsung-specific components needed for a real build.
- [ ] Determine which components have source code and which are proprietary binaries.
- [ ] Record links and dates for every important finding.

## Phase 2 — PC platform feasibility
- [ ] Investigate kernel and boot-chain requirements for x86-64 UEFI.
- [ ] Map the HP 250 G7 hardware to available open drivers.
- [ ] Estimate build resources and whether a free CI runner is viable.
- [ ] Write a go/no-go decision with reasons.

## Phase 3 — prototype (blocked until Phase 2 passes)
- [ ] Implement only the architecture supported by evidence.
- [ ] Pin source revisions and build dependencies.
- [ ] Produce checksums and complete build logs.
- [ ] Never publish an artifact as One UI unless its provenance is documented.

## Phase 4 — validation (blocked until an image exists)
- [ ] Test in a disposable virtual machine.
- [ ] Confirm UEFI boot and collect logs.
- [ ] Document hardware support and failures.
- [ ] Consider manual USB-only testing without modifying the internal disk.

No phase automatically changes the laptop's partitions or Windows boot configuration.
