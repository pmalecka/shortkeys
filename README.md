Shortkeys for Firefox (WebExtension ported from Chrome)
================

A Firefox extension for custom keyboard shortcuts. Ported from chrome extension [Chrome Webstore](https://chrome.google.com/webstore/detail/shortkeys/logpjaacgmcbpdkdchjiaagddngobkck?hl=en-US)

### Installation

Download it [from Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/shortkeys-custom-shortcuts/).

### How to contribute

Don't be scared! Setup only takes 2 minutes.

**Step 1: Download and install dependencies**

0. Install node and its dependencies (these commands can be different when on Mac/Windows, tested on Ubuntu 16.04):
`sudo apt install nodejs nodejs-legacy npm ruby ruby-compass`
1. Fork this repo and clone your fork locally.
2. Open up the root directory in a terminal
3. Run `npm install` to install the node dependencies
4. Run `sudo npm install -g grunt` and `sudo npm install -g bower` to install grunt and bower globally
5. Run `bower install` to install the bower components

**Step 2: Enable the extension and debug**

0. Optionally - Download [Firefox Developer](https://www.mozilla.org/en-US/firefox/developer/).
1. Disable the Firefox Addons version of the extension if you have it enabled.
2. Follow [The Guide for debugging Firefox Addons] (https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging)
3. Open up [about:debugging](about:debugging) and check "Enable add-on debugging".
4. Click "Load Temporary Add-on" and browse to the `package/*.zip` directory to install it.
5. Click "Debug" next to your Add-on.
6. Open up the "Options" page to configure some shortcuts.

**Step 3: Start developing**

1. Run `grunt debug` and confirm that you see something [like this](https://www.dropbox.com/s/eykygm745vilifh/Screenshot%202015-05-18%2015.49.42.png?dl=0). In case the build fails, run `npm rebuild` and try again.
2. Edit some code. The extension itself does not reload automatically. You need to build and re-load it.
3. When you're done with your changes, push them to your fork and create a pull request for them.
4. You can also run `grunt build` at any time to bump the manifest version and generate a
   Webstore compatible zip file for upload.