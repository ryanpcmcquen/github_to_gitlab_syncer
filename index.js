const fetch = require('node-fetch')
const { token, user } = require('./.SECRET')

fetch(`https://api.github.com/users/ryanpcmcquen/repos`)
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        process.exit()
        return false
        json.map((project) => project.id).forEach((projectId) => {
            fetch(
                `https://gitlab.com/api/v4/projects/${projectId}/?private_token=${token}`,
                {
                    method: 'POST'
                }
            )
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                })
                .catch((err) => console.error(err))
        })
    })
    .catch((err) => console.error(err))
