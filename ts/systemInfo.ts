/*******************************************************************************
 * Copyright (c) 2018-2025 Maxprograms.
 *
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 1.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/org/documents/epl-v10.html
 *
 * Contributors:
 *     Maxprograms - initial API and implementation
 *******************************************************************************/

class SystemInformation {

    electron = require('electron');

    constructor() {
        this.electron.ipcRenderer.send('get-theme');
        this.electron.ipcRenderer.send('get-version');
        this.electron.ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        this.electron.ipcRenderer.send('get-system-info');
        this.electron.ipcRenderer.on('set-system-info', (event: Electron.IpcRendererEvent, arg: any) => {
            this.setInfo(arg);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                this.electron.ipcRenderer.send('close-systemInfo');
            }
        });

    }

    setInfo(info: any) {
        document.getElementById('tmxeditor').innerText = info.tmxeditor;
        document.getElementById('bcp47j').innerText = info.bcp47j;
        document.getElementById('xmljava').innerText = info.xmljava;
        document.getElementById('java').innerText = info.java;
        document.getElementById('electron').innerText = info.electron;
        this.electron.ipcRenderer.send('systemInfo-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }
}
