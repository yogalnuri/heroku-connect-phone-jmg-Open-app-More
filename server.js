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
            conn.query('select Account__c, Name, Id from salesforce.Maquina__c where Name=$1', [req.body.maquina], function(err, results){
                if(err===null || err===undefined){
                    conn.query('select Max(External_Case_Id__c) as External_Case_Id__c from salesforce.Case', function(errorCase, resultsCase){
                        if(errorCase===null || errorCase===undefined){
                            var externalId= resultsCase.rows[0].external_case_id__c+1;
                            console.log("Hago el insert");
                            conn.query("Insert into salesforce.Case (AccountId, Maquina_Averiada__c, Status, Origin, Subject, External_Case_Id__c) Values($1,$2,$3,$4,$5,$6)",
                                        [results.rows[0].account__c, results.rows[0].Id, req.body.status, req.body.origin, req.body.subject, externalId ],
                                        function(error, resultado){
                                            done();
                                            if(error===null || error===undefined){
                                                res.json(resultado);
                                            }else{
                                                res.status(400).json({"errorInsert": error});
                                            }
                                        });
                        }else{
                            handleError(res, "Error query", errorCase.message, 400);
                        }
                    });
                }else{
                    handleError(res, "Error query", error.message, 400);
                }
            });
        });
    }
});
app.get('/update', function(req, res) {
	console.log(req);
		
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
            conn.query('select Account__c, Name, Id from salesforce.Maquina__c where Name=$1', [req.body.maquina], function(err, results){
                if(err===null || err===undefined){
                    conn.query('select Max(External_Case_Id__c) as External_Case_Id__c from salesforce.Case', function(errorCase, resultsCase){
                        if(errorCase===null || errorCase===undefined){
                            var externalId= resultsCase.rows[0].external_case_id__c+1;
                            console.log("Hago el insert");
                            conn.query("Insert into salesforce.Case (AccountId, Maquina_Averiada__c, Status, Origin, Subject, External_Case_Id__c) Values($1,$2,$3,$4,$5,$6)",
                                        [results.rows[0].account__c, results.rows[0].Id, req.body.status, req.body.origin, req.body.subject, externalId ],
                                        function(error, resultado){
                                            done();
                                            if(error===null || error===undefined){
                                                res.json(resultado);
                                            }else{
                                                res.status(400).json({"errorInsert": error});
                                            }
                                        });
                        }else{
                            handleError(res, "Error query", errorCase.message, 400);
                        }
                    });
                }else{
                    handleError(res, "Error query", error.message, 400);
                }
            });
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
