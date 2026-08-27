(() => {
  "use strict";

  const REQUEST_SOURCE = "youtube-playlist-cleaner:content";
  const RESPONSE_SOURCE = "youtube-playlist-cleaner:page";
  const REMOVE_ACTION = "ACTION_REMOVE_VIDEO";
  const WATCH_LATER_PLAYLIST_ID = "WL";

  if (window.__youtubePlaylistCleanerBridgeInstalled) return;
  window.__youtubePlaylistCleanerBridgeInstalled = true;

  window.addEventListener("message", (event) => {
    if (
      event.source !== window ||
      event.data?.source !== REQUEST_SOURCE ||
      event.data?.type !== "remove"
    ) {
      return;
    }

    removeVideo(event.data.id)
      .then(() => respond(event.data.id, true))
      .catch((error) => respond(event.data.id, false, error.message));
  });

  async function removeVideo(requestId) {
    if (typeof requestId !== "string") {
      throw new Error("Invalid removal request.");
    }

    const renderer = document.querySelector(
      `[data-ypc-request-id="${CSS.escape(requestId)}"]`,
    );
    if (!renderer) throw new Error("The video is no longer available.");

    const endpoint = getRemoveEndpoint(renderer);
    if (!endpoint) {
      throw new Error("Could not read YouTube's removal command.");
    }

    const config = window.ytcfg;
    const apiKey = config?.get?.("INNERTUBE_API_KEY");
    const context = config?.get?.("INNERTUBE_CONTEXT");
    if (!apiKey || !context) {
      throw new Error("YouTube's request configuration is unavailable.");
    }

    const headers = await createHeaders(config, context);
    const response = await fetch(
      `/youtubei/v1/browse/edit_playlist?key=${encodeURIComponent(apiKey)}&prettyPrint=false`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ context, ...endpoint }),
      },
    );

    if (!response.ok) {
      throw new Error(`YouTube rejected the request (${response.status}).`);
    }

    const result = await response.json().catch(() => ({}));
    if (result.error) {
      throw new Error(result.error.message || "YouTube rejected the request.");
    }

  }

  function getRemoveEndpoint(renderer) {
    const menu = renderer.querySelector("ytd-menu-renderer");
    const sources = [
      renderer.data,
      renderer.__data?.data,
      renderer.__data,
      menu?.data,
      menu?.__data?.data,
    ];

    for (const source of sources) {
      const endpoint = findRemoveEndpoint(source);
      if (endpoint) return endpoint;
    }

    return null;
  }

  function findRemoveEndpoint(value, seen = new Set(), depth = 0) {
    if (!value || typeof value !== "object" || depth > 12 || seen.has(value)) {
      return null;
    }

    seen.add(value);

    const endpoint = value.playlistEditEndpoint;
    if (endpoint?.playlistId === WATCH_LATER_PLAYLIST_ID) {
      const action = endpoint.actions?.find(
        (candidate) =>
          candidate.action === REMOVE_ACTION && typeof candidate.setVideoId === "string",
      );

      if (action) {
        return {
          playlistId: WATCH_LATER_PLAYLIST_ID,
          actions: [{ ...action }],
        };
      }
    }

    for (const child of Object.values(value)) {
      const match = findRemoveEndpoint(child, seen, depth + 1);
      if (match) return match;
    }

    return null;
  }

  async function createHeaders(config, context) {
    const authorization = await createAuthorization();
    if (!authorization) {
      throw new Error("A signed-in YouTube session is required.");
    }

    const headers = {
      Authorization: authorization,
      "Content-Type": "application/json",
      "X-Goog-AuthUser": String(config.get("SESSION_INDEX") ?? 0),
      "X-Goog-Visitor-Id": String(context.client?.visitorData ?? ""),
      "X-Origin": window.location.origin,
      "X-YouTube-Bootstrap-Logged-In": "true",
      "X-YouTube-Client-Name": String(
        config.get("INNERTUBE_CONTEXT_CLIENT_NAME") ?? 1,
      ),
      "X-YouTube-Client-Version": String(
        config.get("INNERTUBE_CONTEXT_CLIENT_VERSION") ??
          context.client?.clientVersion ??
          "",
      ),
    };

    const delegatedSessionId = config.get("DELEGATED_SESSION_ID");
    if (delegatedSessionId) headers["X-Goog-PageId"] = delegatedSessionId;

    return headers;
  }

  function getCookie(name) {
    const prefix = `${name}=`;
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));

    return cookie?.slice(prefix.length);
  }

  async function createAuthorization() {
    const authCookie = [
      ["SAPISID", "SAPISIDHASH"],
      ["__Secure-1PAPISID", "SAPISID1PHASH"],
      ["__Secure-3PAPISID", "SAPISID3PHASH"],
    ]
      .map(([name, scheme]) => [getCookie(name), scheme])
      .find(([value]) => value);

    if (!authCookie) return null;

    const [value, scheme] = authCookie;
    const timestamp = Math.floor(Date.now() / 1_000);
    const input = `${timestamp} ${value} ${window.location.origin}`;
    const digest = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(input),
    );
    const hash = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    return `${scheme} ${timestamp}_${hash}`;
  }

  function respond(id, ok, error) {
    window.postMessage(
      {
        source: RESPONSE_SOURCE,
        type: "remove-result",
        id,
        ok,
        error,
      },
      window.location.origin,
    );
  }
})();
