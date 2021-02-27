import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const StockItem = ({ item }) => {

    return (
        <View style={styles.cardLayout}>
            <Text style={styles.itemName}>{item.name} ({item.unit})</Text>
            <View style={styles.itemRow}>
                <Text>Harga Beli</Text>
                <Text>{convertToRupiah(item.harga_beli.toString())}</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={{ fontWeight: 'bold' }}>Harga Jual</Text>
                <Text style={{ fontWeight: 'bold' }}>{convertToRupiah(item.price.toString())}</Text>
            </View>
        </View>
    )
}

const convertToRupiah = (angka) => {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + '.';
    return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');
}

const styles = StyleSheet.create({
    cardLayout: {
        borderRadius: 10,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        elevation: 3,
        justifyContent: 'space-between'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default StockItem