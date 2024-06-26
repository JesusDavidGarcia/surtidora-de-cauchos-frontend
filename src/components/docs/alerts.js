import React from 'react';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Times-Roman',
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 14,
  },
  section: {
    paddingVertical: 10,
    flexDirection: 'column',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    margin: '16px 0',
    borderWidth: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    background: '#f6f6f6',
  },
  tableCol: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  appTableCol: {
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCell: {
    margin: '2px',
    fontSize: 14,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 14,
  },
});

const emptyData = {
  title: 'Informe de alertas Surtidora de Cauchos',
  createdOn: Date.now(),
  references: [],
};

export default function AlertDocument(props) {
  const { data, columns, sharpening } = props;

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{emptyData.title}</Text>
          <Text style={styles.date}>{new Date(emptyData.createdOn).toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.refTableCol}>
              <Text style={styles.refTableCell}>Referencia</Text>
            </View>
            <View style={styles.appTableCol}>
              <Text style={styles.refTableCell}>Aplicación</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Mínimo</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Máximo</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Actual</Text>
            </View>
          </View>
          {data.map((reference, index) => (
            <View key={reference.id} style={styles.tableRow}>
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>{reference.reference}</Text>
              </View>
              <View style={styles.appTableCol}>
                <Text style={styles.refTableCell}>{reference.application}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.minimum}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.maximum}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.currentQuantity}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{'Reporte de refilado'}</Text>
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
          {sharpening.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              {columns.map((col, colIdx) => (
                <View
                  key={colIdx}
                  style={{
                    ...styles.tableCol,
                    width: `${(100 / columns.length).toFixed(0)}%`,
                  }}
                >
                  <Text style={styles.tableCell}>{reference[col.field]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
