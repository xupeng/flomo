const { app, webContents, BrowserWindow } = require('electron');
const log = require('electron-log');
const settings = require('electron-settings');
const utils = require('./utils');
const { config } = require('./config');

app.on('ready', function () {
    app.name = config.name
    app.allowRendererProcessReuse = false

    let windowBounds = utils.loadWindowBounds()
    let lastUrls = settings.get('lastUrls')
    if (!lastUrls) {
        utils.newWindow(config.baseURL, windowBounds)
    } else {
        utils.newWindow(lastUrls[0], windowBounds)
        for (i = 1; i < lastUrls.length; i++) {
            utils.newTab(lastUrls[i])
        }
    }
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) utils.newWindow()
})

app.on('before-quit', function () {
    wcs = webContents.getAllWebContents()
    let lastUrls = []
    for (i = 0; i < wcs.length; i++) {
        let _url = wcs[i].getURL()
        lastUrls.unshift(_url)
    }
    settings.set('lastUrls', lastUrls)
})