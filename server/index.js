const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const httpServer = http.createServer(app);
const cors = require('cors');
var multer  = require('multer')

var bodyParser = require('body-parser')
var Blob = require('blob');


const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null,'./uploads')
    },
    filename: (req, file, cb)=> {
        cb(null, new Date().toISOString() + file.originalname )
    },
});

var upload = multer({ storage })

const PORT = process.env.PORT || 5000;

const wsServer = new WebSocket.Server({ server: httpServer }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

// array of connected websocket clients
let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});

// HTTP stuff

app.use('/*', cors({
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
}));

// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 

app.get('/client', (req, res) => res.sendFile(path.resolve(__dirname, './client.html')));
app.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')));
app.get('/', (req, res) => {
    res.send(`
        <a href="streamer">Streamer</a><br>
        <a href="client">Client</a>
    `);
});

app.post('/file', upload.single('video'), (req,res, next)=>{
    
    // var reader = new FileReader()
    // reader.onload = function(){
    //     var buffer = new Buffer(reader.result)
    //     fs.writeFile(path, buffer, {}, (err, res) => {
    //         if(err){
    //             console.error(err)
    //             return
    //         }
    //         console.log('video saved')
    //     })
    // }
    // reader.readAsArrayBuffer(blob
    console.log({ req: req.file });
    console.log('req.param',req.body);
    
//     var file = new Blob(blob, {
//         type: 'video/webm'
//    });
//    console.log('file',file);
   
    
    res.send(JSON.stringify({
        message: 'Suc'
    }))
})
httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));