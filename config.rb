require 'slim'
set :frontmatter_extensions, %w(.html .slim)

set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true, tables: true, autolink: true, with_toc_data: true, no_intra_emphasis: true

activate :external_pipeline,
         name: :css,
         command: build? ? 'npm run build:css' : 'npm run watch:css',
         source: 'builds/stylesheets',
         latency: 1

activate :external_pipeline,
         name: :esbuild,
         command: 'npm run build',
         source: 'builds/javascripts',
         latency: 1

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page '404.html', directory_index: false

activate :asset_hash do |asset_hash|
  asset_hash.sources = %w(.css .htm .html .js .php .xhtml .xml)
  # asset_hash.ignore = "images/resources/*"
end
activate :meta_tags

activate :directory_indexes
activate :gzip

# NOTE: s3_sync / CircleCI deploy are intentionally left unconfigured after
# migrating this codebase from cowholio4-website. Set a real bucket, AWS
# OIDC role, and host below (and in .circleci/config.yml) before enabling
# deploys — the previous values pointed at cowholio4's production bucket.
#
# activate :s3_sync do |s3_sync|
#   s3_sync.bucket = 'TODO-set-jonong-website-bucket'
#   s3_sync.region = 'us-west-2'
#   s3_sync.index_document = 'index.html'
#   s3_sync.error_document = '404.html'
#   s3_sync.prefer_gzip = true
#   s3_sync.delete = false
# end
#
# default_caching_policy max_age:(60 * 60 * 24 * 365)
# caching_policy 'text/html', max_age: 0, must_revalidate: true

# Build-specific configuration
configure :build do
  config[:host] = "https://www.jonongmusic.com"

  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
  config[:host] = "http://127.0.0.1:3000"
end

helpers do
  def image_url(source)
    config[:host] + image_path(source)
  end
end
