const fetch = require('node-fetch')
const { gitHubToken, gitLabToken, user } = require('./.SECRET')

const flatten = (a) => a.reduce((x, y) => x.concat(y))

let gitHubRepos = []
const getGitHubRepos = (count) =>
    fetch(`https://api.github.com/users/${user}/repos?type=all&page=${count}`, {
        headers: {
            Authorization: `token ${gitHubToken}`
        }
    })
        .then((res) => res.json())
        .then((setOfGitHubRepos) => {
            if (setOfGitHubRepos.length) {
                console.log(`Page ${count} complete.`)
                gitHubRepos.push(
                    setOfGitHubRepos.map((repo) =>
                        repo.name.replace(/[^A-Za-z0-9]/g, '')
                    )
                )
                getGitHubRepos(++count)
            } else {
                console.log([...new Set(flatten(gitHubRepos))])
            }
        })
        .catch((err) => console.error(err))
getGitHubRepos(0)

let gitLabProjects = []
const getGitLabProjects = (count) =>
    fetch(`https://gitlab.com/api/v4/users/${user}/projects?page=${count}`)
        .then((res) => res.json())
        .then((setOfGitLabProjects) => {
            if (setOfGitLabProjects.length) {
                console.log(`Page ${count} complete.`)
                gitLabProjects.push(
                    setOfGitLabProjects.map((repo) =>
                        repo.name.replace(/[^A-Za-z0-9]/g, '')
                    )
                )

                getGitLabProjects(++count)
            } else {
                console.log([...new Set(flatten(gitLabProjects))])
            }
        })
        .catch((err) => console.error(err))
getGitLabProjects(0)

//`https://gitlab.com/api/v4/projects/${projectId}/?private_token=${gitLabToken}`,
