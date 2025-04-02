module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("posts");
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
