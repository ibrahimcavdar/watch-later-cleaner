# Privacy Policy

Effective date: August 27, 2026

Watch Later Cleaner is an open-source browser extension with one purpose: allowing a user to remove videos from their YouTube Watch Later playlist with fewer clicks.

## Data handled

When the user clicks the extension's remove button, the extension handles the following data locally in the browser:

- The current YouTube page URL, only to determine whether the page is the Watch Later playlist.
- YouTube playlist and video identifiers attached to the selected playlist row.
- A YouTube session cookie, used only in memory to calculate the authentication header required for the user-requested same-origin YouTube operation.

The raw session cookie is not stored, logged, exposed, or transmitted by the extension. The calculated authentication header and playlist operation are sent only to `https://www.youtube.com` over HTTPS.

## Data collection and sharing

The developer does not collect, receive, sell, rent, or share user data. The extension has:

- No analytics or tracking.
- No advertising.
- No developer-operated server.
- No external storage.
- No remote executable code.

The extension does not retain browsing history, playlist contents, video identifiers, authentication information, or user actions. YouTube processes and retains playlist changes according to Google's own policies.

## Data control

Because the extension does not store user data, there is no extension-held data to export or delete. Users can stop all extension processing by disabling or uninstalling it from the browser's extensions page.

## Limited Use

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Changes

Material changes to data handling will be reflected in this policy and in the Chrome Web Store privacy disclosures before the changed extension is published.

## Contact

Questions can be submitted through this repository's public issue tracker. Security-sensitive reports should follow `SECURITY.md`.
