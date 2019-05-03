const fetch = require('node-fetch')
const FormData = require('form-data')
const { gitLabToken, user } = require('./.SECRETS')
const gitLabApi = 'https://gitlab.com/api/v4'

fetch(`${gitLabApi}/users/${user}/projects?private_token=${gitLabToken}`)
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
        json.map((project) => project.id).forEach((projectId) => {
            const formData = new FormData()
            formData.append('mirror_overwrites_diverged_branches', 'true')
            // I don't really care about this setting, but
            // GitLab has a bug that will not let you
            // only change the mirror setting.
            formData.append('snippets_enabled', 'true')
            fetch(
                `${gitLabApi}/projects/${projectId}?private_token=${gitLabToken}`,
                {
                    method: 'PUT',
                    body: formData
                }
            )
                .then((res) => res.json())
                .then((json) => console.log(json))
                .catch((err) => console.error(err))
        })
    })
    .catch((err) => console.error(err))
