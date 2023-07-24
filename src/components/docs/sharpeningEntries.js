import React from "react";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
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
  section: {
    paddingVertical: 10,
    flexDirection: "column",
  },
  divider: {
    width: "100%",
    padding: "16px 0",
    borderTop: "1px solid #505050",
  },
  diagnostic: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  technician: {
    fontSize: 14,
    color: "#121212",
  },
  image: {
    width: "200px",
    maxHeight: "400px",
  },
  images: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
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
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  appTableCol: {
    width: "35%",
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

const emptyData = {
  title: "Informe de alertas Surtidora de Cauchos",
  createdOn: Date.now(),
  references: [],
};

export default function SharpeningEntriesDocument(props) {
  const { data } = props;

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{emptyData.title}</Text>
          <Text style={styles.date}>
            {new Date(emptyData.createdOn).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.refTableCol}>
              <Text style={styles.refTableCell}>Referencia</Text>
            </View>
            <View style={styles.refTableCol}>
              <Text style={styles.refTableCell}>Aplicación</Text>
            </View>
            <View style={styles.refTableCol}>
              <Text style={styles.refTableCell}>Operario</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cantidad</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Precio</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Fecha</Text>
            </View>
          </View>
          {data.map((reference, index) => (
            <View key={reference.id} style={styles.tableRow}>
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>
                  {reference.referenceName.split(" ")[0]}
                </Text>
              </View>
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>
                  {reference.referenceName.substring(
                    reference.referenceName.indexOf(" ")
                  )}
                </Text>
              </View>
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>{reference.sharpener}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.price}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>
                  {reference.sharpeningDate.split("T")[0]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
