
var os = require('os');
var network_interfaces = os.networkInterfaces();

var external_address;
for (var network_interface in network_interfaces) {
    network_interfaces[network_interface].forEach(function (details) {
        if (details.family == "IPv4" && !details.internal) {
            external_address = details.address;
        }
    });
}

module.exports = external_address;
