var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var fs = require('fs');     

  var data = fs.readFileSync('./properties.json');
  var properties = {};

  try {
    properties = JSON.parse(data);
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }

mongoose.connect('mongodb://'+properties.username+':'+properties.password+'@'+properties.server+':'+properties.port+'/'+properties.db);


var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));

var data = {
        columns: []
    }

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

var formatData = function(tempLogs){
	

	var times = ['time']
    var temps = ['temperature'];
    var humidities = ['humidity'];
    for(var i=0;i<tempLogs.length;i++){
    	var date = new Date(tempLogs[i].date);
		var formattedDate = dateFormat(date, "HH:MM:ss");

    	times.push(formattedDate);
    	temps.push(tempLogs[i].temperature.toFixed(2));
    	humidities.push(tempLogs[i].humidity.toFixed(2));
    }

    data.columns.push(times);
    data.columns.push(temps);
    data.columns.push(humidities);

    return data;
}

app.get('/log', function (req, res) {
   	var date = new Date();
	var formattedDate = dateFormat(date, "yyyy-m-d");
	returnData(formattedDate, res);
});

app.get('/log/:date', function (req, res) {
	returnData(req.params.date,res);
});

var returnData = function(date, res){
		data = {
		x: 'time',
        xFormat: '%H:%M:%S',
        columns: [],

    }

	TempLogger.find({day: date }, function(err, templogs){
		data = formatData(templogs);
		res.send(data);
	}); 
}


var tempLoggerSchema = mongoose.Schema({
    date: Date,
    day: String,
    temperature: Number,
    humidity: Number
});

var TempLogger = mongoose.model('tempLogger', tempLoggerSchema);

var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
});

