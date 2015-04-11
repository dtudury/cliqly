var fork = require('child_process').fork;
var path = require('path');

var runnees = [];
var last_runnee = -1;

require('http').createServer()
    .listen(2000)
    .on("request", function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var url = req.url;
        var match;
        var i;
        if (match = url.match(/^\/add(\/.*)?/i)) {
            i = (match[1] && match[1].length > 1 && Number(match[1].substr(1))) || null;
            last_runnee++;
            runnees[last_runnee] = fork(path.join(__dirname, "runnee.js"), [i]);
            return res.end("starting service running on " + 
                (i ? i : "random port") +
                "; end with /remove/" + last_runnee + "\n");
        }
        if (match = url.match(/^\/remove(\/.*)?/i)) {
            console.log(match);
            i = (match[1] && match[1].length > 1 && Number(match[1].substr(1))) || null;
            if (runnees[i]) {
                if (runnees[i].connected) {
                    runnees[i].kill('SIGKILL');
                    runnees[i].disconnect();
                }
                delete runnees[i];
                return res.end("killing runnee #" + i + "\n");
            } else {
                return res.end("no runnee #" + i + "\n");
            }
        }
        res.end("unhandled action\n");
    });
