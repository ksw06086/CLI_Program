# CLI 프로그램
- 터미널에서 돌아가는 프로그램 만듬(ex> nodemon / npm 등 명령어 입력하면 실행되게)

# process.argv
- npx cli = node index.js
- node의 경로, index.js의 경로를 보여줌
- 명령어 뒤에 옵션을 더 붙이면 그게 process.argv로 값으로 넘어감

# 노드 내장 모듈
1. readline : 사용자로부터 입력을 받음

# package.json bin 부분 수정했을 경우 새로고침
- npm i -g

# CLI 명령어 터미널에서 지우고 싶을 때
- npm rm -g node-cli


# CLI 프로그램 쉽게 짤 수 있도록 도와주는 모듈
[commander@9]
- commander 모듈을 활용해서 만든 template.js => command.js
[inquirer@8]
- readline의 업그레이드 버전
[chalk@4] = 분필
- command 라인에 색을 입힐 수 있게 해줌
