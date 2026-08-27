(() => {
  "use strict";

  const VIDEO_SELECTOR = "ytd-playlist-video-renderer";
  const BUTTON_CLASS = "ypc-remove-button";
  const REMOVING_CLASS = "ypc-removing";
  const REQUEST_SOURCE = "youtube-playlist-cleaner:content";
  const RESPONSE_SOURCE = "youtube-playlist-cleaner:page";
  const REQUEST_TIMEOUT_MS = 15_000;

  const pendingRequests = new Map();
  let toastTimer;

  function isWatchLaterPage() {
    const url = new URL(window.location.href);
    return url.pathname === "/playlist" && url.searchParams.get("list") === "WL";
  }

  function createActionButton(className, label, pathData) {
    const button = document.createElement("button");
    button.className = `ypc-action-button ${className}`;
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);

    svg.append(path);
    button.append(svg);
    return button;
  }

  function createRemoveButton() {
    return createActionButton(
      BUTTON_CLASS,
      "Remove from Watch Later",
      "M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21Zm2-4h2V8H9Zm4 0h2V8h-2Z",
    );
  }

  function getMenuContainer(video) {
    return video.querySelector("#menu ytd-menu-renderer, #menu");
  }

  function getNativeMenuButton(video) {
    const menu = getMenuContainer(video);
    if (!menu) return null;

    return (
      menu.querySelector("yt-icon-button button") ||
      menu.querySelector(`button:not(.${BUTTON_CLASS})`)
    );
  }

  function decorateVideo(video) {
    if (!(video instanceof HTMLElement)) return;

    const menu = getMenuContainer(video);
    if (!menu || !getNativeMenuButton(video)) return;

    if (!video.querySelector(`.${BUTTON_CLASS}`)) {
      const removeButton = createRemoveButton();
      removeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        startRemoval(video);
      });
      menu.prepend(removeButton);
    }

  }

  function decorateVideos(root = document) {
    if (!isWatchLaterPage()) return;

    if (root instanceof Element) {
      if (root.matches(VIDEO_SELECTOR)) decorateVideo(root);
      decorateVideo(root.closest(VIDEO_SELECTOR));
    }

    root.querySelectorAll?.(VIDEO_SELECTOR).forEach(decorateVideo);
  }

  function startRemoval(video) {
    if (video.classList.contains(REMOVING_CLASS)) return;

    video.classList.add(REMOVING_CLASS);
    setButtonsDisabled(video, true);

    issueRemoveRequest(video)
      .then(() => video.remove())
      .catch((error) => rollbackRemoval(video, error.message));
  }

  function issueRemoveRequest(video) {
    const id = crypto.randomUUID();
    video.dataset.ypcRequestId = id;

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pendingRequests.delete(id);
        delete video.dataset.ypcRequestId;
        reject(new Error("Timed out waiting for YouTube."));
      }, REQUEST_TIMEOUT_MS);

      pendingRequests.set(id, { resolve, reject, timer, video });
      window.postMessage(
        { source: REQUEST_SOURCE, type: "remove", id },
        window.location.origin,
      );
    });
  }

  function setButtonsDisabled(video, disabled) {
    video
      .querySelectorAll(".ypc-action-button")
      .forEach((button) => (button.disabled = disabled));
  }

  function rollbackRemoval(video, reason) {
    if (!video.isConnected) return;

    video.classList.remove(REMOVING_CLASS);
    setButtonsDisabled(video, false);
    showToast(reason || "Could not remove this video. Please try again.");
  }

  function showToast(message) {
    document.querySelector(".ypc-toast")?.remove();
    window.clearTimeout(toastTimer);

    const toast = document.createElement("div");
    toast.className = "ypc-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.append(toast);

    toastTimer = window.setTimeout(() => toast.remove(), 4_000);
  }

  function syncPage() {
    if (isWatchLaterPage()) {
      decorateVideos();
      return;
    }

    document.querySelectorAll(".ypc-action-button").forEach((button) => button.remove());
  }

  window.addEventListener("message", (event) => {
    if (
      event.source !== window ||
      event.data?.source !== RESPONSE_SOURCE ||
      event.data?.type !== "remove-result"
    ) {
      return;
    }

    const pending = pendingRequests.get(event.data.id);
    if (!pending) return;

    pendingRequests.delete(event.data.id);
    window.clearTimeout(pending.timer);
    delete pending.video.dataset.ypcRequestId;

    if (event.data.ok) {
      pending.resolve();
    } else {
      pending.reject(new Error(event.data.error || "YouTube rejected the request."));
    }
  });

  const observer = new MutationObserver((mutations) => {
    if (!isWatchLaterPage()) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) decorateVideos(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("yt-navigate-finish", syncPage);
  syncPage();
})();
