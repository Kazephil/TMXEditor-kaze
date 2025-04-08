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

class SourceLanguage {

    electron = require('electron');

    constructor() {
        this.electron.ipcRenderer.send('get-theme');
        this.electron.ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        this.electron.ipcRenderer.send('get-admin-languages');
        this.electron.ipcRenderer.on('admin-languages', (event: Electron.IpcRendererEvent, arg: Language[]) => {
            this.adminLanguages(arg);
        });
        this.electron.ipcRenderer.on('set-source-language', (event: Electron.IpcRendererEvent, arg: any) => {
            (document.getElementById('language') as HTMLSelectElement).value = arg.srcLang;
        });
        document.getElementById('change').addEventListener('click', () => {
            this.changeSrcLanguage();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                this.changeSrcLanguage();
            }
            if (event.code === 'Escape') {
                this.electron.ipcRenderer.send('close-srcLanguage');
            }
        });
        document.getElementById('language').focus();
        this.electron.ipcRenderer.send('srcLanguage-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }

    adminLanguages(langs: Language[]): void {
        let language: HTMLSelectElement = document.getElementById('language') as HTMLSelectElement;
        let options: string = '';
        for (let lang of langs) {
            options = options + '<option value="' + lang.code + '">' + lang.name + '</option>'
        }
        language.innerHTML = options;
        this.electron.ipcRenderer.send('get-source-language');
    }

    changeSrcLanguage(): void {
        let language: HTMLSelectElement = document.getElementById('language') as HTMLSelectElement;
        this.electron.ipcRenderer.send('change-source-language', language.value);
    }
}
