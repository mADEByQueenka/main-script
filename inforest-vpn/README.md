# INFOREST VPN

Open-source client and subscription project by INFOREST.

> **Current status: early development.** This repository currently contains the Windows desktop UI prototype and a local subscription-format preview. It does not establish a VPN tunnel and does not ship server credentials.

## Project goals
- Windows desktop client with a clear connection state and server list.
- Import standard subscription URLs and supported proxy URI formats.
- Keep subscription credentials private and avoid committing real links or server secrets.
- Publish source code and build instructions.
- Add a real tunnel engine only after selecting a supported upstream core and complying with its license and distribution requirements.

## Windows client
See [windows/README.md](windows/README.md).

## Security
Never publish personal subscription URLs, UUIDs, passwords, private keys, or server configuration in issues or commits. A subscription URL is a credential.

## License
The original INFOREST VPN source in this repository is licensed under the MIT License. Third-party components retain their own licenses.
