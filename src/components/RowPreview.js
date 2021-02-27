import React from 'react'
import { Text, View } from 'react-native'

const RowPreview = ({ item, index }) => {
    return (
        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
            <View style={{ width: '5%' }}>
                <Text style={{ fontSize: 16 }}>{index + 1}</Text>
            </View>
            <View style={{ width: '45%' }}>
                <Text style={{ fontSize: 16 }}>{item.name + ' (' + item.unit + ')'}</Text>
            </View>
            <View style={{ width: '10%' }}>
                <Text style={{ fontSize: 16 }}>{item.qty.toString()}</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16 }}>{convertToRupiah(item.price.toString())}</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16 }}>{convertToRupiah(item.total.toString())}</Text>
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

export default RowPreview
