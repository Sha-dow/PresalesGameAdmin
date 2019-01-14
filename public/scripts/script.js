var path = "http://localhost:3000/api/v1";
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
	    	console.log(comp);

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

		var tableheader = document.createElement('b');
		tableheader.appendChild(document.createTextNode('Product Basic Features'));
		info.appendChild(document.createElement('hr'));
		info.appendChild(tableheader);

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
}

//Presales Functions
function getPresales() {
	console.log("getPresales called");
}

window.addEventListener('load', function() {
	authToken = getCookie('x-access-token');
    console.log('Page loaded!')
    getCompanies();
    getOpportunities();
    getPresales();
})