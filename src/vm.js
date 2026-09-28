export class VMController {
  constructor(o) {
    Object.assign(this, o);
    this.runtime = null;
    this.module = null;
    this.base = new URL('../qemu/', import.meta.url);
  }

  diag(msg) {
    this.onLog?.('QEMU: ' + msg);
  }

  async waitForScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + url));
      document.head.appendChild(s);
    });
  }

  async loadRuntime() {
    if (this.runtime) return this.runtime;

    const base = this.base.href;
    this.onRuntime(false, 'Loading QEMU-Wasm runtime...');
    this.diag('Starting runtime loader');
    this.diag('Base URL: ' + base);

    const canvas = this.ensureCanvas();
    window.Module = {
      noInitialRun: true,
      noExitRuntime: true,
      locateFile: file => new URL(file, base).href,
      mainScriptUrlOrBlob: new URL('qemu-system-x86_64.js', base).href,
      canvas,
      print: msg => this.onLog?.('QEMU: ' + msg),
      printErr: msg => this.onLog?.('QEMU: ' + msg),
      onAbort: msg => this.onError?.('QEMU aborted: ' + msg),
      preRun: []
    };

    const loadUrl = new URL('load.js', base).href;
    this.diag('Loading packaged filesystem: load.js');
    await Promise.race([
      this.waitForScript(loadUrl),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out loading QEMU filesystem after 30 seconds')), 30000))
    ]);
    this.diag('Filesystem package loaded');

    const qemuUrl = new URL('qemu-system-x86_64.js', base).href;
    this.diag('Importing QEMU module');
    const mod = await Promise.race([
      import(qemuUrl),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out importing QEMU JavaScript after 30 seconds')), 30000))
    ]);
    this.diag('QEMU JavaScript imported');

    const factory = mod.default || mod;
    this.diag('Initializing Emscripten module');
    this.module = await Promise.race([
      factory(window.Module),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out initializing QEMU-Wasm after 60 seconds')), 60000))
    ]);
    this.diag('Emscripten module initialized');

    this.runtime = {
      start: args => this.startQemu(args),
      pause: () => this.onStatus('paused', 'Pause is not exposed by this QEMU build'),
      resume: () => this.onStatus('running', 'Resume is not exposed by this QEMU build'),
      reset: () => this.reset(),
      stop: () => this.stop()
    };
    this.onRuntime(true, 'QEMU-Wasm runtime loaded');
    return this.runtime;
  }

  async startQemu({isoFile, memoryMiB, smp, firmware}) {
    if (!this.module) throw new Error('QEMU module is not initialized');
    if (memoryMiB > 2048) {
      throw new Error('This wasm32 build supports up to 2 GB guest RAM.');
    }

    this.diag('Reading ISO into browser memory');
    const bytes = new Uint8Array(await isoFile.arrayBuffer());
    const isoPath = '/nexaos.iso';
    try { this.module.FS_unlink(isoPath); } catch {}
    this.module.FS_writeFile(isoPath, bytes);
    this.diag('ISO loaded: ' + bytes.byteLength + ' bytes');

    if (firmware === 'uefi') {
      throw new Error('UEFI is not packaged yet; use BIOS for this build.');
    }

    const args = [
      '-accel', 'tcg,thread=multi,tb-size=500',
      '-m', String(memoryMiB) + 'M',
      '-smp', String(smp),
      '-L', '/pack/',
      '-drive', 'file=' + isoPath + ',media=cdrom,readonly=on,format=raw',
      '-boot', 'order=d',
      '-serial', 'stdio',
      '-display', 'sdl',
      '-vga', 'std',
      '-device', 'usb-kbd',
      '-device', 'usb-tablet'
    ];

    // qemu-wasm's browser sample passes arguments through Module.arguments.
    // This also avoids calling callMain() directly, which bypasses the
    // initialization path expected by the generated Emscripten module.
    this.module.arguments = args;
    this.diag('Starting QEMU with ' + memoryMiB + ' MB RAM and ' + smp + ' CPU thread(s)');
    if (typeof this.module.callMain === 'function') {
      this.module.callMain(args);
    } else {
      throw new Error('QEMU build does not expose callMain');
    }
  }

  ensureCanvas() {
    let canvas = this.screen.querySelector('#vmCanvas');
    if (!canvas) {
      this.screen.innerHTML = '';
      canvas = document.createElement('canvas');
      canvas.id = 'vmCanvas';
      canvas.tabIndex = 0;
      canvas.setAttribute('aria-label', 'NexaOS virtual machine display');
      this.screen.appendChild(canvas);
    }
    canvas.width = 1024;
    canvas.height = 768;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'contain';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', () => canvas.focus(), {passive:true});
    return canvas;
  }

  async start(isoFile, settings) {
    try {
      this.onStatus('running', 'Loading QEMU-Wasm...');
      await this.loadRuntime();
      this.diag('Runtime ready; starting VM');
      await this.runtime.start({isoFile, ...settings});
      this.onStatus('running', 'QEMU-Wasm started');
    } catch (e) {
      this.onError(e?.message || String(e));
      this.onStatus('error', e?.message || 'QEMU-Wasm failed');
    }
  }

  pause() {
    this.onStatus('paused', 'Pause is not available in this build');
  }

  resume() {
    this.onStatus('running', 'Resume is not available in this build');
  }

  reset() {
    // A fresh Emscripten instance is required for a true VM reset.
    // Reloading also clears the in-memory ISO and virtual filesystem.
    this.onStatus('stopped', 'Reloading for a clean VM reset...');
    location.reload();
  }

  stop() {
    this.onStatus('stopped', 'VM stopped; reload for a fresh runtime');
    this.renderFallback('NexaOS ISO Lab', 'Select an ISO and press Start VM.');
  }

  renderFallback(t, p) {
    this.screen.innerHTML = '<div class="screen-message"><div class="logo">N</div><h1>' + t + '</h1><p>' + p + '</p></div>';
  }
}
