const fetch = require("node-fetch");
const FormData = require("form-data");
const { gitLabToken, gitLabUser } = require("./.SECRETS");
const gitLabApi = "https://gitlab.com/api/v4";

const flatten = (a) => a.reduce((x, y) => x.concat(y));

const allOfEm = [];
const getSet = async (count) => {
    await fetch(
        `${gitLabApi}/users/${gitLabUser}/projects?private_token=${gitLabToken}&page=${count}`
    )
        .then((res) => res.json())
        .then(async (json) => {
            if (json.length) {
                allOfEm.push(json);
                await getSet(++count);
            } else {
                return allOfEm;
            }
        })
        .catch((err) => console.error(err));
};

const gitProtocolPrefixRegex = /^git:\/\//;

const go = async () => {
    await getSet(0);
    const allTogetherNow = flatten(allOfEm);
    console.log(`Updating settings for ${allTogetherNow.length} repos ...`);
    allTogetherNow.forEach((project) => {
        const formData = new FormData();
        formData.append("mirror_overwrites_diverged_branches", "true");
        // I don't really care about this setting, but
        // GitLab has a bug that will not let you
        // only change the mirror setting.
        formData.append("snippets_enabled", "true");
        if (
            project.import_url &&
            gitProtocolPrefixRegex.test(project.import_url)
        ) {
            formData.append(
                "import_url",
                // GitHub deprecated the git:// protocol, so we want to update
                // anything still using it to https://.
                // https://github.blog/2021-09-01-improving-git-protocol-security-github/
                project.import_url.replace(gitProtocolPrefixRegex, "https://")
            );
        }
        fetch(
            `${gitLabApi}/projects/${project.id}?private_token=${gitLabToken}`,
            {
                method: "PUT",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then((json) => json)
            .catch((err) => console.error(err));
    });
};

go();
