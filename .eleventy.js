module.exports = function(eleventyConfig) {
  // Copy static files (if any, like style.css)
  eleventyConfig.addPassthroughCopy("style.css");

  // Define the posts collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md");
  });

  return {
    dir: {
      input: ".",          // Input directory (root)
      output: "_site",     // Output directory (matches Netlify)
      includes: "_includes" // Templates directory
    },
    markdownTemplateEngine: "njk" // Use Nunjucks for Markdown
  };
};
