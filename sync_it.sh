#!/bin/sh
git pull --all
node GET_DEM_GISTS.js
(
    cd gists/ryanpcmcquen
    git add -A :/
    git commit -sm "$(date)"
    git push --force
)
node SYNC_ANY_GITHUBS_NOT_ON_GITLAB.js
node FIX_MIRROR_SETTINGS_FOR_ALL_GITLABS.js
