# INFOREST VPN for Windows

A Tauri 2 + Vite desktop-client prototype.

## Requirements
- Windows 10/11
- Node.js 20 or newer
- Rust stable toolchain
- Microsoft C++ Build Tools and WebView2 Runtime (Tauri prerequisites)

## Run in development
```powershell
npm install
npm run tauri dev
```

## Build
```powershell
npm run tauri build
```

The installer output is produced by Tauri under `src-tauri/target/release/bundle`.

## Current limitations
This is the first UI and subscription-import milestone. It can decode common base64 subscription text locally and identify supported URI schemes. It **does not connect**, create a tunnel, or contain server addresses. The Connect control remains unavailable until a real, audited tunnel-engine integration is implemented.

Do not paste a private subscription URL into screenshots, public bug reports, or source code. The prototype processes pasted subscription text in the app window only.
