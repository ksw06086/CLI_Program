#!/usr/bin/env node
// 리눅스나 맥에서는 특별한 의미를 가짐(cli의 index.js를 node로 실행해라라는 의미)

// console.log('Hello cli', process.argv);
const readline = require('readline');

// 터미널의 input, 터미널의 output 그대로 쓰겠다.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

console.clear();
const answerCallback = (answer) => {
    if(answer === 'y'){
        console.log('감사합니다.');
        rl.close();
    } else if(answer === 'n'){
        console.log('죄송합니다.');
        rl.close();
    } else {
        console.clear();
        console.log('y 또는 n만 입력하세요.');
        rl.question('예제가 재미있습니다? (y/n)', answerCallback);
    }
}
rl.question('예제가 재미있습니다? (y/n)', answerCallback);