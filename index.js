// Notify PR Review
// Copyright (c) 2023-present NAVER Corp.
// Apache-2.0

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const ENCODE_PAIR = {
    "<": "&lt;",
    ">": "&gt;"
};
const encodeText = text => text.replace(/[<>]/g, matched => ENCODE_PAIR[matched]);
const D0 = "D-0";
const sendSlack = ({repoName, labels, title, url, slackId}) => {
    const d0exists = labels.some(label => label.name === D0);

    core.info(`send message to ${slackId}..., ${core.getInput("slackBotToken")}`);

    return axios({
        method: "post",
        headers: {
            Authorization: `Bearer ${core.getInput("slackBotToken")}`,
            "Content-Type": "application/json"
        },
        url: "https://slack.com/api/chat.postMessage",
        data: {
            channel: `@${slackId}`,
            text: "리뷰 요청을 받았어요! 😊",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `📬 <@${slackId}> 님 새로운 리뷰 요청이 도착했어요! 가능한 빠르게 리뷰에 참여해 주세요:`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${repoName}:*\n<${url}|${encodeText(title)}>`
                    }
                },
                ...labels.length ? [{
                    type: "actions",
                    elements: labels.map(({name}) => ({
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: name
                        },
                        ...name === D0 ? {style: "danger"} : {}
                    }))
                }] : [],
                ...d0exists ? [{
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*🚨 \`${D0}\` PR로 매우 긴급한 PR입니다! 지금 바로 리뷰에 참여해 주세요! 🚨*`
                    }
                }] : [],
                {
                    type: "divider"
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "💪 코드 리뷰는 코드 품질을 향상시키고, 버그를 줄이며, 팀원 간의 지식 공유와 협업을 촉진하는 핵심 프로세스입니다.\n🙏 적극적인 참여와 의견을 부탁드립니다."
                        }
                    ]
                }
            ]
        }
    });
};
const slackId = (slackIds, githubNickName) =>
    slackIds
        .split(",")
        .map(row => row.split(":"))
        .find(([githubName]) => githubName === githubNickName)?.[1];
(async () => {
    try {
        const {
            context: {
                payload: {
                    pull_request: {
                        title,
                        html_url: prUrl,
                        labels
                    },
                    sender,
                    requested_reviewer: requestedReviewer,
                    requested_team: requestedTeam,
                    repository: {
                        full_name: repoName
                    }
                }
            }
        } = github;

        if (!requestedReviewer) {
            core.notice(`Failed: 'requested_reviewer' does not exist. Looks like you've requested a team review which is not yet supported. The team name is '${requestedTeam.name}'.`);

            return;
        }

        const {login, url} = requestedReviewer;

        core.notice(`Sender: ${sender.login}, Receiver: ${login}, PR: ${prUrl}`);
        core.info(`'${sender.login}' requests a pr review for ${title}(${prUrl})`);
        core.info(`Fetching information about '${login}'...`);



        const id = slackId(core.getInput("slackIds"),login);
        core.info(`Sending a slack msg to '${login}(${id})'...`);

        const response = await sendSlack({
            repoName: repoName,
            labels: labels,
            title: title,
            url: prUrl,
            slackId: id
        });

        if(JSON.stringify(response.data).split(",")[0].split(":")[1] === "true"){
            core.info("Successfully sent");
            core.notice("Successfully sent");
        }else{
            core.info(`Slack response data: ${JSON.stringify(response.data)}`);
            core.setFailed(JSON.stringify(response.data));
        }
    } catch (error) {
        core.setFailed(error.message);
    }
})();
