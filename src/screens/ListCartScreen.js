import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import CartItem from '../components/CartItem';
import { MaterialIcons } from '@expo/vector-icons';

const db = SQLite.openDatabase('db.db');

const ListCartScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([]);
    const [notaId, setNotaId] = useState(0);
    const [total, setTotal] = useState(0);

    useFocusEffect(() => {
        const { id } = route.params;
        setNotaId(id);
        db.transaction(tx => {
            tx.executeSql('select * from cart where nota_id = ?', [id], (_, { rows }) => {
                setItems(rows._array);
            });
            tx.executeSql('select sum(total) as totalAll from cart where nota_id = ?', [id], (_, { rows }) => {
                // console.log(rows._array[0].totalAll);
                if (rows._array[0].totalAll !== null)
                    setTotal(rows._array[0].totalAll);
                else
                    setTotal(0);
            });
        });
    }, []);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}> Belanjaan </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Preview', { id: notaId })}>
                    <Text>Selesai</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={items}
                keyExtractor={(item, index) => {
                    return item.id.toString();
                }}
                ListFooterComponent={() => {
                    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ fontSize: 18 }}>Total Belanja</Text>
                        <Text style={{ fontSize: 18 }}>{convertToRupiah(total)}</Text>
                    </View>
                }}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity style={styles.cardItem} onPress={() => navigation.navigate('AddCart', { id: item.id, totalTemp: total })}>
                        <CartItem item={item} index={index} />
                    </TouchableOpacity>
                }} />
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddCart', { nota_id: notaId, totalTemp: total })}>
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
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
    root: {
        marginTop: 20,
        marginHorizontal: 10,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingHorizontal: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    list: {
        flex: 1,
        padding: 20,
    },
    cardItem: {
        marginBottom: 10,
        paddingBottom: 15,
        marginHorizontal: 2
    },
    fab: {
        position: 'absolute',
        width: 30,
        height: 30,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderRadius: 50,
        right: 20,
        bottom: 20
    }
});

export default ListCartScreen
