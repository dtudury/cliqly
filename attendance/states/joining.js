var lib = require('../lib');
var ipports = require('../ipports.json');

var update_index = 0;

exports.update = function () {
    var ipport = ipports[update_index % ipports.length];
    if (lib.external_address !== ipport.address || this.port !== ipport.port) {
        var message = new Buffer(JSON.stringify({
            action: "join",
            process: {
                address: lib.external_address,
                port: this.port
            }
        }));
        this.debug("sending to", ipport);
        this.socket.send(message, 0, message.length, ipport.port, ipport.address);
    }
    update_index++;
};

exports.handler = function (message, rinfo) {
    try {
        var obj = JSON.parse(message);
        if (obj.action && obj.action == "join") {
            this.state = this.normal;
            this.debug("joining -> normal");
            this.state.handler(message, rinfo);
        } else {
            this.debug("unhandled", obj);
        }
    } catch(e) {
        this.debug("bad JSON", message.toString());
    }
};
