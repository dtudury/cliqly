var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//readline.cursorTo(process.stdout, 0, 0);
//readline.clearScreenDown(process.stdout);
readline.cursorTo(process.stdout, 0, process.stdout.rows);

rl.question("? ", function(answer) {
    console.log(":", answer);
    rl.close();
});

function write_something() {
    rl.pause();
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    console.log("...");
    setTimeout(write_something, 1000);
    rl.resume();
    process.stdout.write(rl._prompt + rl.line);
}

write_something();
