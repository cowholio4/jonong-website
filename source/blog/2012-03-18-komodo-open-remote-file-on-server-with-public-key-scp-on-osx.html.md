---
title: Komodo Open Remote File on Server with Public Key SCP on OSX 
author: Jason Pope
date: 2012-03-18 00:00 PST
category: Development
archived: true
description:  
---
By default, Komodo does not work well with public key only SSH sessions. 

I was getting this error every time I tried to open a remote file on a specific server:

```
Remote SSH server does not allow password authentication. Allowed types are: 'publickey'
```

Passwordless SCP/SSH is supported using ssh-agent. Fortunately by default, ssh-agent should be running on your OSX Machine.
 
Here's how to get it working:

Open up the terminal and type "ssh-agent" You should get output similiar to this: 

```
SSH_AUTH_SOCK=/tmp/ssh-bHP9MZhRQz/agent.5433; export SSH_AUTH_SOCK;
SSH_AGENT_PID=5434; export SSH_AGENT_PID;
echo Agent pid 5434;
```

Now goto Komodo -> Preferences -> Enviroment and add the enviroment variables from your ssh-agent.
 

Example Environment SettingsExample Environment Settings

![My image description](/blog/2012/03/18/komodo-open-remote-file-on-server-with-public-key-scp-on-osx/komodo_example.jpg "My image description")


Now try and it should work. 
