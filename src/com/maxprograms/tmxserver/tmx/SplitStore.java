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

package com.maxprograms.tmxserver.tmx;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.maxprograms.languages.Language;
import com.maxprograms.tmxserver.models.TUnit;
import com.maxprograms.tmxserver.utils.TextUtils;
import com.maxprograms.xml.Element;
import com.maxprograms.xml.Indenter;

public class SplitStore implements StoreInterface {

	protected static final Logger LOGGER = Logger.getLogger(SplitStore.class.getName());

	private int fileCount;
	private FileOutputStream out;
	private long tuCount;
	private Element header;
	private File file;
	private long written = 0;
	private long limit;

	private int indentation;

	public SplitStore(File f, long l) {
		file = f;
		limit = l;
		fileCount = 1;
	}

	private void createFile() throws IOException {
		if (out != null) {
			writeString(TextUtils.padding(1, indentation) + "</body>\n");
			writeString("</tmx>");
			out.close();
		}
		String name = file.getAbsolutePath();
		if (!name.toLowerCase().endsWith(".tmx")) {
			name = name + ".tmx";
		}
		String newFile = name.substring(0, name.length() - 4) + "_" + fileCount + ".tmx";
		out = new FileOutputStream(new File(newFile));
		writeString("""
				<?xml version="1.0" encoding="UTF-8"?>
				<!DOCTYPE tmx PUBLIC "-//LISA OSCAR:1998//DTD for Translation Memory eXchange//EN" "tmx14.dtd">
				<tmx version="1.4">
				""");
		writeString(TextUtils.padding(1, indentation) + header.toString() + "\n");
		writeString(TextUtils.padding(1, indentation) + "<body>\n");
		fileCount++;
	}

	@Override
	public void storeTU(Element tu) throws IOException {
		Indenter.indent(tu, 3, indentation);
		writeString(TextUtils.padding(2, indentation) + tu.toString() + "\n");
		tuCount++;
		written++;
		if (written == limit) {
			createFile();
			written = 0;
		}
	}

	private void writeString(String string) throws IOException {
		out.write(string.getBytes(StandardCharsets.UTF_8));
	}

	@Override
	public void storeHeader(Element element) {
		header = element;
		try {
			createFile();
		} catch (IOException e) {
			LOGGER.log(Level.SEVERE, e.getMessage(), e);
		}
	}

	@Override
	public Element getHeader() {
		return header;
	}

	@Override
	public Set<String> getLanguages() {
		return new TreeSet<>();
	}

	@Override
	public List<TUnit> getUnits(long start, int count, String filterText, Language filterLanguage,
			boolean caseSensitiveFilter, boolean filterUntranslated, boolean regExp, Language filterSrcLanguage,
			Language sortLanguage, boolean ascending) {
		return new ArrayList<>();
	}

	@Override
	public void close() throws IOException {
		writeString(TextUtils.padding(1, indentation) + "</body>\n");
		writeString("</tmx>");
		out.close();
	}

	@Override
	public long getCount() {
		return tuCount;
	}

	@Override
	public long getDiscarded() {
		return 0;
	}

	@Override
	public String saveData(String id, String lang, String value) {
		return null;
	}

	@Override
	public void writeFile(File f) {
		// do nothing
	}

	@Override
	public long getSaved() {
		return 0l;
	}

	@Override
	public void commit() {
		// do nothing
	}

	@Override
	public Element getTu(String id) {
		return null;
	}

	@Override
	public void delete(List<String> selected) {
		// do nothing
	}

	@Override
	public void replaceText(String search, String replace, Language language, boolean regExp) {
		// do nothing
	}

	@Override
	public long getProcessed() {
		return tuCount;
	}

	@Override
	public void insertUnit(String id) {
		// do nothing
	}

	@Override
	public long removeUntranslated(Language lang) {
		return 0;
	}

	@Override
	public void removeSameAsSource(Language lang) {
		// do nothing
	}

	@Override
	public void addLanguage(Language lang) {
		// do nothing
	}

	@Override
	public void removeLanguage(Language lang) {
		// do nothing
	}

	@Override
	public void removeTags() {
		// do nothing
	}

	@Override
	public void changeLanguage(Language oldLanguage, Language newLanguage) {
		// do nothing
	}

	@Override
	public void removeDuplicates() {
		// do nothing
	}

	@Override
	public void removeSpaces() {
		// do nothing
	}

	@Override
	public void consolidateUnits(Language lang) {
		// do nothing
	}

	@Override
	public void setTuAttributes(String id, List<String[]> attributes) {
		// do nothing
	}

	@Override
	public void setTuProperties(String id, List<String[]> properties) {
		// do nothing
	}

	@Override
	public void setTuNotes(String id, List<String> notes) {
		// do nothing
	}

	@Override
	public void exportDelimited(String delimited) {
		// do nothing
	}

	@Override
	public void exportExcel(String file) {
		// do nothing
	}

	@Override
	public long getExported() {
		return 0l;
	}

	@Override
	public Element getTuv(String id, String lang) {
		return null;
	}

	@Override
	public void setTuvAttributes(String id, String lang, List<String[]> attributes) {
		// do nothing
	}

	@Override
	public void setTuvProperties(String id, String lang, List<String[]> dataList) {
		// do nothing
	}

	@Override
	public void setTuvNotes(String id, String lang, List<String> notes) {
		// do nothing
	}

	@Override
	public void setIndentation(int indentation) {
		this.indentation = indentation;
	}
}
