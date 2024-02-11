import React from "react";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Times-Roman",
  },
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 14,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    margin: "16px 0",
    borderWidth: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    background: "#f6f6f6",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  appTableCol: {
    width: "45%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCell: {
    margin: "2px",
    fontSize: 14,
  },
  tableCell: {
    margin: "auto",
    fontSize: 14,
  },
});

export default function PackagingStateDocument(props) {
  const { data, columns, title } = props;

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map((col, idx) => (
              <View
                key={idx}
                style={{
                  ...styles.tableCol,
                  width: `${(100 / columns.length).toFixed(0)}%`,
                }}
              >
                <Text style={styles.tableCell}>{col.field}</Text>
              </View>
            ))}
          </View>
          {data.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              {columns.map((col, colIdx) => (
                <View
                  key={colIdx}
                  style={{
                    ...styles.tableCol,
                    width: `${(100 / columns.length).toFixed(0)}%`,
                  }}
                >
                  <Text style={styles.refTableCell}>
                    {reference[col.field]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
