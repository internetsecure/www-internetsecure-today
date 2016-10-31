+++
date        = "2016-10-27T11:27:27-04:00"
title       = "How I had access to the sourcecode of more than 10.000 websites in just a few hours."
slug        = "sourcecode-access-through-public-available-git-repository"
+++

Using git as a deployment tool is very common nowadays. There are a lot misconfigurations, allowing complete and full downloads of git repositories. Often this has been configured within the Continuous Integration workflow. Some people claim you can only download partial repositories (eg not the packed files), but thats simply not true. The downloaded repositories will contain the source code of the website or application, the configuration files, dependencies, and the commit history. Some of the tested websites do have enabled access to the .git folder on purpose. This is either because they are using some kind of static publishing like github pages or because they don't mind other having access to their opensource website.

You can test if your applications repository has been deployed and is publicly accessible by downloading the file /.git/config. If you will get a response containing the configuration of the repository, you are at risk of having the complete repository being downloadable (including commit messages, history, configurations).

We've created a mass scanner ANAM, which stands for Automated Network Analysis en Mass sends out raw tcp packets to each server, and will analyse the result upon receiving the packet. The benefit of this method is that you're able to run a lot more requests in parallel, allowing the network to do its work. This tool is great for automated discovery of vulnerabilities on a broad and large amount of hosts. 

Currently ANAM supports both http and https protocols. At the moment we're just scanning for one vulnerability at a time, but we love ANAM and are improving her daily.

The Alexa top 1 Million list has been used for the automated discovery, future scans will use other lists as well. 

Each vulnerable site will be automatically emailed to its abuse and whois records, disclosing the vulnerability and referencing to the draft publication of this article. We've acknowledged them about the publication date of the article (7th of October). Because of the amount of vulnerabilities discovered, we couldn't responsible disclose each and every vulnerability individually. 

#### Risks

* complete source code download, allowing other vulnerabilities to be found more easily
* download of configuration files, containing oauth configuration, database configurations, passwords etc.
* complete commit history of the source code including logs
* all the rest that has been committed to the repository
* company secrets

#### Mitigation

The fix is easy, just disable your configuration to not serve hidden (.git / .svn) files. For convenience we've included the following configuration for Apache and Nginx. There is also some bad news though, because you cannot be certain who had access to your sourcecode, you need to renew all secrets (oauth tokens, passwords) if those where in your repository. 

For Apache (in .htaccess):
```
RewriteEngine on

RewriteCond %{THE_REQUEST} ^.*/\.
RewriteRule ^(.*)$ - [R=404]
```

For Apache (in /etc/apache2/apache2.conf thanks to Raz0rwire):
```
<Directorymatch "^/.*/\..*/">
    Order deny,allow
    Deny from all
</Directorymatch>
```

And for Nginx:
```
# Deny all attempts to access hidden files
# such as .htaccess, .htpasswd, .DS_Store (Mac).
location ~ /\. {
deny all;
}
```

And for Lighttpd (thanks to fflores):
```
# Deny access to hidden files 
$HTTP["url"] =~ "/\." { 
    url.access-deny = ("") 
} 
```

The same configuration error allows download of svn repositories (using /.svn/entries).

#### Disclosure process

* 26 september found vulnerable sites
* 27 september t/m 21 october mass responsible disclosure
* 31 october public disclosure

#### Mass disclosure

Every domain we've found with the information disclosure, we've sent the following email.

> During our research project, which you can read about in draft at http://blog.dutchcoders.io/p/72673b02-dbfb-491a-9995-6b03bf58fd74/, we've encountered that *|DOMAIN|* is vulnerable to information disclosure, by allowing public download of the .git repository. This allows everyone to download the source code of your website and application. 

> The url *|URL|* contains the complete commit history, as this is proof that it is possible to download the complete repository itself. See attached two files, the git HEAD and LOG file. 

> Currently we are in progress to disclose our discoveries, and we're aiming to publish the article within two weeks. We are sending our findings to the info, security and abuse email addresses of the domain.

> We are sending this email in an automated way, and we are aware that in some cases this is expected behaviour. If that is the case, you can ignore this message. We believe that this issue endangers your site, application and data that we needed to inform you.

> Let me know if you've got any questions,

#### Feedback

Everyone reacts differently on responsible disclosure. Some of the reactions:

**Vice Security**

> No matter though...thank you for pointing this issue out to us and for providing an excellent blog post to accompany it. We will work towards addressing this issue.

> While we currently don't offer monetary compensation, but we appreciate your efforts and 
> most importantly that you responsibly disclosed them to us. We'd like to send you some swag  >in the mean time...are you interested?

> Keep up the good work! 

**mariadb.com (10/10/2016)**

