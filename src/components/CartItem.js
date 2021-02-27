import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const CartItem = ({ item, index }) => {

    return (
        <View style={styles.cardLayout}>
            <Text style={{ width: 20, fontSize: 16, }}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text>{item.qty + ' ' + item.unit + ' @ ' + convertToRupiah(item.price)}</Text>
                    <Text>{convertToRupiah(item.total)}</Text>
                </View>
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
        flexDirection: 'row'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CartItem