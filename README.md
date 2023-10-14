# Chatter TCP

-   This is a project for Networking Protocols at CSULA
-   We used JavaScript and NodeJs (only net and os modules were used)
-   You can run a TCP socket server and multiple clients to communicate with one another on the same network

### Chatter.js is the entry point for this application

-   It expects to be called with either 1 or 2 arguments
-   If one argument is passed, it should be the port you want the server to run on
-   If two arguments are passed, they should be the ip and port of the server you want to connect to
-   Note: the server is set up to automatically run on the public ip (inet). This is done using "os.networkInterfaces()" and we assume a network interface with name "wlan0" exists on the system too. Check to confirm your machine's network interface also matches by using "ifconfig" and update line 5 in server.js accordingly if it does not match

### Screenshots

![](./screenshots/server.png)
![](./screenshots/clients.png)
![](./screenshots/full.png)
