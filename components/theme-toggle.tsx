"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("reyy-theme", nextTheme);
  }

  return (
    <button
      className="control-button"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <span className="control-label-stack" aria-hidden="true">
        <span className="control-label">THEME</span>
        <span className="control-label-hover">THEME</span>
      </span>
    </button>
  );
}
