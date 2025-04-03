module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css"); // Copy CSS if you use it

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md");
  });

  return {
    dir: {
      input: ".",          // Root directory
      output: "_site",     // Matches Netlify publish directory
      includes: "_includes" // Templates directory
    },
    markdownTemplateEngine: "njk" // Use Nunjucks for Markdown
  };
};
