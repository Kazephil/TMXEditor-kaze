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
import { Language } from "./language.js";

export class SearchReplace {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        ipcRenderer.send('get-file-languages');
        ipcRenderer.on('file-languages', (event: Electron.IpcRendererEvent, arg: Language[]) => {
            this.filterLanguages(arg);
        });
        
        (document.getElementById('replace') as HTMLButtonElement).addEventListener('click', () => {
            this.replace();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                this.replace();
            }
            if (event.code === 'Escape') {
                ipcRenderer.send('close-replaceText');
            }
        });
        (document.getElementById('searchText') as HTMLInputElement).focus();
        ipcRenderer.send('replaceText-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }

    filterLanguages(langs: Language[]): void {
        let language: HTMLSelectElement = document.getElementById('language') as HTMLSelectElement;
        let options: string = '';
        for (let lang of langs) {
            options = options + '<option value="' + lang.code + '">' + lang.name + '</option>'
        }
        language.innerHTML = options;
    }

    replace(): void {
        let searchText: string = (document.getElementById('searchText') as HTMLInputElement).value;
        let replaceText: string = (document.getElementById('replaceText') as HTMLInputElement).value;
        let language: string = (document.getElementById('language') as HTMLSelectElement).value;
        if (searchText.length === 0) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'searchReplace', key: 'enterSearchText', parent: 'searchReplace' });
            return;
        }
        if (replaceText.length === 0) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'searchReplace', key: 'enterReplaceText', parent: 'searchReplace' });
            return;
        }
        let regularExpression: boolean = (document.getElementById('regularExpression') as HTMLInputElement).checked;
        ipcRenderer.send('replace-request', { search: searchText, replace: replaceText, lang: language, regExp: regularExpression });
    }
}
