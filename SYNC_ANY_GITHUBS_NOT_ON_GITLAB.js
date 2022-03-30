const fetch = require("node-fetch");
const FormData = require("form-data");
const {
    gitHubToken,
    gitLabToken,
    gitHubUser,
    gitLabUser,
} = require("./.SECRETS");
const gitHubApi = "https://api.github.com";
const gitLabApi = "https://gitlab.com/api/v4";

const sanitizeName = (name) => name.replace(/[^A-Za-z0-9]/g, "").toLowerCase();

const getRepos = (obj) => {
    obj.options = obj.options || {};
    let repos = {};
    const getSet = (count) =>
        new Promise((resolve, reject) =>
            fetch(obj.url(count), obj.options)
                .then((res) => res.json())
                .then((set) => {
                    if (set.length) {
                        console.log(`Page ${count} complete.`);
                        set.forEach((repo) => {
                            repos[sanitizeName(repo.name)] = {
                                default_branch: repo.default_branch,
                                clone_url: repo.clone_url || null,
                                name: repo.name,
                                visibility: repo.private ? "private" : "public",
                            };
                            return repos;
                        });
                        return resolve(getSet(++count));
                    } else {
                        return resolve(repos);
                    }
                })
                .catch((err) => console.error(err))
        );
    return getSet(0);
};

// GitHub:
getRepos({
    url: (count) =>
        `${gitHubApi}/users/${gitHubUser}/repos?type=all&page=${count}`,
    options: {
        headers: {
            Authorization: `token ${gitHubToken}`,
        },
    },
})
    .then((gitHubRepos) => {
        // GitLab:
        getRepos({
            url: (count) =>
                `${gitLabApi}/users/${gitLabUser}/projects?page=${count}`,
        })
            .then((gitLabRepos) => {
                // console.log('GitHub: ', gitHubRepos)
                // console.log('GitLab: ', gitLabRepos)

                const cleanGitHubRepos = Object.keys(gitHubRepos);
                const cleanGitLabRepos = Object.keys(gitLabRepos);
                const notOnGitLab = [
                    ...new Set(
                        cleanGitHubRepos.filter(
                            (x) => !cleanGitLabRepos.includes(x)
                        )
                    ),
                ];
                // console.log('Not on GitLab: ', notOnGitLab)

                notOnGitLab.forEach((repo) => {
                    const formData = new FormData();

                    formData.append(
                        "default_branch",
                        `${gitHubRepos[repo].default_branch}`
                    );
                    formData.append(
                        "import_url",
                        `${gitHubRepos[repo].clone_url}`
                    );
                    formData.append("mirror", "true");
                    formData.append("mirror_trigger_builds", "true");
                    formData.append(
                        "mirror_overwrites_diverged_branches",
                        "true"
                    );
                    formData.append("name", `${gitHubRepos[repo].name}`);
                    formData.append("path", `${gitHubRepos[repo].name}`);
                    formData.append(
                        "visibility",
                        `${gitHubRepos[repo].visibility}`
                    );

                    fetch(`${gitLabApi}/projects`, {
                        method: "POST",
                        headers: {
                            "Private-Token": gitLabToken,
                        },
                        body: formData,
                    })
                        .then((res) => res.json())
                        .then((json) => console.log(json))
                        .catch((err) => console.error(err));
                });
            })
            .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
