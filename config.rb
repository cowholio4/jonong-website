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


activate :blog do |blog|
  # set options on blog
  blog.layout = 'blog_layout'
  blog.permalink = "/blog/:year/:month/:day/:title.html"
  blog.sources = "blog/:year-:month-:day-:title.html"
  blog.summary_separator = /SPLIT_SUMMARY_BEFORE_THIS/
  # blog.publish_future_dated = true
  blog.custom_collections = {
    category: {
      link: "/blog/categories/:category.html",
      template: "/category.html"
    }
  }
end

activate :directory_indexes

# redirect "/photo_albums/11_207822968", to: "/photo_albums/instagram"
instagram_photos = @app.data.photos.data.select{|x| x['attributes']['user_url'] == 'https://instagram.com/cowholio4'}

proxy "/photo_albums.html", "/templates/photo_album.html", :locals => {photos: instagram_photos} 
instagram_photos.each do |photo|
  proxy "/photo_albums/instagram/photos/11_#{photo['attributes']['vendor_id']}.html", "/templates/photo.html", :locals => { photo: photo['attributes'] }
  proxy "/photo_albums/11_207822968/photos/11_#{photo['attributes']['vendor_id']}.html", "/templates/photo.html", :locals => { photo: photo['attributes'] }
end


ignore "/templates/*"

activate :gzip
page "/feed.xml", layout: false

# AWS credentials are only available on branches that deploy (see
# .circleci/config.yml). A plain `middleman build` never touches s3_sync, so
# fall back to nil rather than raising when no credentials are configured.
aws_credentials = if ENV.has_key? 'AWS_ACCESS_KEY_ID'
  Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'], ENV['AWS_SESSION_TOKEN'])
else
  begin
    Aws::SharedCredentials.new().credentials
  rescue Aws::Errors::NoSuchProfileError
    nil
  end
end

activate :s3_sync do |s3_sync|
  s3_sync.bucket = 'www-cowholio4-com'
  s3_sync.region = 'us-west-2'     # The AWS region for your bucket.
  s3_sync.index_document = 'index.html'
  s3_sync.error_document = '404.html'
  s3_sync.prefer_gzip = true
  s3_sync.aws_access_key_id = aws_credentials&.access_key_id
  s3_sync.aws_secret_access_key = aws_credentials&.secret_access_key
  s3_sync.aws_session_token = aws_credentials&.session_token
  s3_sync.delete = false
end

default_caching_policy max_age:(60 * 60 * 24 * 365)
caching_policy 'text/html', max_age: 0, must_revalidate: true

# Build-specific configuration
configure :build do
  config[:host] = "https://www.cowholio4.com"

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
