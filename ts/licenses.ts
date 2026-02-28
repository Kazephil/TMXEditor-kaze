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

export class Licenses {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        (document.getElementById('TMXEditor') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('TMXEditor');
        });
        (document.getElementById('bcp47j') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('BCP47J');
        });
        (document.getElementById('electron') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('electron');
        });
        (document.getElementById('Java') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('Java');
        });
        (document.getElementById('sdltm') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('sdltm');
        });
        (document.getElementById('SQLite') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('SQLite');
        });
        (document.getElementById('TMXValidator') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('TMXValidator');
        });
        (document.getElementById('typesxml') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('typesxml');
        });
        (document.getElementById('XMLJava') as HTMLAnchorElement).addEventListener('click', () => {
            this.openLicense('XMLJava');
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-licenses');
            }
        });
        ipcRenderer.send('licenses-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }

    openLicense(type: string): void {
        ipcRenderer.send('open-license', type);
    }
}
