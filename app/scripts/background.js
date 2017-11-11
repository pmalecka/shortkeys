'use strict';

function copyToClipboard(text) {
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = 'off';
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy', false, null);
  document.body.removeChild(copyDiv);
}

function selectTab(direction) {
  browser.tabs.query({currentWindow: true}).then(function(tabs) {
    if (tabs.length <= 1) {
      return;
    }
    browser.tabs.query({active: true, currentWindow: true}).then(function(currentTabs) {
      var toSelect;
      var currentTab = currentTabs[0];
      switch (direction) {
        case 'next':
          toSelect = tabs[(currentTab.index + 1 + tabs.length) % tabs.length];
          break;
        case 'previous':
          toSelect = tabs[(currentTab.index - 1 + tabs.length) % tabs.length];
          break;
        case 'first':
          toSelect = tabs[0];
          break;
        case 'last':
          toSelect = tabs[tabs.length - 1];
          break;
      }
      browser.tabs.update(toSelect.id, { active: true });
    });
  });
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var action = request.action;
  if (action === 'getKeys') {

    sendResponse(browser.storage.local.get().then(function (response) {

      if (response && response.keys) {
        return(response.keys);
      }
    }));
  }
  else if (action === 'cleardownloads') {
    // browser.browsingData.remove({'since': 0}, {'downloads': true});
    browser.downloads.erase({});
  }
  else if (action === 'nexttab') {
    selectTab('next');
  }
  else if (action === 'prevtab') {
    selectTab('previous');
  }
  else if (action === 'firsttab') {
    selectTab('first');
  }
  else if (action === 'lasttab') {
    selectTab('last');
  }
  else if (action === 'newtab') {
    browser.tabs.create({});
  }
  else if (action === 'closetab') {
    browser.tabs.query({active: true, currentWindow: true}).then(function(currentTabs) {
      var currentTab = currentTabs[0];
      browser.tabs.remove(currentTab.id);
    });
  }
  else if (action === 'clonetab') {
    browser.tabs.query({active: true, currentWindow: true}).then(function(currentTabs) {
      var currentTab = currentTabs[0];
      browser.tabs.duplicate(currentTab.id);
    });
  }
  else if (action === 'onlytab') {
    browser.tabs.query({ windowId: browser.windows.WINDOW_ID_CURRENT, pinned: false, active: false }).then(function(tabs){
      var ids = [];
      tabs.forEach(function(tab) {
        ids.push(tab.id);
      });
      browser.tabs.remove(ids);
    });
  }
  else if (action === 'togglepin') {
    browser.tabs.query({active: true, currentWindow: true}).then(function(currentTabs) {
      var currentTab = currentTabs[0];
      var toggle = !currentTab.pinned;
      browser.tabs.update(currentTab.id, { pinned: toggle });
    });
  }
  else if (action === 'copyurl') {
    copyToClipboard(request.text);
  }
  else if (action === 'movetableft') {
    if  (sender.tab.index > 0) {
      browser.tabs.move(sender.tab.id, {'index': sender.tab.index -1});
    }
  }
  else if (action === 'movetabright') {
    browser.tabs.move(sender.tab.id, {'index': sender.tab.index +1});
  }
  else if (action === 'gototab') {
    var createNewTab = function() {
      browser.tabs.create({url: request.openurl});
    };
    if (request.matchurl) {
      browser.tabs.query({url: request.matchurl, currentWindow: true}).then(function (tabs) {
        if (tabs.length > 0) {
          browser.tabs.update(tabs[0].id, {active: true});
        } else {
          createNewTab();
        }
      });
    } else {
      createNewTab();
    }
  }
  else if (action === 'newwindow') {
    browser.windows.create({});
  }
  else if (action === 'newprivatewindow') {
    browser.windows.create({incognito: true});
  }
  else if (action === 'openbookmark') {
    browser.bookmarks.search({title: request.bookmark}).then(function (nodes) {
      var openNode;
      for (var i = nodes.length; i-- > 0;) {
        var node = nodes[i];
        if (node.url && node.title === request.bookmark) {
          openNode = node;
          break;
        }
      }
      browser.tabs.update(sender.tab.id, {url: decodeURI(openNode.url)});
    });
  }
  else {
    sendResponse({});
  }
});

