#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

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
        return true;
    } catch (error) {
        return false;
    }
};


// 파일 생성 함수
const makeTemplate = (type, name, directory) => {
    // 이 디렉토리가 없으면 이 디렉토리를 생성해라
    mkdirp(directory);
    if(type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)){
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(chalk.green(pathToFile, ' 생성 완료'));
        }
    } else if(type === 'express-router'){
        const pathToFile = path.join(directory, `${name}.js`);
        if(exist(pathToFile)){
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(chalk.green(pathToFile, ' 생성 완료'));
        }
    } else {
        console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
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

// npx cli -v|--version 시 버전 보여줌
program
    .version('0.0.1', '-v, --version')
    .name('cli');

// npx cli tmpl html처럼 별칭을 줄 수도 있음
// 명령어 : template <type> 
// usage : <type> --filename [filename] --path [path]
//         (type은 필수고 --filename, --path는 선택이다.)
// action : 실제 실행 코드(<>는 변수명으로 option은 options라는 객체로 들어옴)
program
    .command('template <type>')
    .usage(` <type> --filename [filename] --path [path]`)
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    .option('-f, --filename [filename]', '파일명을 입력하세요.', 'index')
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options, command) => {
        console.log(type, options.filename, options.directory);
        makeTemplate(type, options.filename, options.directory);
    });

    
// .command('*', { noHelp: true }) => 안끝낼거라서 주석처리
program
    .action((options, command) => {
        if(command.args.length !== 0){
            console.log(chalk.bold.red('해당 명령어를 찾을 수 없습니다.'));
            program.help();
        } else {
            inquirer.prompt([{
                type: 'list',
                name: 'type',
                message: '템플릿 종류를 선택하세요.',
                choices: ['html', 'express-router'],
            }, {
                type: 'input',
                name: 'name',
                message: '파일의 이름을 입력하세요.',
                default: 'index',
            }, {
                type: 'input',
                name: 'directory',
                message: '파일이 위치할 폴더의 경로를 입력하세요.',
                default: '.',
            }, {
                type: 'confirm',
                name: 'confirm',
                message: '생성하시겠습니까?',
            }])
            .then((answers) => {
                if(answers.confirm) {
                    makeTemplate(answers.type, answers.name, answers.directory);
                    console.log(chalk.hex('#123fff')('터미널을 종료합니다.'));
                }
            });
        }
    })
    .parse(process.argv);