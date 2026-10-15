#!/usr/bin/env python3
"""Lightweight checks for the NEXA DROID PC repository.

This validates project scaffolding only. It deliberately does not download AOSP
or claim to build an operating system.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
required = [
    ROOT / "README.md",
    ROOT / "docs" / "BUILD-PLAN.md",
]
missing = [str(p.relative_to(ROOT)) for p in required if not p.is_file()]

if missing:
    print("FAIL: required project files are missing:")
    for item in missing:
        print(f"  - {item}")
    sys.exit(1)

# A real AOSP checkout normally contains a top-level manifest file or .repo
# metadata. This repository should not assume source exists just because the
# documentation or workflow exists.
has_manifest = (ROOT / "default.xml").is_file() or (ROOT / ".repo" / "manifest.xml").is_file()
if has_manifest:
    print("AOSP manifest marker found. This is not proof that source is complete or buildable.")
else:
    print("AOSP source tree: not present (expected at this scaffolding stage).")

print("PASS: project scaffolding checks completed.")
print("NOTE: no Android image was built by this check.")
