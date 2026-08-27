# Store Listing Draft

## Product details

**Name:** Watch Later Cleaner

**Summary:** Remove videos from your YouTube Watch Later playlist in one click with instant visual feedback.

**Category:** Productivity

**Language:** English

## Detailed description

Watch Later Cleaner adds a dedicated remove button to every video on the desktop YouTube Watch Later page.

Instead of opening the three-dot menu and selecting Remove from Watch Later for each item, click once. The video disappears immediately while YouTube processes the request. If the operation fails, the extension restores the video and displays the error.

The extension is deliberately focused:

- Works only on the YouTube Watch Later page.
- Supports videos loaded while scrolling.
- Contains no ads, analytics, tracking, or remote extension code.
- Sends requests directly to YouTube using the signed-in browser session.
- Does not send data to the developer or any developer-operated server.
- Is fully open source and can be loaded manually for development.

This extension is an independent project and is not affiliated with or endorsed by YouTube or Google.

## Single purpose

Allow users to remove videos from their YouTube Watch Later playlist with one click and immediate visual feedback.

## Host access justification

`https://www.youtube.com/*` is required to add the remove control on the Watch Later page, read the selected row's playlist command, and send the user-requested playlist edit directly to YouTube. The content script exits without modifying other YouTube pages.

## Remote code declaration

No remote code. All executable JavaScript is included in the extension package. Data read from YouTube is used only as structured request data and is never evaluated as code.

## Data-use disclosure

**Website content:** Handled locally to read the playlist and video identifiers for the row selected by the user.

**Authentication information:** A YouTube session cookie is read in page context and used in memory to calculate the authentication header required by YouTube. The raw cookie is not stored, logged, exposed, or transmitted. The calculated header is sent only to YouTube over HTTPS.

**Developer collection:** The developer does not collect or receive data. There is no analytics service, advertising service, developer server, external storage, sale, or sharing of user data.

**Limited Use:** The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Reviewer test instructions

1. Sign into a YouTube test account.
2. Add a disposable video to Watch Later.
3. Open `https://www.youtube.com/playlist?list=WL` on desktop.
4. Confirm that a trash button appears next to the video's three-dot menu.
5. Click the trash button.
6. Confirm that the row disappears immediately and remains absent after refreshing the page.

No extension-specific account or credentials are required. A signed-in YouTube account with at least one Watch Later item is required to exercise the feature.

## Required assets

- Item icon: `icons/icon128.png` (128x128 PNG).
- Small promotional tile: `store-assets/small-promo.png` (440x280 PNG).
- Screenshot: capture at least one accurate 1280x800 or 640x400 image after loading the release build. Use a test account or redact unrelated personal information before capture.

Optional assets include up to four additional screenshots, a 1400x560 marquee tile, and a promotional YouTube video.
