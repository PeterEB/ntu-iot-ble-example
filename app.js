var BleShepherd = require('ble-shepherd');

var central = new BleShepherd('noble');

central.start();

central.on('ready', function () {
    central.onDiscovered(function (pInfo, cb) {
        if (pInfo.addr === '0x546c0e2cd1be') {  // your device address
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
            periph.configNotify('0xaaa1', '0xcc06', true, function (err) {
            	if (err) console.log(err);
            });
            break;
        case 'devIncoming':
            console.log('>> PIR device join the network');
            break;
        case 'devLeaving':
            console.log('>> PIR device leave the network');
            break;
        case 'attNotify':
            if (msg.data.value.dInState) 
            	console.log('PIR device sensed someone');
            else
            	console.log('Someone left');
            break;
    }
});
