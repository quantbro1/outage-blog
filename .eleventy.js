module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("posts");
  eleventyConfig.addPassthroughCopy("styles.css"); // Add this line
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk"
  };
};