> Thank you for your report.  This has now been resolved and is no longer vulnerable. 

**glocals.com (10/10/2016)**

> Thanks a lot Remco, that's very helpful (and a bad surprise). We're on it. 

**pelago.events (10/10/2016)**

> I am writing to thank you for your advice.  My devops administrator confirmed your point and we are taking steps to tighten up access to our GIT activity.

**tinymixtapes.com (10/10/2016)**

> Hello, thanks so much for this information. Incredibly helpful. We've fixed it now, and just wanted to know that we really appreciate this heads-up email.

**nutanix.com (10/8/2016)**

> Thank you for letting us know (Nutanix) about the security vulnerability. We've intentionally combed the servers to attempt to find examples of those holes and we can't find any more using manual searching. Do you have a scanning script that you use to seek that out? I would love to either write my own or use yours to scan some other properties that I have that haven't been strangthened against this issue. 

> Thank you again for reaching out regarding that hole – I really appreciate it. 

**pulsepoint.com (10/8/2016)**

> This issue should be resolved now. Please don’t hesitate to reach out if you see anything else. 

**iDoctors**

> Thank you very much for your extremely precious information. We've immediately applied your solution and works great! 

**Gamer Launch**

> Thank you for the responsible disclosure. We've fixed this issue. We don't currently have a monetary bug bounty process, but I would be happy to send you t-shirts or gaming related swag if you could provide an address for shipping. Just let me know. 

**Akzo Nobel**

> 

**Truity.com**

> Thanks for letting us know. Our developers looked into this immediately and were able to find and fix a vulnerability.

**Eventmobi (eventmobi.com)**

>First off, I want to applaud your use of responsible disclosure and giving us time to react to this before it becomes a free-for-all in the wild. I also want to express my gratitude for your detailed blog post. I found it very easy to confirm your findings and explain to our engineers the threat and exploitability of this issue. 

> As your tool detected, we did indeed have issues with www.eventmobi.com which is our marketing site.
I read your blog post and as you can guess, this is one of our older deployments that use a tool in the git repo to deploy changes and also include the .git folder itself. This is something we've fixed and updated in our repo. We're also going back through our access logs to see how many times it has been accessed. Could you provide us with an idea of how often your tool may have done so?

> I'm also happy to report that I verified our 20 or so product team repositories for this issue. Thankfully, our CI process was designed to opt-in files, rather than use all files in the repository during the packaging process -- so unless we manually add .git to that list of opt-ins, it'll never make it out to our live systems!

> Like Vice Security from your blog post, EventMobi does not currently offer monetary compensation for disclosures, but hopefully it's clear we take them seriously. That said, if you're interested, we're willing to send you a bit of EventMobi swag if you'd like! I've also shared your blog post around my network of developers so they can get a leg up on this as well.

> Keep up the good work and looking forward to the results of this disclosure when it goes public!

**Knewton (knewton.com)**

> Thank you so much for the responsible disclosure! Our marketing site was in fact affected by this permissions issue and, with the help of your awesome blog post, we were able to quickly start the remediation process. Please let me know your t-shirt size and a good mailing address so we can get you some Knewton swag. 

> Again, we greatly appreciate the disclosure before going public. Awesome work. I look forward to reading your future blog posts. 

We haven't got any response to about 95% of the mails we've sent. Those sites are still vulnerable. We even had two complaints to be removed from the mailinglist. 

#### About cloning GIT repositories

On some occasions you can just easily clone the git repositories (depending on webserver configuration), for other occasions I’ve created an application that will download the files that it has access to.

```
/.git/config (contains the different branches and origins)
/.git/index (contains the git index)
/.git/HEAD (contains the current reference to HEAD)
/.git/packed-refs (contains the references to the packed archives)
/.git/logs/HEAD (contains all commit messages)
```

The key file is the /.git/ORIG_HEAD. That file contains the SHA1 address of the commit parent. From this file you can enumerate through all objects.

```
/.git/objects/{first two chars sha1}/{next chars of sha1}
u = requests.get(base + ‘/objects/’ + objh[:2] + ‘/’ + objh[2:])
```

The file is zlib compressed and the first 4 bytes contains the item identifier.
```
db =  zlib.decompress(body)
```

This can be:

* blob (a file)
* comm (a commit), commit information and reference to tree
* tree (a tree), reference to the files and references to objects in the tree

Git has the habit to create packed files of older objects now an then. Those can be found in the .git/packed-refs/ folder.

As an example you can see boost.org. This website is a clone of a public github repository, so in this case it is in purpose, or it cannot do any harm.

http://www.boost.org/.git/config
http://www.boost.org/.git/logs/HEAD
http://www.boost.org/.git/index


