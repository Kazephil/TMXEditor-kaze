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

export class ConvertCSV {

    langs: string[] = [];
    columns: number = 0;

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, css: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = css;
        });
        ipcRenderer.send('get-charsets');
        ipcRenderer.on('set-charsets', (event: Electron.IpcRendererEvent, arg: string[]) => {
            this.setCharsets(arg);
        });
        ipcRenderer.on('set-csvfile', (event: Electron.IpcRendererEvent, arg: any) => {
            this.setCsvFile(arg);
        });
        ipcRenderer.on('converted-tmx-file', (event: Electron.IpcRendererEvent, arg: string) => {
            (document.getElementById('tmxFile') as HTMLInputElement).value = arg;
        });
        ipcRenderer.on('set-preview', (event: Electron.IpcRendererEvent, arg: any) => {
            this.setPreview(arg);
        });
        ipcRenderer.on('csv-languages', (event: Electron.IpcRendererEvent, arg: any) => {
            this.csvLanguages(arg);
        });
        (document.getElementById('browseCsvFiles') as HTMLButtonElement).addEventListener('click', () => {
            this.browseCsvFiles();
        });
        (document.getElementById('browseTmxFiles') as HTMLButtonElement).addEventListener('click', () => {
            this.browseTmxFiles();
        });
        (document.getElementById('charSets') as HTMLSelectElement).addEventListener('change', () => {
            this.refreshPreview();
        });
        (document.getElementById('colSeps') as HTMLSelectElement).addEventListener('change', () => {
            this.refreshPreview();
        });
        (document.getElementById('textDelim') as HTMLSelectElement).addEventListener('change', () => {
            this.refreshPreview();
        });
        (document.getElementById('fixQuotes') as HTMLInputElement).addEventListener('change', () => {
            this.refreshPreview();
        });
        (document.getElementById('optionalDelims') as HTMLInputElement).addEventListener('change', () => {
            this.refreshPreview();
        });
        (document.getElementById('refreshPreview') as HTMLButtonElement).addEventListener('click', () => {
            this.refreshPreview();
        });
        (document.getElementById('setLanguages') as HTMLButtonElement).addEventListener('click', () => {
            this.setLanguages();
        });
        (document.getElementById('convert') as HTMLButtonElement).addEventListener('click', () => {
            this.convertFile();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-convertCsv');
            }
        });
        ipcRenderer.send('convertCsv-height', { width: document.body.clientWidth, height: document.body.clientHeight });
    }

    setCharsets(charsets: string[]): void {
        let options: string = '';
        for (let charset of charsets) {
            options = options + '<option value="' + charset + '">' + charset + '</option>';
        }
        let charSets = (document.getElementById('charSets') as HTMLSelectElement);
        charSets.innerHTML = options;
        charSets.value = 'UTF-16LE';
        let colSeps = (document.getElementById('colSeps') as HTMLSelectElement);
        colSeps.value = 'TAB';
    }

    browseCsvFiles(): void {
        ipcRenderer.send('get-csvfile');
    }

    setCsvFile(arg: string): void {
        let csvFile = (document.getElementById('csvFile') as HTMLInputElement);
        csvFile.value = arg;

        let tmxFile = (document.getElementById('tmxFile') as HTMLInputElement);
        if (tmxFile.value === '') {
            let index: number = arg.lastIndexOf('.');
            if (index !== -1) {
                tmxFile.value = arg.substring(0, index) + '.tmx';
            } else {
                tmxFile.value = arg + '.tmx';
            }
        }
        this.refreshPreview();
    }

    browseTmxFiles(): void {
        let value: string = (document.getElementById('csvFile') as HTMLInputElement).value;
        if (value !== '') {
            let index: number = value.lastIndexOf('.');
            if (index !== -1) {
                value = value.substring(0, index) + '.tmx';
            } else {
                value = value + '.tmx';
            }
        }
        ipcRenderer.send('get-converted-tmx', { default: value });
    }

    refreshPreview(): void {
        let csvFile = (document.getElementById('csvFile') as HTMLInputElement);
        if (csvFile.value === '') {
            return;
        }

        let columnsSeparator: string = '';
        let customSep: string = (document.getElementById('customSep') as HTMLInputElement).value;
        if (customSep !== '') {
            columnsSeparator = customSep;
        } else {
            columnsSeparator = (document.getElementById('colSeps') as HTMLSelectElement).value;
            if (columnsSeparator === 'TAB') {
                columnsSeparator = '\t';
            }
        }

        let textDelimiter: string = '';
        let customDel: string = (document.getElementById('customDel') as HTMLInputElement).value;
        if (customDel !== '') {
            textDelimiter = customDel;
        } else {
            textDelimiter = (document.getElementById('textDelim') as HTMLSelectElement).value;
        }
        let arg = {
            csvFile: csvFile.value,
            langs: this.langs,
            charSet: (document.getElementById('charSets') as HTMLSelectElement).value,
            columnsSeparator: columnsSeparator,
            textDelimiter: textDelimiter,
            fixQuotes: (document.getElementById('fixQuotes') as HTMLInputElement).checked,
            optionalDelims: (document.getElementById('optionalDelims') as HTMLInputElement).checked
        }
        ipcRenderer.send('get-csv-preview', arg);
    }

    setPreview(arg: any): void {
        this.columns = arg.cols;
        if (arg.langCodes.length > 0) {
            this.langs = arg.langCodes.splice(0);
        }
        (document.getElementById('preview') as HTMLDivElement).innerHTML = arg.preview;
        (document.getElementById('columns') as HTMLSpanElement).innerHTML = '' + this.columns;
    }

    setLanguages(): void {
        let csvFile = (document.getElementById('csvFile') as HTMLInputElement);
        if (csvFile.value === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'selectCsv', parent: 'convertCSV' });
            return;
        }
        if (this.columns === 0) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'columnsNotDetected', parent: 'convertCSV' });
            return;
        }
        ipcRenderer.send('get-csv-languages', { columns: this.columns, languages: this.langs });
    }

    csvLanguages(arg: string[]): void {
        this.langs = arg;
        this.refreshPreview();
        (document.getElementById('convert') as HTMLButtonElement).focus();
    }

    convertFile(): void {
        let csvFile = (document.getElementById('csvFile') as HTMLInputElement);
        if (csvFile.value === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'selectCsv', parent: 'convertCSV' });
            return;
        }
        let tmxFile = (document.getElementById('tmxFile') as HTMLInputElement);
        if (tmxFile.value === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'selectTmx', parent: 'convertCSV' });
            return;
        }
        if (this.langs.length < 2) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'setLanguages', parent: 'convertCSV' });
            return;
        }
        if (this.langs.length != this.columns) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'convertCSV', key: 'setAllLanguages', parent: 'convertCSV' });
            return;
        }

        let columnsSeparator: string = '';
        let customSep: string = (document.getElementById('customSep') as HTMLInputElement).value;
        if (customSep !== '') {
            columnsSeparator = customSep;
        } else {
            columnsSeparator = (document.getElementById('colSeps') as HTMLSelectElement).value;
            if (columnsSeparator === 'TAB') {
                columnsSeparator = '\t';
            }
        }

        let textDelimiter: string = '';
        let customDel: string = (document.getElementById('customDel') as HTMLInputElement).value;
        if (customDel !== '') {
            textDelimiter = customDel;
        } else {
            textDelimiter = (document.getElementById('textDelim') as HTMLSelectElement).value;
        }
        let arg = {
            csvFile: csvFile.value,
            tmxFile: tmxFile.value,
            langs: this.langs,
            charSet: (document.getElementById('charSets') as HTMLSelectElement).value,
            columnsSeparator: columnsSeparator,
            textDelimiter: textDelimiter,
            fixQuotes: (document.getElementById('fixQuotes') as HTMLInputElement).checked,
            optionalDelims: (document.getElementById('optionalDelims') as HTMLInputElement).checked,
            openTMX: (document.getElementById('openTMX') as HTMLInputElement).checked
        }
        ipcRenderer.send('convert-csv-tmx', arg);
    }
}
