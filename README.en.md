# notify-pr-review

🌏 [**한국어**](README.md) | English

GitHub Actions to notify on Slack when a PR review is requested.

<img src="https://user-images.githubusercontent.com/13075245/279234262-cbe5c159-e103-49eb-bf1f-b50116f98984.png" width="500" alt="intro">

## Version 1.3.0 (Customed)

- Add a feature that uses the GitHub repository variable to match the GitHub nickname with the Slack ID

## Usage

1. Set up a secret named `SLACK_BOT_TOKEN` to send the message.

> Go to the Repo > Settings > Secrets > New repository secret

For the value, use a Slack token that starts with `xoxb-`.

2. Create a `.github/workflow/notify-pr-review.yml` file:

```yml
name: notify pr review

on:
  pull_request:
    types: [review_requested]

jobs:
  notify:
    runs-on: [ubuntu-latest]
    steps:
      - name: Notify PR Review
        uses: SnoopyComp/notify-pr-review@v1.3.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          slackIds: ${{ vars.SLACK_IDS }}
          slackBotToken: ${{ secrets.SLACK_BOT_TOKEN }}
```

## Inputs

### `token`

**Required** GitHub token

### `slackIds`

**Required** For colleagues in repo `Nickname of GitHub`:`Slack Id`

**`Slack Id`: At slack profile -> Copy member ID

e.g.
```
"SnoopyComp:U08UZVUFU8N,hikarigin99:U08VFBD06SG, ..."
```

### `slackBotToken`

**Required** Slack bot token to send messages

e.g. `xoxb-798572638592-435243279588-9aCaWNnzVYelK9NzMMqa1yxz`

## License
```
Copyright (c) 2023-present NAVER Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
