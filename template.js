#!/usr/bin/env node
// 간단한 명령어로 파일을 만들어낼 수 있도록
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// npx cli html main . => 현재 경로에 main.html 파일이 생성된다.
let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';

// html 기본 구조 코드 매번 작성하기 귀찮으니 코드 적힌 파일 만들기
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Template</title>
</head>
<body>
<h1>Hello</h1>
<p>CLI</p>
</body>
</html>
`;

// express 라우터 코드를 한번에 뽑아주는 코드
const routerTemplate = `
const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    try{
        res.send('ok');
    } catch(error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;
`;

// 파일이 이미 만들어져 있는 파일인지 확인하는 함수
const exist = (dir) => {
    try {
        // 특정 경로에 파일이 있는지 확인 코드
        // F_OK : 숨겨져 있는 파일이 아니다.
        // R_OK : 읽기 가능한 파일
        // W_OK : 쓰기 가능한 파일
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    } catch (error) {
        return false;
    }
};


// 파일 생성 함수
const makeTemplate = () => {
    // 이 디렉토리가 없으면 이 디렉토리를 생성해라
    mkdirp(directory);
    if(type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)){
            console.error('이미 해당 파일이 존재합니다.');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, ' 생성 완료');
        }
    } else if(type === 'express-router'){
        const pathToFile = path.join(directory, `${name}.js`);
        if(exist(pathToFile)){
            console.error('이미 해당 파일이 존재합니다.');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, ' 생성 완료');
        }
    } else {
        console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};

// 경로가 a/b/c라면 a먼저 만들고 b 만들고 c 만드는 함수
const mkdirp = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if(!exist(pathBuilder)){
            fs.mkdirSync(pathBuilder);
        }
    });
};

const dirAnswer = (answer) => { // 파일 경로 설정
    directory = answer?.trim() || '.';
    rl.close();
    makeTemplate();
}

const nameAnswer = (answer) => { // 파일 이름 설정
    if(!answer || !answer.trim()){
        console.clear();
        console.log('name을 반드시 입력하셔야 합니다.');
        return rl.question('파일명을 설정하세요.', nameAnswer);
    }
    name = answer;
    return rl.question('저장할 경로를 설정하세요.(설정하지 않으면 현재경로) ', dirAnswer);
}

const typeAnswer = (answer) => { // 템플릿 종류 설정
    if(answer !== 'html' && answer !== 'express-router'){
        console.clear();
        console.log('html 또는 express-router만 지원합니다.');
        return rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
    }
    type = answer;
    return rl.question('파일명을 설정하세요. ', nameAnswer);
}

const program = () => {
    if(!type || !name) {
        console.log('사용 방법: cli html|express-router 파일명 [생성 경로]');
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.clear();
        rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
    } else {
        makeTemplate();
    }
}

program();

