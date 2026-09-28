Target engine: https://github.com/ktock/qemu-wasm

The upstream project documents an Emscripten build of qemu-system-x86_64 and browser serving with pthread support.

Expected files under public/qemu include qemu-system-x86_64.js, qemu-system-x86_64.wasm, qemu-system-x86_64.worker.js, qemu-system-x86_64.data, load.js and required PC BIOS assets.

The large generated binaries are intentionally not committed until the runtime is built and tested.

Browser deployment needs cross-origin isolation for SharedArrayBuffer-based pthreads.