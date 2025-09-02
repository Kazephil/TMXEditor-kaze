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

module tmxserver {
	
	exports com.maxprograms.tmxserver;
	exports com.maxprograms.tmxserver.models;
	
	requires java.base;
	requires java.xml;
	requires java.sql;
	requires tmxvalidator;
	requires transitive bcp47j;
	requires transitive jdk.httpserver;
	requires transitive json;
	requires transitive xmljava;
	requires org.xerial.sqlitejdbc;
}