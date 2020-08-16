// Copyright 2020 Dean Liao. All rights reserved.
// Use of this source code is governed by MIT license that can be
// found in the LICENSE file.

'use strict';

console.log("fixtw.js");

// Extracts license plates from image filenames.
function extractLicensePlates() {
	let result = [];
	for (let elem of document.getElementsByClassName('image_picker_image')) {
		let it = elem.innerText;
		if (!it) {
			continue;
		}
		for (let chunk of it.split('_')) {
			let match = chunk.match(/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/);
			if (!match) {
				continue;
			}
			let plate = match[0].toUpperCase();
			if (result.indexOf(plate) == -1) {
				result.push(plate);
			}
		}
	}
	document.getElementById('case_plate_number').value = result.join(' ');
	return false;
}

function storeForm() {
	let address = document.getElementById('case_illegal_place').value;
	let datetime = document.getElementById('case_illegal_at').value;
	let comment = document.getElementById('case_comment').value;	
	let store = {
		'address': address,
		'datetime': datetime,
		'comment': comment};

	chrome.storage.sync.set(store, function() {
		console.log('stored: ' + JSON.stringify(store));
	});
	return false;
}

function loadForm() {
    chrome.storage.sync.get(
		['address', 'datetime', 'comment'],
	 	function(result) {
			console.log('load result: ' + JSON.stringify(result));
			document.getElementById('case_illegal_place').value = result.address;
			document.getElementById('case_illegal_at').value = result.datetime;
			document.getElementById('case_comment').value = result.comment;			
    });
	return false;
}

// Inserts action links.
function insertLinks() {
	let formGroup = document.createElement('div');
	formGroup.class = 'form-group flex';
	function addLink(text, id, clickCb) {
		let link = document.createElement('A');
		link.innerText = text;
		link.href = 'javascript:void(0);';
		link.id = id;
		link.addEventListener('click', clickCb);
		formGroup.appendChild(link);
	}
	function addFlex() {
		let div = document.createElement('div');
		div.class='flex:1';
		formGroup.appendChild(div);
	}
	addLink('Extract license plates', 'extract-plates', extractLicensePlates);
	addFlex();
	addLink('Load form', 'load-form', loadForm);
	
	document.getElementById('submit').parentElement.parentElement.parentElement.appendChild(formGroup);
}

// On address paste, remove zip code.
function observeAddressPaste() {
	let addrElem = document.getElementById('case_illegal_place');
	addrElem.addEventListener('paste', (event) => {
		let paste = (event.clipboardData || window.clipboardData).getData('text');
		paste = paste.replace(/^[0-9 ]*/, "");
		addrElem.value = paste;
		
		event.preventDefault();
	});
}

// On submit, store form content.
function observeAddressPaste() {
	let submitButton = document.getElementById('submit');
	submitButton.addEventListener('click', (event) => {
		storeForm();
	});
}

insertLinks();
observeAddressPaste();
