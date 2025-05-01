# notify-pr-review

🌏 한국어 | [**English**](README.en.md)

PR 리뷰 요청을 받으면 Slack으로 알리는 Github Actions

<img src="https://user-images.githubusercontent.com/13075245/279234262-cbe5c159-e103-49eb-bf1f-b50116f98984.png" width="500" alt="intro">

## Version 1.3.0 (Customed)

- GitHub의 Repository variable을 사용해서 `GitHub` 닉네임과 `Slack` id를 매칭하는 기능 추가  

## Usage

1. 메시지 전달을 위해 `SLACK_BOT_TOKEN` 이름의 secret을 세팅하세요.

> 세팅할 Repo > Settings > Secrets > New repository secret

이때, Value는 슬랙에서 제공하는 `xoxb-` 형태의 토큰이어야 합니다.


2. Repository Variables에 `SLACK_IDS` 변수를 생성하세요.

> Repository setting -> Security -> Secrets and variables -> Actions -> Variables -> Repository Variables

`SLACK_IDS`: 레포지토리 내 동료들의 `GitHub 닉네임`:`Slack Id` 형태

**`Slack Id`: Slack 가입 이메일의 '@'앞부분**

e.g. 
```
"SnoopyComp:hyunchang52,hikarigin99:eunbi777, ..."
```

3. `.github/workflow/notify-pr-review.yml` 파일을 만드세요:

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

**Required** GitHub에서 제공하는 토큰

### `slackIds`

**Required** Repository Variables에 SLACK_IDS가 정의되어 있어야 함

### `slackBotToken`

**Required** Slack bot을 통해 메시지를 보내기 위한 토큰

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
