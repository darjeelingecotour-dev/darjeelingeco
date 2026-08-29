import yaml from "js-yaml";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // --- Plugins ---
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // --- YAML Data Support ---
  eleventyConfig.addDataExtension("yaml,yml", (contents) =>
    yaml.load(contents)
  );

  // --- Passthrough Copy (static assets) ---
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/data": "assets/data" });

  // --- Watch Targets ---
  eleventyConfig.addWatchTarget("./src/assets/css/");
  eleventyConfig.addWatchTarget("./src/assets/js/");

  // --- Custom Filters ---

  // Indian Rupee currency formatting
  eleventyConfig.addFilter("currency", (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  });

  // Format number with commas (Indian style)
  eleventyConfig.addFilter("numberFormat", (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  });

  // Star rating display
  eleventyConfig.addFilter("stars", (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
  });

  // Slugify filter
  eleventyConfig.addFilter("slugify", (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  });

  // Limit array items
  eleventyConfig.addFilter("limit", (arr, limit) => {
    return arr.slice(0, limit);
  });

  // --- Collections ---

  // All tours collection, sorted by order field
  eleventyConfig.addCollection("allTours", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/tours/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
  });

  // Featured tours (first 6)
  eleventyConfig.addCollection("featuredTours", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/tours/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
      .slice(0, 6);
  });

  // --- Directory Configuration ---
  return {
    pathPrefix: "/darjeelingeco/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
