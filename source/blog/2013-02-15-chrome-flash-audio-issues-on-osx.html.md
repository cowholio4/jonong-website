---
title: Chrome Flash Audio Issues on OSX 
author: Jason Pope
date: 2013-02-15 00:00 PST
category: Troubleshooting
archived: true
description:  
---
For the last 3-5 months I have been having issues hearing audio with Flash on Chrome. So many times I would go to YouTube, see the video and hear no sound. My solution at the time was to "force close" Chrome and reopen. I sent numerous bug reports and lurked in the Google Chrome forums to see what other people did to resolve similiar issues. None of that helped.

Today, I decided I had enough and determined to resolve this issue once and for all. I build software and there is no excuse for me just to settle on restarting Chrome just to hear audio. The solution seems pretty counter intuivate, espeically considering the work Google has done to isolate Chrome from Flash instability.
 
The solution is disable Chrome's Pepper Flash player and enable Adobe's Flash player. Yes, Google has gone to great lengths to make Chrome more stable and less dependent on external plugins.... but Pepper doesn't work on my laptops.

Here's a step by step howto:

1. Go to chrome://plugins/
2. Click the "+Details" to show all the details.
3. Go to the "Adobe Flash Player section and disable the Pepper plugin.
4. Your settings should look something like the following photo.
