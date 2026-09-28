The UI is static and keeps ISO files local to the browser.

The target VM engine is QEMU compiled to WebAssembly for an x86-64 guest. The runtime is kept separate from the UI because generated WebAssembly assets are large.

The UI exposes RAM presets through 8 GB. That is a target, not a guarantee: browser/WebAssembly memory limits can prevent an 8 GB guest from starting.

A production runtime adapter should use disposable copy-on-write storage so Reset discards guest changes.