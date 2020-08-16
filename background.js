// Copyright 2020 Dean Liao. All rights reserved.
// Use of this source code is governed by MIT license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
	// Enable the extension icon when browsing https://fixtw.com/cases/new page.
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {
					hostEquals: 'fixtw.com',
					pathContains: 'cases/new'},
			})],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});
