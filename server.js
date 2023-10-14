const net = require('net');
const os = require('os');

const server = new net.createServer();
const host = os.networkInterfaces()['wlan0'][0].address;
const port = process.argv[2];
const sockets = [];

server.listen(port, host, () => {
    console.log(`TCP Server running on ${host}:${port}\n`);
});

server.on('connection', (sock) => {
    console.log(`New connection ${sock.remoteAddress}:${sock.remotePort}`);
    sockets.push(sock);

    sock.on('data', async (data) => {
        await handleInput(sock, data.toString().split(' '));
    });

    sock.on('close', async (data) => {
        const index = sockets.findIndex((socket) => {
            return (
                socket.remoteAddress === sock.remoteAddress &&
                socket.remotePort === sock.remotePort
            );
        });

        if (index !== -1) {
            sockets.splice(index, 1);
        }

        await sock.write(
            `Closed connection ${sock.remoteAddress}:${sock.remotePort}\n\n`
        );
        console.log(
            `Closed connection ${sock.remoteAddress}:${sock.remotePort}`
        );
    });
});

const handleInput = async (sock, data) => {
    switch (data[0]) {
        case 'myip':
            await sock.write(`${sock.remoteAddress}\n`);
            break;
        case 'myport':
            await sock.write(`${sock.remotePort}\n`);
            break;
        case 'list':
            await listConnections(sock);
            break;
        case 'send':
            await sendMessage(sock, data[1], createMessage(data.slice(2)));
            break;
        case 'terminate':
            await terminateConnection(sock, data[1]);
            break;
        case 'exit':
            await closeConnection(sock);
            break;
        default:
            await sock.write('Command not supported\n');
        case 'help':
            await displayOptions(sock);
            break;
    }
};

const listConnections = async (sock) => {
    let connections = '';

    for (let i = 0; i < sockets.length; i++) {
        connections += `${i} ${sockets[i].remoteAddress}:${sockets[i].remotePort}\n`;
    }

    await sock.write(connections);
};

const createMessage = (arr) => {
    let str = '';

    for (let i = 0; i < arr.length; i++) {
        str += `${arr[i]} `;
    }

    return str;
};

const sendMessage = async (sock, sockIndex, message) => {
    if (sockIndex >= 0 && sockIndex < sockets.length) {
        const destSock = sockets[sockIndex];

        if (sock !== destSock) {
            let destMsg = '';

            destMsg += `From ${sock.remoteAddress}:${sock.remotePort}\n`;
            destMsg += `To ${destSock.remoteAddress}:${destSock.remotePort}\n`;
            destMsg += `${message}\n`;

            await destSock.write(destMsg);
            await sock.write('Message sent\n');
        } else {
            await sock.write('Cannot send message to self\n');
        }
    } else {
        await sock.write(`${sockIndex} is not a valid index\n`);
    }
};

const terminateConnection = async (sock, sockIndex) => {
    if (sockIndex >= 0 && sockIndex < sockets.length) {
        const destSock = sockets[sockIndex];
        await destSock.write(
            `Terminated by ${sock.remoteAddress}:${sock.remotePort}\n`
        );
        await sock.write(
            `Closing connection ${destSock.remoteAddress}:${destSock.remotePort}\n`
        );
        await closeConnection(destSock);
    } else {
        await sock.write(`${sockIndex} is not a valid index\n`);
    }
};

const closeConnection = async (sock) => {
    await sock.write('Closing connection. Thanks!\n');
    await sock.destroy();
};

const displayOptions = async (sock) => {
    let helpMsg = 'Supported commands:\n';
    helpMsg += '\tmyip: print system ip\n';
    helpMsg += '\tmyport: print port this connection is running on\n';
    helpMsg += '\tlist: list all other connections\n';
    helpMsg += '\tsend: send a message to another connection\n';
    helpMsg += '\tterminate: terminate another connection\n';
    helpMsg += '\texit: terminate this connection\n';

    await sock.write(helpMsg);
};
