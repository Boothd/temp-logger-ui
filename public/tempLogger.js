angular.module('tempLogger', ['ngMaterial', 'ngMessages']).
controller('tempLoggerController', function($scope, $http) {
    $scope.update = function(dateField) {
    	console.log($scope.myDate);
    	var date = $scope.myDate;
    	var month = date.getMonth()+1;
		var formattedDate = date.getFullYear()+'-'+month+'-'+date.getDate();
    	//console.log(formattedDate);

    	$http.get('http://localhost:3000/log/'+formattedDate).
        	success(function(data) {
	            $scope.log = data;

	            var chart = c3.generate({
				    bindto: '#chart',
				    data: data,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	}
			});

	        var temp = removeHumidity(data);

            var chart2 = c3.generate({
			    bindto: '#chart2',
			    data: temp,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	},
				    tooltip: {
				        format: {
				            value: function(value) {
				                return d3.round(value,1);
				            }
				        }
				    }
			});

			var hum = removeTemperature(data);

			c3.generate({
			    bindto: '#chart3',
			    data: hum,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	},
				    tooltip: {
				        format: {
				            value: function(value) {
				                return d3.round(value,1);
				            }
				        }
				    }
			});
        });
    };

    var removeHumidity = function(data){
    	var temp ={};
    		angular.copy(data, temp);
            var column0 = temp.columns[0];
            var column1 = temp.columns[1];
            var columns = [column0, column1];
            temp.columns = columns;

            return temp;
    };

    var removeTemperature = function(data){
    	var hum = {};
			angular.copy(data, hum);
            var column0 = hum.columns[0];
            var column1 = hum.columns[2];
            var columns = [column0, column1];
            hum.columns = columns;

            return hum;
    };

    $http.get('http://localhost:3000/log').
        success(function(data) {
            $scope.log = data;

            //console.log(data);

            var chart = c3.generate({
			    bindto: '#chart',
			    data: data,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	}
			});

	        temp = removeHumidity(data);

            var chart2 = c3.generate({
			    bindto: '#chart2',
			    data: temp,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	},
				    tooltip: {
				        format: {
				            value: function(value) {
				                return d3.round(value,1);
				            }
				        }
				    }
			});

			hum = removeTemperature(data);

			c3.generate({
			    bindto: '#chart3',
			    data: hum,
		            axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%H:%M:%S'
				            }
				        }
			    	},
				    tooltip: {
				        format: {
				            value: function(value) {
				                return d3.round(value,1);
				            }
				        }
				    }
			});
        });



	$scope.myDate = new Date();
	$scope.minDate = new Date(
	$scope.myDate.getFullYear(),
	$scope.myDate.getMonth() - 2,
	$scope.myDate.getDate());
	$scope.maxDate = new Date(
	$scope.myDate.getFullYear(),
	$scope.myDate.getMonth() + 2,
	$scope.myDate.getDate());

	$scope.onlyWeekendsPredicate = function(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	}
});

function getLogs($scope, $http) {
    
}