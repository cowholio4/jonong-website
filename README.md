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

# Check to make sure social media sharing previews look ok

https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin?lang=en

* Validate Twitter Card https://cards-dev.twitter.com/validator 
* Validate Google Data https://search.google.com/structured-data/testing-tool/
* Validate Facebook Open Graph https://developers.facebook.com/tools/debug/

