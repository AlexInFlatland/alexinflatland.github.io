(function () {
  const mount = document.querySelector("[data-site-header]");

  if (!mount) {
    return;
  }

  mount.outerHTML = `
    <header class="site-header">
      <a class="site-brand" href="/">
        <img
          class="site-brand-logo"
          src="/assets/media/mark-primary.png"
          alt="Alex in Flatland logo"
        >
        <span class="site-brand-text">
          <span class="site-brand-title">Alex in Flatland</span>
          <span class="site-brand-subtitle">Like Alice in Wonderland, only better.</span>
        </span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/contact.html">Contact</a>
        <a href="https://www.youtube.com/@AlexInFlatland" target="_blank" rel="noreferrer noopener">YouTube</a>
        <a href="https://github.com/AlexInFlatland" target="_blank" rel="noreferrer noopener">GitHub</a>
      </nav>
    </header>
  `;
}());
