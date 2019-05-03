# github_to_gitlab_syncer

Sync all your GitHubs to GitLab.

Hey there!

Maybe you are like me, and are weary of where GitHub is headed, but cannot completely divest, since having a GitHub account has many perks (its nearly essential for logging in to/using some really nifty dev tools). Its also a great place for people to discover your work. BUT, since GitLab has some incredible mirroring options, you may as well stick all your work over there, and give anyone else weary of GitHub a 'second option' for enjoying your work. This set of simple scripts will allow you to do just that.

The first script you should start with, is [`SYNC_ANY_GITHUBS_NOT_ON_GITLAB.js`](SYNC_ANY_GITHUBS_NOT_ON_GITLAB.js), once you fill in your `.SECRETS` file, run:

```
node SYNC_ANY_GITHUBS_NOT_ON_GITLAB.js
```

The script will compare what you have on GitHub and GitLab, and sync anything not on GitLab over to GitHub. It even does some name sanitation, as GitLab's GUI import process will occasionally take some liberties with naming. If you haven't kept GitLab clean, you can start with a _blank slate_, by running:

```
node DELETE_ALL_GITLAB_REPOS.js
```

**WARNING**, this will delete everything there, so please, USE IT AT YOUR OWN RISK!
