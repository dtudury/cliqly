var ipports = require('./ipports.json');
var dgram = require('dgram');
var port = process.argv[2] && Number(process.argv[2]);
var lib = require('./lib');

function Runnee(port) {
    var self = this;
    this.port = port;
    this.ipports = require('./ipports.json');
    this.disabled = require('./states/disabled');
    this.joining = require('./states/joining');
    this.normal = require('./states/normal');

    this.state = this.disabled;
    setInterval(function () {self.state.update.call(self);}, 2000);
    this.socket = dgram.createSocket("udp4");
    this.socket
        .on("listening", function () {
            var address = self.socket.address();
            self.port = address.port;
            self.state = self.joining;
            self.debug("disabled -> joining");
        })
        .on("close", function () {debug("close:", arguments);})
        .on("error", function () {debug("error:", arguments);})
        .on("message", function (msg, rinfo) {self.state.handler.call(self, msg, rinfo);})
        .bind(port);
}

Runnee.prototype.debug = function () {
    var args = [].slice.call(arguments);
    args.unshift(lib.external_address + ":" + this.port);
    console.log.apply(console, args);
};

new Runnee(port);
