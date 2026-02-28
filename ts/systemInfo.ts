/*******************************************************************************
 * Copyright (c) 2018-2026 Maxprograms.
 *
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 1.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/org/documents/epl-v10.html
 *
 * Contributors:
 *     Maxprograms - initial API and implementation
 *******************************************************************************/

import { ipcRenderer } from "electron";

export class SystemInformation {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.send('get-version');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        ipcRenderer.send('get-system-info');
        ipcRenderer.on('set-system-info', (event: Electron.IpcRendererEvent, arg: any) => {
            this.setInfo(arg);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-systemInfo');
            }
        });
    }

    setInfo(info: any) {
        (document.getElementById('tmxeditor') as HTMLTableCellElement).innerText = info.tmxeditor;
        (document.getElementById('bcp47j') as HTMLTableCellElement).innerText = info.bcp47j;
        (document.getElementById('xmljava') as HTMLTableCellElement).innerText = info.xmljava;
        (document.getElementById('java') as HTMLTableCellElement).innerText = info.java;
        (document.getElementById('electron') as HTMLTableCellElement).innerText = info.electron;
        ipcRenderer.send('systemInfo-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }
}
