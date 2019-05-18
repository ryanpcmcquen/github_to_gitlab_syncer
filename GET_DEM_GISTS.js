'use strict'

const { gitHubToken, gitHubUser } = require('./.SECRETS')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { execSync } = require('child_process')

const flatten = (a) => a.reduce((x, y) => x.concat(y))

const ensureDirs = (username) => {
    const gistsDir = path.join(process.cwd(), 'gists')

    if (!fs.existsSync(gistsDir)) {
        fs.mkdirSync(gistsDir)
    }

    const userDir = path.join(gistsDir, username)

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir)
    }
}

const allOfEm = []

const getGists = async (username, count) => {
    await fetch(
        `https://api.github.com/users/${username}/gists?page=${count}`,
        {
            headers: {
                Authorization: `token ${gitHubToken}`
            }
        }
    )
        .then((res) => res.json())
        .then(async (json) => {
            if (json.length) {
                allOfEm.push(
                    json.filter(repo => repo.public)
                )
                await getGists(username, ++count)
            } else {
                return allOfEm
            }
        })
        .catch((err) => console.error(err))
}

const rmdirSync = (dir) => {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file, index) {
            const curPath = dir + '/' + file
            if (fs.lstatSync(curPath).isDirectory()) {
                rmdirSync(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(dir)
    }
}

const syncGist = (username, gist) => {
    const title = gist.description || Object.keys(gist.files)[0]
    const cleanTitle = title.replace(/[^\w]/g, '_')

    const gistDir = path.join(process.cwd(), 'gists', username, cleanTitle)

    if (fs.existsSync(gistDir)) {
        rmdirSync(gistDir)
    }

    fs.mkdirSync(gistDir)

    execSync(`git clone https://gist.github.com/${gist.id} ${gistDir}`, {
        cwd: process.cwd()
    })

    const gistDirGitDir = path.join(gistDir, '.git')
    rmdirSync(gistDirGitDir)
}

const syncUser = async (username) => {
    ensureDirs(username)

    await getGists(username, 0)

    flatten(allOfEm).forEach((gist) => {
        syncGist(username, gist)
    })
}

syncUser(gitHubUser)
