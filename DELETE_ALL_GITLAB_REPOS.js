const fetch = require('node-fetch')
const { gitLabToken, gitLabUser } = require('./.SECRETS')
const gitLabApi = 'https://gitlab.com/api/v4'

fetch(`${gitLabApi}/users/${gitLabUser}/projects?private_token=${gitLabToken}`)
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
        json.map((project) => project.id).forEach((projectId) => {
            fetch(
                `${gitLabApi}/projects/${projectId}?private_token=${gitLabToken}`,
                {
                    method: 'DELETE'
                }
            )
                .then((res) => res.json())
                .then((json) => console.log(json))
                .catch((err) => console.error(err))
        })
    })
    .catch((err) => console.error(err))
