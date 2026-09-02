import yaml from "js-yaml";


export default function (eleventyConfig) {
  const pathPrefix = "/";

  // Rewrite supported HTML URLs using the active path prefix.


  // YAML data support.
  eleventyConfig.addDataExtension(
    "yaml,yml",
    (contents) => yaml.load(contents)
  );

  // Static assets.
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets/js": "assets/js",
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets/data": "assets/data",
  });

  // Watch source assets during local development.
  eleventyConfig.addWatchTarget(
    "./src/assets/css/"
  );

  eleventyConfig.addWatchTarget(
    "./src/assets/js/"
  );

  // Indian Rupee currency formatting.
  eleventyConfig.addFilter(
    "currency",
    (value) => {
      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        return "";
      }

      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
  );

  // Indian number formatting.
  eleventyConfig.addFilter(
    "numberFormat",
    (value) => {
      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        return "";
      }

      return new Intl.NumberFormat(
        "en-IN"
      ).format(numericValue);
    }
  );

  // Star rating display.
  // Unicode escapes avoid character-encoding corruption.
  eleventyConfig.addFilter(
    "stars",
    (rating) => {
      const numericRating = Math.max(
        0,
        Math.min(5, Number(rating) || 0)
      );

      const roundedRating = Math.round(
        numericRating
      );

      const fullStars = "\u2605".repeat(
        roundedRating
      );

      const emptyStars = "\u2606".repeat(
        5 - roundedRating
      );

      return fullStars + emptyStars;
    }
  );

  // URL-safe slug generation.
  eleventyConfig.addFilter(
    "slugify",
    (value) => {
      return String(value || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }
  );

  // Limit the number of returned array items.
  eleventyConfig.addFilter(
    "limit",
    (items, maximum) => {
      if (!Array.isArray(items)) {
        return [];
      }

      return items.slice(
        0,
        Number(maximum) || 0
      );
    }
  );

  // All tour pages, ordered by front-matter order.
  eleventyConfig.addCollection(
    "allTours",
    (collectionApi) => {
      return collectionApi
        .getFilteredByGlob(
          "src/tours/*.md"
        )
        .sort((firstTour, secondTour) => {
          return (
            (firstTour.data.order || 99) -
            (secondTour.data.order || 99)
          );
        });
    }
  );

  // First six tours for featured sections.
  eleventyConfig.addCollection(
    "featuredTours",
    (collectionApi) => {
      return collectionApi
        .getFilteredByGlob(
          "src/tours/*.md"
        )
        .sort((firstTour, secondTour) => {
          return (
            (firstTour.data.order || 99) -
            (secondTour.data.order || 99)
          );
        })
        .slice(0, 6);
    }
  );

  return {
    pathPrefix,

    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },

    templateFormats: [
      "md",
      "njk",
      "html",
    ],

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}


