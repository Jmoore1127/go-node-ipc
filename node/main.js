// Spin up go process
const { spawn } = require('child_process');

const networkAuditTester = spawn('./testbin', {
    cwd: "/Users/jared/Projects/pocs/network-audit/go"
})

//capture output
networkAuditTester.stdout.on('data', (d) => console.log(`[AuditService]: ${d}`));
networkAuditTester.stderr.on('data', (d) => console.error(`[AuditService]: ${d}`));

networkAuditTester.on('close', (code) => {
    console.log(`[AuditService] exited with code ${code}`);
});

networkAuditTester.on('error', (err) => {
    console.error('failed to start [AuditService]');
    console.error(err);
    process.exit(1)
});

// IPC communication (TCP Socket)
var ipc = require('node-ipc');
const { exit } = require('process');
ipc.config.networkPort = 54321;
ipc.connectToNet("auditService", () => {
    ipc.of.auditService.on("connect", () => {
        ipc.log('[Client] connected to AuditService', ipc.config.delay);
        ipc.of.auditService.emit(
            'message',
            'hello'
        )
    });
    ipc.of.auditService.on("disconnect", () => {
        ipc.log('[Client] disconnected from AuditService');
    });
    ipc.of.auditService.on("message", (data) => {
        ipc.log('[Client] got a message: ', data);
        ipc.disconnect('auditService');
        exit(0);
    });
});

//cleanup
process.on('exit', function () {
    networkAuditTester.kill();
});


