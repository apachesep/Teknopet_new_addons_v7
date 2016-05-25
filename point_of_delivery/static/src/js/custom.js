/*
function Pager(tableName, itemsPerPage,showCurrentRecord) {
	console.log("pager function startedddddddddd",tableName,itemsPerPage,showCurrentRecord)
	this.tableName = tableName;
	this.itemsPerPage = itemsPerPage;
	this.currentPage = 1;
	this.pages = 0;
	this.inited = false;
	this.showCurrentRecord=showCurrentRecord;
	this.showRecords = function(from, to) {
		var rows = document.getElementById(tableName).rows;
		console.log("peliiiiiii rowssssssssssssssssssssssssssssss",rows)
		// i starts from 1 to skip table header row
		var showCount=0;
		for (var i = 1; i < rows.length; i++) {
		if (i < from || i > to) {
			rows[i].style.display = 'none';
			}
		else {
			++showCount;
			rows[i].style.display = '';
			}
		}
		this.count(showCount);
	}
	this.showPage = function(pageNumber) {
	if (! this.inited) {
		alert("not inited");
		return;
	}
	var oldPageAnchor = document.getElementById('pg'+this.currentPage);
	console.log("oldPageAnchorerrrrrrrrrrrrrrrrrrrrrrrr",oldPageAnchor)
	oldPageAnchor.className = 'pg-normal';
	this.currentPage = pageNumber;
	var newPageAnchor = document.getElementById('pg'+this.currentPage);
	newPageAnchor.className = 'pg-selected';
	var from = (pageNumber - 1) * itemsPerPage + 1;
	console.log("frommmmmmmmmmmmmmmmmmmmmmmmmmm",from)
	var to = from + itemsPerPage - 1;
	console.log("tooooooooooooooooooooooooooooooooooooo",to)
	this.showRecords(from, to);
	}
this.prev = function() {
	if (this.currentPage > 1)
	this.showPage(this.currentPage - 1);
}
this.next = function() {
	if (this.currentPage < this.pages) {
	this.showPage(this.currentPage + 1);
}
}
this.init = function() {
	var rows = document.getElementById(tableName).rows;
	console.log("bijiiiiiiiii rowssssssssssssssssssssssssssssss",rows)
	//var rowCount = $('#tableID >tbody >tr').length;
	//console.log("rowcountttttttttttttttttttttttt",rowCount)
	var records = (rows.length - 1);
	console.log("recordssssssssssssssssssssssssssss",records)
	this.pages = Math.ceil(records / itemsPerPage);
	console.log("this.pagesssssssssssssssss",this.pages)
	this.inited = true;
}
this.showPageNav = function(pagerName, positionId) {
	if (! this.inited) {
		alert("not inited");
	return;
}
var element = document.getElementById(positionId);
console.log("elementttttttttttttttttttttttttttttttt",element)
var pagerHtml = '<span onclick=" '+ pagerName + '.prev();" class="pg-normal"> &laquo; </span> ';
console.log("pagerHtmllllllllllllllllllll",pagerHtml)
	for (var page = 1; page <= this.pages; page++)
		pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> ';
		pagerHtml += '<span onclick="'+pagerName+'.next();" class="pg-normal"> &raquo;</span>';
		element.innerHTML = pagerHtml;
}
this.count=function(count){
	var rowCount = document.getElementById(tableName).rows.length-1;
	document.getElementById(showCurrentRecord).innerHTML = 'Showing '+count+' of '+rowCount;
	console.log("rowCounttttttttttttttttttttttt",rowCount)

}
}*/

