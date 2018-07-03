var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    if (!req.body.maquina) {
        handleError(res, "Invalid user input", "Must provide a  machine name.", 400);
    }else if (!req.body.status) {
        handleError(res, "Invalid user input", "Must provide a Status.", 400);
    } if (!req.body.origin) {
        handleError(res, "Invalid user input", "Must provide an Origin.", 400);
    } if (!req.body.subject) {
        handleError(res, "Invalid user input", "Must provide an Subject.", 400);
    }else{
        pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
            // watch for any connect issues
            conn.query('select Account__c, Name from salesforce.Maquina__c where Name=$1', [req.body.maquina], function(err, results){
                    if(err===null || err===undefined){
                        res.json({"records":results.rows[0], "origen":req.body.maquina})
                    }else{
                        handleError(res, "Error query", err.message, 400);
                    }
                }
            );
        });
    }
});
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
