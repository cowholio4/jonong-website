---
title: rvm ruby-1.9.3.p0 on OSX 10.6.8 ssl issues
author: Jason Pope 
date: 2012-01-21 00:00 PST
category: Development
archived: true
description:  
---
I was getting a segmentation fault after upgrading to ruby 1.9.3 and Rails 3.2.0 and it was driving me crazy. 

```
/Users/cowholio4/.rvm/rubies/ruby-1.9.3-p0/lib/ruby/1.9.1/net/http.rb:799: [BUG] Segmentation fault
```


To fix this I rebuilt ruby with a specifield openssl directory. 

```bash 
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.rvm/bin # keep MacPorts out of PATH
rvm pkg install iconv
rvm pkg install openssl
rvm install  ruby-1.9.3-p0 --with-openssl-dir=~/.rvm/usr --with-iconv-dir=~/.rvm/usr
rvm ruby-1.9.3-p0 
ruby -ropenssl -e 'p OpenSSL::Digest::Digest.new("sha256")' # verify OpenSSL works
```

But that only got me so far. Next I was having issues with the ssl certificates.

```
OpenSSL::SSL::SSLError (SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed):
```

To fix this you need to download the certificates to the path you specified to RVM.

``` 
cd ~/.rvm/usr/ssl/
curl -O http://curl.haxx.se/ca/cacert.pem
mv cacert.pem cert.pem
```
