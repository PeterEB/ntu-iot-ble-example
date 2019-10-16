var net = require('net');
var BleShepherd = require('ble-shepherd');

var central = new BleShepherd('noble');
var client = new net.Socket();

// [TODO] Connect the tcp client to the tcp server

central.start();

central.on('ready', function () {
    central.onDiscovered(function (pInfo, cb) {  
        if (pInfo.addr === '0x546c0e2cd8b0') {  // [TODO] Change to your device address
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
    central.permitJoin(60);
});

central.on('ind', function(msg) {
    var periph = msg.periph;
    
    switch (msg.type) {
        case 'devStatus':
            console.log('>> PIR device ' + msg.data);
            if (msg.data === 'online') {
                periph.configNotify('0xaaa1', '0xcc06', true, function (err) {
                    if (err) console.log(err);
                });
            }
            break;
        case 'devIncoming':
            console.log('>> PIR device join the network');
            break;
        case 'devLeaving':
            console.log('>> PIR device leave the network');
            break;
        case 'attNotify':
            if (msg.data.value.dInState) {
                console.log('PIR device sensed someone');

                // [TODO] Use the tcp client to send PIR state
            } else {
                console.log('Someone left');

                // [TODO] Use the tcp client to send PIR state
            }
            break;
    }
});
