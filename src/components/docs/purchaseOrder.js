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
  titleContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
  },
  client: {
    fontSize: 14,
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
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCol: {
    width: "25%",
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

export default function PurchaseOrderDocument(props) {
  const { data } = props;

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {`Orden de compra #${data.orderNumber}`}
            </Text>
            <Text style={styles.client}>{data.clientName}</Text>
          </View>

          <Text style={styles.date}>
            {new Date(data.createdOn).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.refTableCol}>
              <Text style={styles.refTableCell}>{"Referencia"}</Text>
            </View>
            <View style={styles.appTableCol}>
              <Text style={styles.refTableCell}>{"Aplicación"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{"Cantidad"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{"Faltante"}</Text>
            </View>
          </View>
          {data.references.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>
                  {reference.referenceName.split(" ")[0]}
                </Text>
              </View>
              <View style={styles.appTableCol}>
                <Text style={styles.refTableCell}>
                  {reference.referenceName.substring(
                    reference.referenceName.indexOf(" ")
                  )}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {reference.missingQuantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/*  <View style={styles.divider}></View> */}
        <Text
          style={styles.diagnostic}
        >{`Peso total: ${data.shipmentWeight} Kg`}</Text>
        <Text
          style={styles.diagnostic}
        >{`Número de cajas: ${data.nuberOfBoxes}`}</Text>
        <Text
          style={styles.diagnostic}
        >{`Material faltante: ${data.missingMaterial} Kg`}</Text>
      </Page>
    </Document>
  );
}