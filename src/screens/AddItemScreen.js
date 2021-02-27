import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, TextInput, ScrollView } from 'react-native'
import LayoutWithHeader from '../components/LayoutWithHeader';
import { MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

const AddItemScreen = ({ navigation, route }) => {
    const [itemId, setItemId] = useState(0);
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [hargaBeli, setHargaBeli] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        var id = 0;
        if (route.params !== undefined) {
            id = route.params.id;
            setItemId(id);
        }
        if (id !== 0) {
            db.transaction(tx => {
                tx.executeSql('select * from item where id=?', [id], (_, { rows }) => {
                    const data = rows._array[0];
                    setName(data.name);
                    setUnit(data.unit);
                    setPrice(data.price.toString());
                    setHargaBeli(data.harga_beli.toString())
                }
                );
            });
        }
    }, []);

    const saveItem = () => {
        if (name.length > 0 && unit.length > 0 && price.length > 0 && hargaBeli.length > 0) {
            db.transaction(
                tx => {
                    if (itemId === 0) {
                        tx.executeSql('insert into item (name, unit, price, harga_beli) values (?, ?, ?, ?)', [name, unit, parseFloat(price), hargaBeli]);
                    } else {
                        tx.executeSql('update item set name = ?, unit = ?, price = ?, harga_beli = ?, where id = ?', [name, unit, parseFloat(price), hargaBeli, itemId]);
                    }
                },
                null,
                navigation.goBack()
            );
        } else {
            setError('Semua Kolom harus di isi');
        }
    }

    const deleteItem = () => {
        db.transaction(tx => {
            tx.executeSql('delete from item where id=?', [itemId], navigation.goBack());
        });
    }

    return (
        <LayoutWithHeader title={"Tambah Barang"} id={itemId} onDelete={() => deleteItem()}>
            <ScrollView>
                {error.length > 0 &&
                    <View style={styles.inputLayout}>
                        <Text style={styles.labelError}>{error}</Text>
                    </View>
                }
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Nama Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput width={"100%"} value={name} onChangeText={setName} />
                    </View>
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Satuan Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput width={"100%"} value={unit} onChangeText={setUnit} />
                    </View>
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Harga Beli Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput keyboardType={'number-pad'} width={"100%"} value={hargaBeli} onChangeText={setHargaBeli} />
                    </View>
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Harga Jual Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput keyboardType={'number-pad'} width={"100%"} value={price} onChangeText={setPrice} />
                    </View>
                </View>
                <View height={20} />
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={() => saveItem()}>
                <MaterialIcons name="check" size={24} color="white" />
            </TouchableOpacity>
        </LayoutWithHeader>
    )
}

const styles = StyleSheet.create({
    inputLayout: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    labelInput: {
        fontSize: 16,
        marginLeft: 10
    },
    labelError: {
        color: 'red',
        fontSize: 16,
        marginLeft: 10
    },
    textBox: {
        borderRadius: 40,
        paddingVertical: 5,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        marginTop: 5
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

export default AddItemScreen
