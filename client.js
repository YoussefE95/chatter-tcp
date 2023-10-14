const net = require('node:net');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const lineReader = readline.createInterface({ input, output });
lineReader.on('line', (input) => {
    client.write(`${input.slice(0, input.length)}`);
});

const client = net.createConnection({
    host: process.argv[2],
    port: process.argv[3],
});

client.on('connect', (data) => {
    console.log(`Connected to ${client.remoteAddress}:${client.remotePort}`);
});

client.on('data', (data) => {
    console.log(`${data}`);
});

client.on('close', (data) => {
    console.log(`Closed ${client.remoteAddress}:${client.remotePort}`);
});
