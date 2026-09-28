export class VMController {
  constructor(o) {
    Object.assign(this, o);
    this.runtime = null;
    this.module = null;
    this.base = new URL('../qemu/', import.meta.url);
  }

  async loadRuntime() {
    if (this.runtime) return this.runtime;

    const base = this.base.href;
    this.onRuntime(false, 'Loading QEMU-Wasm runtime...');

    const loadScript = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = new URL('load.js', base).href;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Could not load QEMU filesystem package'));
      document.head.appendChild(s);
    });

    window.Module = {
      noInitialRun: true,
      noExitRuntime: true,
      locateFile: file => new URL(file, base).href,
      print: msg => this.log?.('QEMU: ' + msg),
      printErr: msg => this.log?.('QEMU: ' + msg),
      onAbort: msg => this.onError?.('QEMU aborted: ' + msg),
      preRun: []
    };

    await loadScript;
    const mod = await import(new URL('qemu-system-x86_64.js', base).href);
    const factory = mod.default || mod;
    this.module = await factory(window.Module);
    this.runtime = {
      start: args => this.startQemu(args),
      pause: () => this.onStatus('paused', 'Pause requested'),
      resume: () => this.onStatus('running', 'Resume requested'),
      reset: () => this.reset(),
      stop: () => this.stop()
    };
    this.onRuntime(true, 'QEMU-Wasm runtime loaded');
    return this.runtime;
  }

  async startQemu({isoFile, memoryMiB, smp}) {
    if (!this.module) throw new Error('QEMU module is not initialized');
    if (memoryMiB > 2048) {
      throw new Error('This QEMU-Wasm build is limited to about 2 GB guest RAM; 8 GB needs a wasm64 build.');
    }

    const bytes = new Uint8Array(await isoFile.arrayBuffer());
    const isoPath = '/nexaos.iso';
    try { this.module.FS_unlink(isoPath); } catch {}
    this.module.FS_writeFile(isoPath, bytes);

    const args = [
      '-m', String(memoryMiB) + 'M',
      '-smp', String(smp),
      '-L', '/pack/',
      '-cdrom', isoPath,
      '-boot', 'd',
      '-serial', 'stdio',
      '-display', 'none'
    ];

    window.Module.arguments = args;
    if (typeof this.module.callMain === 'function') this.module.callMain(args);
    else throw new Error('QEMU build does not expose callMain');
  }

  async start(isoFile, settings) {
    try {
      this.onStatus('running', 'Loading QEMU-Wasm...');
      await this.loadRuntime();
      await this.runtime.start({isoFile, ...settings});
      this.onStatus('running', 'QEMU-Wasm running');
    } catch (e) {
      this.onError(e?.message || String(e));
      this.onStatus('error', e?.message || 'QEMU-Wasm failed');
    }
  }

  pause() { this.onStatus('paused', 'Pause is not yet exposed by this QEMU build'); }
  resume() { this.onStatus('running', 'Resume is not yet exposed by this QEMU build'); }
  reset() { this.onStatus('stopped', 'VM reset requested; reload QEMU for a clean boot'); }
  stop() { this.onStatus('stopped', 'VM stopped'); this.renderFallback('NexaOS ISO Lab', 'Select an ISO and press Start VM.'); }

  renderFallback(t, p) {
    this.screen.innerHTML = '<div class="screen-message"><div class="logo">N</div><h1>' + t + '</h1><p>' + p + '</p></div>';
  }
}