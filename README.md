# Setup Dev environmnent

# Install RVM

```
sudo aptitude install -y -q build-essential 
sudo aptitude build-dep -y -q rails rubygems ruby-mysql
sudo gpg --list-keys  409B6B1796C275462A1703113804BB82D39DC0E3 || sudo gpg --keyserver hkp://keys.gnupg.net --recv-keys 4. 409B6B1796C275462A1703113804BB82D39DC0E3
\curl -sSL https://get.rvm.io | bash -s stable --ruby
```

# Install dependencies

```
bundle install
```

# Running the dev server

```
bundle exec middleman server --bind-address=0.0.0.0 -p 3000
```

# Publishing a blog guidelines

## Frontmatter

Every post needs `title`, `date`, `description`, and `author: Jason Pope`. If an AI model was used to help write the post, add `ai_model:` with the model name (e.g. `Claude Sonnet 5`) — omit the field entirely for posts written without AI assistance.

## Check to make sure social media sharing previews look ok

header - the image for the header of the blog 960 x 221
pull_image is the photo used in previews; must be at least 1200 (w) and 627 (h) pixels

https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin?lang=en

* Validate Twitter Card https://cards-dev.twitter.com/validator 
* Validate Google Data https://search.google.com/structured-data/testing-tool/
* Validate Facebook Open Graph https://developers.facebook.com/tools/debug/

