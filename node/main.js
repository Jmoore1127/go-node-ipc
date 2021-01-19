
const { spawn } = require('child_process');
const networkAuditTester = spawn('./testbin', {
    cwd: "/Users/jared/Projects/pocs/network-audit/go"
})

networkAuditTester.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

networkAuditTester.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

networkAuditTester.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

networkAuditTester.on('error', (err) => {
    console.error(err)
    console.error('Failed to start subprocess.');
});


var ipc = require('node-ipc');
const { exit } = require('process');
const { pathToFileURL } = require('url');
ipc.config.networkPort = 54321;
ipc.connectToNet("test", () => {
    ipc.of.test.on("connect", () => {
        ipc.log('connected to test', ipc.config.delay);
        ipc.of.test.emit(
            'message',
            'hello'
        )
    });
    ipc.of.test.on("disconnect", () => {
        ipc.log('disconnected from test');
    });
    ipc.of.test.on("message", (data) => {
        ipc.log('got a message from test : ', data);
        ipc.disconnect('test');
        exit(0);
    });
})

process.on('exit', function () {
    networkAuditTester.kill();
});