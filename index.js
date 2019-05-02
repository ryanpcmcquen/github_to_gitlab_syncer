const fetch = require('node-fetch')
const { gitHubToken, gitLabToken, user } = require('./.SECRETS')

const flatten = (a) => a.reduce((x, y) => x.concat(y))

let gitHubRepos = []
const getGitHubRepos = async (count) =>
    await fetch(
        `https://api.github.com/users/${user}/repos?type=all&page=${count}`,
        {
            headers: {
                Authorization: `token ${gitHubToken}`
            }
        }
    )
        .then((res) => res.json())
        .then(async (setOfGitHubRepos) => {
            if (setOfGitHubRepos.length) {
                console.log(`Page ${count} complete.`)
                gitHubRepos.push(
                    setOfGitHubRepos.map((repo) =>
                        repo.name.replace(/[^A-Za-z0-9]/g, '')
                    )
                )
                await getGitHubRepos(++count)
            } else {
                let res = [...new Set(flatten(gitHubRepos))]
                await res
            }
        })
        .catch((err) => console.error(err))
getGitHubRepos(0)

let gitLabProjects = []
const getGitLabProjects = async (count) =>
    await fetch(
        `https://gitlab.com/api/v4/users/${user}/projects?page=${count}`
    )
        .then((res) => res.json())
        .then(async (setOfGitLabProjects) => {
            if (setOfGitLabProjects.length) {
                console.log(`Page ${count} complete.`)
                gitLabProjects.push(
                    setOfGitLabProjects.map((repo) =>
                        repo.name.replace(/[^A-Za-z0-9]/g, '')
                    )
                )

                await getGitLabProjects(++count)
            } else {
                let res = [...new Set(flatten(gitLabProjects))]
                await res
            }
        })
        .catch((err) => console.error(err))

const getIt = async (x) => await x
let glr = getIt(getGitLabProjects(0))
console.log(glr.then((res) => res.text()).then((j) => j))

//`https://gitlab.com/api/v4/projects/${projectId}/?private_token=${gitLabToken}`,
