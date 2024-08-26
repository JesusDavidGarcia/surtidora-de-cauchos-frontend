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
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontSize: 16,
  },
  client: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  section: {
    paddingVertical: 10,
    flexDirection: 'column',
  },
  divider: {
    width: '100%',
    padding: '16px',
    //borderTop: "1px solid #505050",
  },
  diagnostic: {
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
  image: {
    width: '200px',
    maxHeight: '400px',
  },
  images: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '20px',
  },
});

export default function ProjectionDocument(props) {
  const { data, clientName, projectionDate, showClient } = props;

  /*  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }; */

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        {showClient ? (
          <View style={styles.headers}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`Proyección para ${clientName}`}</Text>
            </View>
            <Text style={styles.date}>{new Date(projectionDate).toLocaleDateString()}</Text>
          </View>
        ) : (
          <View style={styles.headers}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`Proyección general`}</Text>
            </View>
            <Text style={styles.date}>{new Date(projectionDate).toLocaleDateString()}</Text>
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.appTableCol}>
              <Text style={styles.refTableCell}>{'Aplicación'}</Text>
            </View>
            {showClient ? (
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>{'Referencia'}</Text>
              </View>
            ) : (
              <View style={styles.refTableCol}>
                <Text style={styles.refTableCell}>{'Empaque'}</Text>
              </View>
            )}
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{'A producir'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{'A empacar'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{'Total'}</Text>
            </View>
          </View>
          {data.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.appTableCol}>
                <Text style={styles.refTableCell}>{reference.application}</Text>
              </View>
              {showClient ? (
                <View style={styles.refTableCol}>
                  <Text style={styles.refTableCell}>{reference.reference}</Text>
                </View>
              ) : (
                <View style={styles.refTableCol}>
                  <Text style={styles.refTableCell}>
                    {reference.packagingName ?? 'Sin empaque'}
                  </Text>
                </View>
              )}

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {reference.projectedProductionQuantity.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {reference.projectedPackagingQuantity.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.projectedQuantity.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
