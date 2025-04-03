module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");

  eleventyConfig.addCollection("posts", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("posts/*.md");
    console.log(`Found ${posts.length} posts in collection`);
    return posts;
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk"
  };
};
