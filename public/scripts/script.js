path = window.location.protocol+"//"+window.location.host+"/api/v1";
var authToken = null;

//General helper for HTTP-requests
function httpRequest() {
    var ajax = null,
    response = null,
    self = this;

    this.method = null;
    this.url = null;
    this.async = true;
    this.data = null;

    this.send = function() {
        ajax.open(this.method, this.url, this.async);
        ajax.setRequestHeader('gameid', 'm');
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.setRequestHeader('x-access-token', authToken);
		console.log(this.data);
        ajax.send(this.data);
    };

    if(window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
        try {
            ajax = new ActiveXObject("Msxml2.XMLHTTP.6.0");
        }
        catch(e) {
            try {
                ajax = new ActiveXObject("Msxml2.XMLHTTP.3.0");
            }
            catch(error) {
                self.fail("not supported");
            }
        }
    }

    if(ajax == null) {
        return false;
    }

    ajax.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                self.success(this.responseText);
            }
            else {
                self.fail(this.status + " - " + this.statusText);
            }
        }
    };
}

//General helper for getting a cookie value
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//General helper for getting a cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//General helper for deleting a cookie
function delCookie(name) {
    document.cookie = name +
    '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}

function getPath() {
	var request = new httpRequest();
	request.method = "GET";
	request.url = window.location.pathname + "/path";

	request.success = function(response) {
    	console.log("Path fetched!");
    	setCookie('path', response, 1);
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

//Company functions
function getCompanies() {
	console.log("getCompanies called");

	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/companies";

	request.success = function(response) {
	    console.log("Success: Companies returned!");
	    var resp = JSON.parse(response);
	    var data = resp.data;
	    var keys = Object.keys(data);

	    var parent = document.getElementById("companiestable");
	    parent.innerHTML = '';

	    for(var i = 0; i < keys.length; i++) {
	    	var comp = data[keys[i]];

	    	var row = parent.insertRow(0);
	    	var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			var cell6 = row.insertCell(5);
			var cell7 = row.insertCell(6);
			var cell8 = row.insertCell(7);
			var cell9 = row.insertCell(8);
			var cell10 = row.insertCell(9);

			cell1.innerHTML = '<a onclick="openCompany(\'' + comp.id + '\');">' + comp.id + '</a>';
			cell2.innerHTML = comp.name;
			cell3.innerHTML = comp.presalesTeam.length;
			cell4.innerHTML = Object.keys(comp.oppyCompeted).length;
			cell5.innerHTML = comp.brendRecognition;
			cell6.innerHTML = comp.budget;
			cell7.innerHTML = comp.totalHours;
			cell8.innerHTML = comp.isBAMEnabled;
			cell9.innerHTML = comp.isTOPEnabled;
			cell10.innerHTML = comp.isBankrupt;
	    }

	    $('#compsdt').DataTable();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function createCompany(name) {
	var request = new httpRequest();
	request.method = "POST";
	request.url = path + "/companies";

	request.success = function(response) {
    	console.log("Success: Company created!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.data = JSON.stringify({
    	name: name
	});

	request.send();
}

function deleteCompanies() {
	var request = new httpRequest();
	request.method = "DELETE";
	request.url = path + "/companies";

	request.success = function(response) {
    	console.log("Success: Companies Deleted!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function openCompany(id) {

	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/companies/" + id;

	request.success = function(response) {
    	console.log("Success: Company information fetched!");
		
		var resp = JSON.parse(response);
	    var data = resp.data;

	    console.log(data);

		var parent = document.getElementById('featureslist');
		parent.innerHTML = '';
		var info = document.createElement('ul');

		var idlist = document.createElement('li');
		idlist.appendChild(document.createTextNode('Company ID: ' + id));
		info.appendChild(idlist);
		
		var namelist = document.createElement('li');
		namelist.appendChild(document.createTextNode('Name: ' + data.name));
		info.appendChild(namelist);

		var blist = document.createElement('li');
		blist.appendChild(document.createTextNode('BAM Enabled: ' + data.isBAMEnabled));
		info.appendChild(blist);

		var tlist = document.createElement('li');
		tlist.appendChild(document.createTextNode('TOP Enabled: ' + data.isTOPEnabled));
		info.appendChild(tlist);

		var balist = document.createElement('li');
		balist.appendChild(document.createTextNode('Bankrupted: ' + data.isBankrupt));
		info.appendChild(balist);

		var mlist = document.createElement('li');
		mlist.appendChild(document.createTextNode('Money: ' + data.budget));
		info.appendChild(mlist);

		var hlist = document.createElement('li');
		hlist.appendChild(document.createTextNode('Hours: ' + data.totalHours));
		info.appendChild(hlist);

		var malist = document.createElement('li');
		malist.appendChild(document.createTextNode('Market Recognition: ' + data.brendRecognition));
		info.appendChild(malist);

		parent.appendChild(info);

		var table = document.getElementById('productfeaturestable');
		table.innerHTML = '';

		var tbody = document.createElement('tbody');
		
		for (var i = 0; i < data.ProductBasicFeatures.length; i++) {
			var row = document.createElement('tr');

			var ncell = document.createElement('td');
			ncell.appendChild(document.createTextNode(data.ProductBasicFeatures[i].name));
			row.appendChild(ncell);

			var scell = document.createElement('td');
			scell.appendChild(document.createTextNode(data.ProductBasicFeatures[i].score));
			row.appendChild(scell);

			tbody.appendChild(row);
		}

		table.appendChild(tbody);

		table = document.getElementById('messagestable');
		table.innerHTML = '';

		tbody = document.createElement('tbody');

		for (var i = 0; i < data.messages.length; i++) {
			var row = document.createElement('tr');

			var ncell = document.createElement('td');
			ncell.appendChild(document.createTextNode(data.messages[i].type));
			row.appendChild(ncell);

			var scell = document.createElement('td');
			scell.appendChild(document.createTextNode(data.messages[i].msg));
			row.appendChild(scell);

			tbody.appendChild(row);
		}

		table.appendChild(tbody);

		table = document.getElementById('oppycompetedtable');
		table.innerHTML = '';

		thead = document.createElement('thead');
		hrow = document.createElement('tr');

		var headers = ['ID','Quarter','Initial Value','Close Value','TTC','Cost','Budget', 'Hours Left', 'IDX', 'Outcome'];
		
		for(var i = 0; i < headers.length; i++) {
			hcell = document.createElement('th');
			hcell.appendChild(document.createTextNode(headers[i]));
			hrow.appendChild(hcell);	
		}

		thead.appendChild(hrow);
		table.appendChild(thead);

		tbody = document.createElement('tbody');
		var oppykeys = Object.keys(data.oppyCompeted);

		for (var i = 0; i < oppykeys.length; i++) {
			var item = data.oppyCompeted[oppykeys[i]];
			var row = document.createElement('tr');

			var acell = document.createElement('td');
			acell.appendChild(document.createTextNode(oppykeys[i]));
			row.appendChild(acell);
			var rowkeys = Object.keys(item);
			
			for(var j = 0; j < rowkeys.length; j++) {
				var bcell = document.createElement('td');
				bcell.appendChild(document.createTextNode(item[rowkeys[j]]));
				row.appendChild(bcell);				
			}

			tbody.appendChild(row);
		}

		table.appendChild(tbody);

		table = document.getElementById('presalestable');
		table.innerHTML = '';
		tbody = document.createElement('tbody');

		for (var i = 0; i < data.presalesTeam.length; i++) {
			var row = document.createElement('tr');

			var acell = document.createElement('td');
			acell.innerHTML = '<a onclick="openPresale(\'' + data.presalesTeam[i] + '\');">' + data.presalesTeam[i] + '</a>';
			row.appendChild(acell);

			tbody.appendChild(row);
		}

		table.appendChild(tbody);

		$('#compdetailsmodal').modal('show');
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

//Opportunity Functions
function getOpportunities() {
	console.log("getOpportunities called");

	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/opportunities";

	request.success = function(response) {
    	console.log("Success: Opportunities fetched!");
    	var resp = JSON.parse(response);
	    var data = resp.data;
	    var keys = Object.keys(data);

	    var parent = document.getElementById("oppstable");
	    parent.innerHTML = '';

	    for(var i = 0; i < keys.length; i++) {
	    	var opp = data[keys[i]];
	    	
	    	var row = parent.insertRow(0);
	    	var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			var cell6 = row.insertCell(5);
			var cell7 = row.insertCell(6);
			var cell8 = row.insertCell(7);
			var cell9 = row.insertCell(8);
			var cell10 = row.insertCell(9);

			cell1.innerHTML = opp.ID;
			cell2.innerHTML = opp.CompanyName;
			cell3.innerHTML = opp.TTC;
			cell4.innerHTML = opp.associatedCost;
			cell5.innerHTML = opp.qualificationLevel;
			cell6.innerHTML = opp.realOppyValue;
			cell7.innerHTML = opp.status;
			cell8.innerHTML = opp.teoricalValue;
			cell9.innerHTML = opp.variationPerc;
			cell10.innerHTML = opp.winner;
	    }

	    $('#oppsdt').DataTable();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function generateOpportunities(numComp, minVal, maxVal, minTTC, maxTTC) {
	var request = new httpRequest();
	request.method = "POST";
	request.url = path + "/opportunities";

	request.success = function(response) {
    	console.log("Success: Opportunities created!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.data = JSON.stringify({
		num: numComp,
		minValue : minVal,
		maxValue : maxVal,
		minTTC : minTTC,
		maxTTC : maxTTC
	});

	request.send();
}

function deleteOpportunities() {
	var request = new httpRequest();
	request.method = "DELETE";
	request.url = path + "/opportunities";

	request.success = function(response) {
    	console.log("Success: Opportunities Deleted!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

//Presales Functions
function getPresales() {
	console.log("getPresales called");

	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/presales";

	request.success = function(response) {
    	console.log("Success: Presales fetched!");
    	var resp = JSON.parse(response);
	    var data = resp.data;
	    var keys = Object.keys(data);

	    var parent = document.getElementById("pretable");
	    parent.innerHTML = '';

	    for(var i = 0; i < keys.length; i++) {
	    	var person = data[keys[i]].person;
	    	
	    	var row = parent.insertRow(0);
	    	var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			var cell6 = row.insertCell(5);
			var cell7 = row.insertCell(6);

			cell1.innerHTML = '<a onclick="openPresale(\'' + person.ID + '\');">' + person.ID + '</a>';
			cell2.innerHTML = person.name;
			cell3.innerHTML = person.cost;
			cell4.innerHTML = person.satisfactionLevel;
			cell5.innerHTML = person.employedBy;
			cell6.innerHTML = person.isEmployed;
			cell7.innerHTML = person.timePerQuarter;
	    }

	    $('#predt').DataTable();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function deletePresales() {
	var request = new httpRequest();
	request.method = "DELETE";
	request.url = path + "/presales";

	request.success = function(response) {
    	console.log("Success: Presales Deleted!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function generatePresales(amount) {
	var request = new httpRequest();
	request.method = "POST";
	request.url = path + "/presales";

	request.success = function(response) {
    	console.log("Success: Presales created!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.data = JSON.stringify({
    	num: amount
	});

	request.send();
}

function openPresale(id) {
	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/presales/" + id;

	request.success = function(response) {
    	console.log("Success: Presale information fetched!");
		
		var resp = JSON.parse(response);
	    var data = resp.data;

		var parent = document.getElementById('infolist');
		parent.innerHTML = '';
		var info = document.createElement('ul');

		console.log(data);

		var idlist = document.createElement('li');
		idlist.appendChild(document.createTextNode('ID: ' + id));
		info.appendChild(idlist);
		
		var namelist = document.createElement('li');
		namelist.appendChild(document.createTextNode('Name: ' + data.person.name));
		info.appendChild(namelist);

		var alist = document.createElement('li');
		alist.appendChild(document.createTextNode('Cost: ' + data.person.cost));
		info.appendChild(alist);

		var blist = document.createElement('li');
		blist.appendChild(document.createTextNode('Employed By: ' + data.person.employedBy));
		info.appendChild(blist);

		var clist = document.createElement('li');
		clist.appendChild(document.createTextNode('Employed: ' + data.person.isEmployed));
		info.appendChild(clist);

		var dlist = document.createElement('li');
		dlist.appendChild(document.createTextNode('Satisfaction Level: ' + data.person.satisfactionLevel));
		info.appendChild(dlist);

		var elist = document.createElement('li');
		elist.appendChild(document.createTextNode('Time per Quarter: ' + data.person.timePerQuarter));
		info.appendChild(elist);

		parent.appendChild(info);
		

		$('#predetailsmodal').modal('show');
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

//Market functions
function runCompetition() {
	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/market/nextPeriod";

	request.success = function(response) {
    	console.log("Success: Moved game to Next Quarter!");
    	location.reload();
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function initDB() {
	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/market/initDb";

	request.success = function(response) {
    	console.log("Success: Database Initialized!");
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function evalPresales() {
	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/market/evaluate";

	request.success = function(response) {
		var resp = JSON.parse(response);
	    var data = resp.data;
    	console.log("Success: Presales evaluated. Results: ", data);
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

function getQuarter() {
	var request = new httpRequest();
	request.method = "GET";
	request.url = path + "/market/quarter";

	request.success = function(response) {
		console.log("Success: Fetched Current Quarter");
    	var resp = JSON.parse(response);
	    var data = resp.data;
	    var parent = document.getElementById('quarter');
	    parent.innerHTML = 'Admin Portal - Presales Game | Current Quarter: ' + data;
	};

	request.fail = function(error) {
	    console.log(error);
	};

	request.send();
}

window.addEventListener('load', function() {

	console.log("path ---> "+path);
	authToken = getCookie('x-access-token');
	console.log('Page loaded!')
	getCompanies();
	getOpportunities();
	getPresales();
	getQuarter();

	/*	
	var p = getCookie('path');
	if((p == '') || (p == null)){
		getPath();
	}
	else {
		path = getCookie('path');
		
		authToken = getCookie('x-access-token');
	    console.log('Page loaded!')
	    getCompanies();
	    getOpportunities();
	    getPresales();
	    getQuarter();
	}
	*/
})