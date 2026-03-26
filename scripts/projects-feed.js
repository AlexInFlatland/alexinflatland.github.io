(function () {
  const list = document.querySelector("[data-video-list]");
  const sentinel = document.querySelector("[data-video-sentinel]");
  const button = document.querySelector("[data-load-more]");
  const endMessage = document.querySelector("[data-video-end]");
  const status = document.querySelector("[data-video-status]");
  const feedPath = document.documentElement.getAttribute("data-video-feed");
  const initialCount = Number(document.documentElement.getAttribute("data-initial-count") || "0");
  const batchSize = Number(document.documentElement.getAttribute("data-batch-size") || "5");

  if (!list || !sentinel || !button || !endMessage || !status || !feedPath) {
    return;
  }

  let items = [];
  let loadedCount = initialCount;
  let isLoading = false;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildCard(video) {
    const article = document.createElement("article");
    article.className = "project-summary-card";
    article.innerHTML = `
      <a class="project-summary-link" href="${escapeHtml(video.video_path)}">
        <img
          class="project-summary-image"
          src="${escapeHtml(video.image)}"
          alt="${escapeHtml(video.title)} thumbnail"
        >
        <div class="project-summary-copy">
          <p class="project-tag">${escapeHtml(video.published_label || "Video")}</p>
          <h2>${escapeHtml(video.title)}</h2>
          <p>${escapeHtml(video.summary)}</p>
          <span class="text-link">Open video page</span>
        </div>
      </a>
    `;
    return article;
  }

  function refreshStatus() {
    const total = items.length;
    if (!total) {
      status.textContent = "No videos found";
      button.hidden = true;
      endMessage.hidden = false;
      endMessage.textContent = "There are no videos to show yet.";
      sentinel.hidden = true;
      return;
    }

    const done = loadedCount >= total;
    status.textContent = done
      ? `Showing ${loadedCount} of ${total} videos`
      : `Showing ${loadedCount} of ${total} videos - scroll down for more`;
    button.hidden = done;
    endMessage.hidden = !done;
    sentinel.hidden = done;
    if (done) {
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("aria-disabled");
    }
  }

  function loadMore() {
    if (isLoading || loadedCount >= items.length) {
      return;
    }

    isLoading = true;
    const nextChunk = items.slice(loadedCount, loadedCount + batchSize);
    nextChunk.forEach((video) => {
      list.appendChild(buildCard(video));
    });
    loadedCount += nextChunk.length;
    refreshStatus();
    isLoading = false;
  }

  button.addEventListener("click", loadMore);

  fetch(feedPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load video feed");
      }
      return response.json();
    })
    .then((data) => {
      items = Array.isArray(data.videos) ? data.videos : [];
      refreshStatus();

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadMore();
          }
        }, { rootMargin: "240px 0px" });
        observer.observe(sentinel);
      }
    })
    .catch(() => {
      status.textContent = "Could not load more videos right now";
      button.hidden = true;
      endMessage.hidden = false;
      endMessage.textContent = "Could not load more videos right now.";
      sentinel.hidden = true;
    });
})();
