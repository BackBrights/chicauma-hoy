import { readFileSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, test } from "vitest";

function buildDom() {
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  });

  dom.window.document.dispatchEvent(
    new dom.window.Event("DOMContentLoaded", { bubbles: true })
  );

  return dom;
}

describe("renderBusinesses", () => {
  test("ordena por nombre de A a Z", () => {
    const dom = buildDom();
    const app = dom.window.__appTestExports;

    app.resetFilters();
    app.setOrder("nombre");
    app.renderBusinesses();

    const titles = [
      ...dom.window.document.querySelectorAll(".card-title")
    ].map((el) => el.textContent.trim());
    const sorted = [...titles].sort((a, b) => a.localeCompare(b, "es"));

    expect(titles).toEqual(sorted);
  });

  test("filtra por categoría", () => {
    const dom = buildDom();
    const app = dom.window.__appTestExports;

    app.resetFilters();
    app.setCategory("comida");
    app.renderBusinesses();

    const subtitles = [
      ...dom.window.document.querySelectorAll(".card-subtitle")
    ].map((el) => el.textContent.trim());

    expect(subtitles.length).toBeGreaterThan(0);
    expect(
      subtitles.every((text) => text.toLowerCase().includes("comida"))
    ).toBe(true);
  });
});
