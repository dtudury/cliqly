var list;
var step_index = 0;

exports.update = function () {
};

exports.handler = function (message, rinfo) {
    if (!list) {
        list = [
            {
                address: lib.external_address,
                port: this.port,
                rnd = Math.random() * Math.pow(2, 32)
            }
        ];
    }
    try {
        var obj = JSON.parse(message);
        if (obj.action && obj.action == "join") {
            delete obj.action;
            current_step = {
                index: ++step_index,
                action: "add",
                list: "processes",
                obj: obj.process,
                concensus: []
            };
            this.state.update();
        } else {
            this.debug("unhandled", obj);
        }
    } catch(e) {
        this.debug("bad JSON", message.toString());
    }
};
