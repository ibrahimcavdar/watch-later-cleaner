# Watch Later Cleaner

Watch Later Cleaner is a small, open-source browser extension that makes it faster to clean up a large YouTube Watch Later playlist.

YouTube normally requires opening a three-dot menu and selecting **Remove from Watch Later** for every video. This extension adds a dedicated remove button to each row and hides the row immediately while the request is processed.

## Features

- One-click removal on the desktop Watch Later page.
- Optimistic UI updates with automatic rollback when YouTube rejects a request.
- Support for videos loaded while scrolling and YouTube's client-side navigation.
- No analytics, ads, developer-operated server, or remote extension code.
- No build step or runtime dependencies.

## Install manually

You can load the source directly if you want to use the extension before a store release or contribute to development.

1. Download or clone this repository.
2. Open `brave://extensions` in Brave or `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the repository directory containing `manifest.json`.
6. Open [YouTube Watch Later](https://www.youtube.com/playlist?list=WL).

After changing the source, reload the extension from the browser's extensions page and refresh the YouTube tab.

## Privacy

The extension runs only on `https://www.youtube.com/*`. It reads the playlist command associated with the row you choose, creates the authentication header required by YouTube in memory, and sends the requested removal directly to YouTube. It does not send data to the developer, use analytics, or retain browsing or account data.

See [PRIVACY.md](PRIVACY.md) for the full policy.

## Development

The extension uses plain JavaScript and CSS with Manifest V3. There is no dependency installation or build step.

Validate the source:

```sh
./scripts/validate-extension.sh
```

Create a store-ready ZIP in `dist/`:

```sh
./scripts/package-extension.sh
```

The ZIP contains only runtime files and places `manifest.json` at its root.

## Project structure

- `content.js`: Adds controls and owns optimistic UI behavior.
- `page-bridge.js`: Reads YouTube's page data and sends the authenticated playlist request.
- `content.css`: Styles the injected controls and error message.
- `manifest.json`: Manifest V3 extension definition.
- `docs/`: Publication and store-listing documentation.
- `store-assets/`: Editable and exported Chrome Web Store artwork.

## Compatibility

The extension targets the desktop Watch Later page in current Chromium-based browsers. YouTube's page structure and internal request format are not public APIs and may change; please open an issue if an update breaks the extension.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues should follow [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
