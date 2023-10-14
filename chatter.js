const { fork } = require('child_process');
let spawnedProcess;

if (process.argv[2] && process.argv[3]) {
    spawnedProcess = fork('./client.js', [process.argv[2], process.argv[3]]);
} else if (process.argv[2]) {
    spawnedProcess = fork('./server.js', [process.argv[2]]);
} else {
    console.log('No valid arguments were given.');
}

spawnedProcess.on('close', () => {
    console.log('All done! Thanks for using my application');
});
