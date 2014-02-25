/**
 * Dewey Launcher
 * 
 * Author: Luke Taylor
 * Version: 1.0
 * Description: This is an accompanying extension to work with the Dewey Bookmark App: http://deweyapp.io/
 *
 */

const APP_ID = 'aahpfefkmihhdabllidnlipghcjgpkdm';
const WEB_URL = 'chrome-extension://aahpfefkmihhdabllidnlipghcjgpkdm/app.html#/main';

chrome.browserAction.onClicked.addListener(handleClick);

// Search for Dewey URLs
function handleClick(tab) {
    chrome.management.getAll(function (apps) {
        var urls = [WEB_URL];
        for (var i = 0; i < apps.length; i++) {
            var app = apps[i];
            if (app.id === APP_ID && app.enabled) {
                urls.unshift(app.appLaunchUrl);
                break;
            }
        }
        gatherTabs(urls);
    });
}

// Build a list up of all tabs
function gatherTabs(urls) {
    var allTheTabs = [];
    var windowsChecked = 0;
    chrome.windows.getAll(function (windows) {
        for (var i = 0; i < windows.length; i++) {
            chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
                windowsChecked++;
                allTheTabs = allTheTabs.concat(tabs);
                if (windowsChecked === windows.length) {
                    openApp(urls, allTheTabs);
                }
            });

        }
    });
}

// Jump to Dewey tab if open or create a new tab
function openApp(urls, tabs) {
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        for (var j = 0; j < tabs.length; j++) {
            var tab = tabs[j];
            if (tab.url.indexOf(url) === 0) {
                chrome.tabs.update(tab.windowId, {selected :  true});
                chrome.tabs.update(tab.id, {selected :  true});
                return;
            }
        }
    }
    chrome.tabs.create({ url : urls[0] });
};