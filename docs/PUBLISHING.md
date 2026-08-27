# Chrome Web Store Publishing

This checklist separates repository work from actions that require the publisher's Google account or Chrome Web Store dashboard access.

## Repository release

1. Verify the release is on `master` and the working tree is clean.
2. Test the unpacked extension in Brave and Chrome while signed into YouTube.
3. Confirm `manifest.json` has a monotonically increased version and a description no longer than 132 characters.
4. Run `./scripts/validate-extension.sh`.
5. Run `./scripts/package-extension.sh`.
6. Inspect the generated ZIP and confirm `manifest.json` is at its root.
7. Tag the commit, create a GitHub release, and attach the ZIP.

## Developer account

1. Register in the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
2. Accept the agreement and pay the one-time registration fee shown by the dashboard.
3. Enable Google Account 2-Step Verification.
4. Set a publisher name and verify the contact email.

Official references:

- [Register as a developer](https://developer.chrome.com/docs/webstore/register)
- [Set up the developer account](https://developer.chrome.com/docs/webstore/set-up-account)
- [2-Step Verification policy](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification)

## Package and listing

1. Select **Add new item** and upload the generated ZIP.
2. Use the prepared text in `docs/STORE_LISTING.md`.
3. Upload `icons/icon128.png` as the item icon.
4. Upload at least one accurate 1280x800 or 640x400 screenshot.
5. Upload `store-assets/small-promo.png` as the required 440x280 promotional tile.
6. Select the category and distribution regions.
7. Complete the Privacy tab using the disclosures in `docs/STORE_LISTING.md` and publish `PRIVACY.md` at a stable public URL.
8. Add the reviewer test instructions from `docs/STORE_LISTING.md`.
9. Submit for review, then monitor the verified publisher email and dashboard.

Official references:

- [Prepare the extension](https://developer.chrome.com/docs/webstore/prepare)
- [Publish in the Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Store listing fields](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Image requirements](https://developer.chrome.com/docs/webstore/images)
- [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Review process](https://developer.chrome.com/docs/webstore/review-process)

## Required privacy disclosures

The extension handles website content and authentication information locally. It reads a YouTube session cookie in page context to calculate an authentication header, but does not store the cookie or send it anywhere except YouTube as part of the user-requested operation.

In the dashboard:

- Declare the single purpose exactly and narrowly.
- Justify the `https://www.youtube.com/*` content-script match.
- Declare no remote code.
- Disclose website content and authentication information as locally handled data.
- State that the developer does not collect or receive data.
- Certify Limited Use compliance.
- Provide the public privacy-policy URL.

Official references:

- [Privacy policy requirements](https://developer.chrome.com/docs/webstore/program-policies/privacy)
- [User data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Limited Use policy](https://developer.chrome.com/docs/webstore/program-policies/limited-use)
- [Permission policy](https://developer.chrome.com/docs/webstore/program-policies/permissions)

## Review notes

- All executable code is packaged; YouTube responses are treated only as data.
- The extension has no optional or broad permissions.
- The extension communicates only with YouTube on the page where it runs.
- Chrome Web Store approval does not guarantee that YouTube's undocumented page data or internal endpoint will remain stable.
- If review has not completed after three weeks, use Chrome Web Store support as described in the official review documentation.

## Updates

For each published update, increment the manifest version, upload a complete replacement ZIP, update affected listing and privacy fields, and submit the new version for review.

- [Update an existing item](https://developer.chrome.com/docs/webstore/update)
- [Brave support for Chrome extensions](https://brave.com/learn/using-chrome-extensions-in-brave/)
