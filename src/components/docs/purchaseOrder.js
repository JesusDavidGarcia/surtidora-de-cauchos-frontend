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
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableColWithPackaging: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  appTableCol: {
    width: '45%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  appTableColWithPackaging: {
    width: '40%',
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

export default function PurchaseOrderDocument(props) {
  const { data } = props;

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.headers}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{`Orden de compra #${data.orderNumber}`}</Text>
            <Text style={styles.client}>{data.clientName}</Text>
          </View>

          <Text style={styles.date}>{new Date(data.createdOn).toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={data.usePackaging ? styles.refTableColWithPackaging : styles.refTableCol}>
              <Text style={styles.refTableCell}>{'Referencia'}</Text>
            </View>
            <View style={data.usePackaging ? styles.appTableColWithPackaging : styles.appTableCol}>
              <Text style={styles.refTableCell}>{'Aplicación'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{'Cantidad'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{'Por producir'}</Text>
            </View>
            {data.usePackaging ? (
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{'Por empacar'}</Text>
              </View>
            ) : null}
          </View>
          {data.references.map((reference, index) => (
            <View key={index} style={styles.tableRow}>
              <View
                style={data.usePackaging ? styles.refTableColWithPackaging : styles.refTableCol}
              >
                <Text style={styles.refTableCell}>{reference.referenceName.split(' ')[0]}</Text>
              </View>
              <View
                style={data.usePackaging ? styles.appTableColWithPackaging : styles.appTableCol}
              >
                <Text style={styles.refTableCell}>
                  {reference.referenceName.substring(reference.referenceName.indexOf(' '))}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{reference.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {reference.missingQuantity % 1 === 0
                    ? reference.missingQuantity
                    : reference.missingQuantity.toFixed(2)}
                </Text>
              </View>
              {data.usePackaging ? (
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{reference.missingPackagingQuantity}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        {/* <Text
          style={styles.diagnostic}
        >{`NOTA: LA FACTURA ELECTRÓNICA SE ENVIÓ AL CORREO`}</Text> */}

        <View style={styles.divider}></View>

        <Text style={styles.diagnostic}>{`Peso total: ${data.shipmentWeight} Kg`}</Text>
        <Text style={styles.diagnostic}>{`Número de cajas: ${data.numberOfBoxes}`}</Text>
        <Text style={styles.diagnostic}>{`Material faltante: ${data.missingMaterial} Kg`}</Text>

        <React.Fragment>
          <View style={styles.footer}>
            <View style={styles.titleContainer}>
              <Text style={styles.subTitle}>{`Factura de venta: ${data.invoiceNumber}`}</Text>
            </View>
            <Text style={styles.date}>
              {data.invoiceNumber !== '' ? new Date(data.invoiceDate).toLocaleDateString() : null}
            </Text>
          </View>
          <View>
            <Text style={styles.diagnostic}>{`Valor: $ ${
              data.invoiceNumber !== '' ? numberWithCommas(parseFloat(data.invoicePrice)) : ''
            }`}</Text>
            <Text style={styles.diagnostic}>{`Descuento: ${
              data.invoiceNumber !== '' ? data.invoiceDiscount : ''
            }`}</Text>
            <Text style={styles.diagnostic}>{`Sello: ${data.invoiceNumber}`}</Text>
          </View>
        </React.Fragment>
      </Page>
    </Document>
  );
}
