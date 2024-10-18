import React from 'react';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  leftTableCell: {
    margin: '2px',
    fontSize: 14,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 14,
  },
});

const emptyData = {
  title: 'Informe de refilado Surtidora de Cauchos',
  createdOn: Date.now(),
  references: [],
};

export default function SharpeningEntriesDocument(props) {
  const { data } = props;
  const sharpeners = [...new Set(data.map((m) => m.refilador))];

  const numberWithCommas = (number) => {
    return `$ ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  /* console.log(
    sharpeners.map(
      (sh, key) =>
        `${sh}: ${numberWithCommas(
          data
            .filter((m) => m.refilador === sh)
            .map((m) => m.precio)
            .reduce((accumulator, currentValue) => accumulator + currentValue)
            .toFixed(0),
        )}`,
    ),
  ); */

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{emptyData.title}</Text>
          <Text style={styles.date}>{new Date(emptyData.createdOn).toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.leftTableCell}>Fecha</Text>
            </View>

            <View style={{ ...styles.tableCol, width: '40%' }}>
              <Text style={styles.leftTableCell}>Aplicación</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '20%' }}>
              <Text style={styles.leftTableCell}>Refilador</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.tableCell}>Cantidad</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.tableCell}>Precio</Text>
            </View>
          </View>
          {data.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: '15%' }}>
                <Text style={styles.tableCell}>{reference.fecha}</Text>
              </View>

              <View style={{ ...styles.tableCol, width: '40%' }}>
                <Text style={styles.leftTableCell}>
                  {reference.referencia.substring(reference.referencia.indexOf(' '))}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: '20%' }}>
                <Text style={styles.leftTableCell}>{reference.refilador}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: '10%' }}>
                <Text style={styles.tableCell}>{reference.refilado.toFixed(2)}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: '15%' }}>
                <Text style={styles.tableCell}>{numberWithCommas(reference.precio)}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <Text style={styles.title}>{'Resumen por refilador'}</Text>
        </View>

        {sharpeners.map((sh, key) => (
          <Text key={key} style={styles.date}>
            {`${sh}: ${numberWithCommas(
              data
                .filter((m) => m.refilador === sh)
                .map((m) => m.precio)
                .reduce((accumulator, currentValue) => accumulator + currentValue)
                .toFixed(0),
            )}`}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
