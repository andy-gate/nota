import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, TextInput, FlatList } from 'react-native'
import LayoutWithHeader from '../components/LayoutWithHeader';
import { MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

const AddCartScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([]);
    const [data, setData] = useState([]);
    const [itemId, setItemId] = useState(0);
    const [notaId, setNotaId] = useState(0);
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [total, setTotal] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const { nota_id } = route.params;
        setNotaId(nota_id);
        db.transaction(tx => {
            tx.executeSql('select * from item', [], (_, { rows }) => {
                setItems(rows._array);
            });
        });
        var id = 0;
        if (route.params.id !== undefined) {
            id = route.params.id;
            setItemId(id);
        }
        if (id !== 0) {
            db.transaction(tx => {
                tx.executeSql('select * from cart where id=?', [id], (_, { rows }) => {
                    const data = rows._array[0];
                    setName(data.name);
                    setUnit(data.unit);
                    setPrice(data.price.toString());
                    setQty(data.qty.toString());
                    setTotal(data.total.toString());
                }
                );
            });
        }
    }, []);

    useEffect(() => {
        if (qty.length > 0 && price.length > 0) {
            setTotal(parseFloat(price) * parseFloat(qty));
        } else {
            setTotal(0);
        }
    }, [qty, price]);

    const saveItem = () => {
        db.transaction(
            tx => {
                if (itemId === 0) {
                    tx.executeSql('insert into cart (nota_id, name, unit, price, qty, total) values (?, ?, ?, ?, ?, ?)', [notaId, name, unit, parseFloat(price), parseFloat(qty), parseFloat(total)]);
                } else {
                    tx.executeSql('update cart set name = ?, unit = ?, price = ?, qty = ?, total = ? where id = ?', [name, unit, parseFloat(price), parseFloat(qty), parseFloat(total), itemId]);
                }
            },
            (error) => { console.log(error) },
            navigation.goBack()
        );
    }

    const deleteItem = () => {
        db.transaction(tx => {
            tx.executeSql('delete from cart where id=?', [itemId], navigation.goBack());
        });
    }

    const updateText = (text) => {
        setName(text);
        if (text.length >= 3) {
            setShow(true);
            setData(items.filter(x => x.name.includes(text)));
        } else {
            setShow(false);
        }
    }

    const setChoice = (item) => {
        setShow(false);
        setName(item.name);
        setUnit(item.unit);
        setPrice(item.price.toString());
    }

    return (
        <LayoutWithHeader title={"Tambah Belanjaan"} id={itemId} onDelete={() => deleteItem()}>
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <Text style={styles.labelInput}>Nama Barang</Text>
                <View>
                    <View style={styles.textBox}>
                        <TextInput width={"100%"} value={name} onChangeText={(text) => updateText(text)} />
                    </View>
                    {show && data.length > 0 &&
                        <View style={{
                            width: '100%', height: 100, paddingHorizontal: 10,
                            backgroundColor: 'white',
                            elevation: 7
                        }}>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={styles.list}
                                data={data}
                                keyExtractor={(item, index) => {
                                    return item.id.toString();
                                }}
                                renderItem={({ item }) => {
                                    return <TouchableOpacity style={{ padding: 5, }} onPress={() => setChoice(item)}>
                                        <Text>{item.name + ' (' + item.unit + ')'}</Text>
                                    </TouchableOpacity>
                                }} />
                        </View>
                    }
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Satuan Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput width={"100%"} value={unit} onChangeText={setUnit} />
                    </View>
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Harga Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput keyboardType={'number-pad'} width={"100%"} value={price} onChangeText={setPrice} />
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Jumlah Barang</Text>
                    <View style={styles.textBox}>
                        <TextInput keyboardType='decimal-pad' width={"100%"} value={qty} onChangeText={setQty} />
                    </View>
                </View>
                <View style={styles.inputLayout}>
                    <Text style={styles.labelInput}>Harga Total</Text>
                    <View style={styles.textBox}>
                        <Text>Rp {total}</Text>
                    </View>
                </View>
            </View>
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
        flex: 1
    },
    labelInput: {
        fontSize: 16,
        marginLeft: 10
    },
    container: {
        borderRadius: 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    inputContainer: {
        width: '100%',
        borderWidth: 0,
        paddingHorizontal: 10,
        backgroundColor: 'pink',
    },
    listContainer: {
        width: '100%',
        borderWidth: 0,
        paddingHorizontal: 10,
        backgroundColor: 'red',
        elevation: 5,
        zIndex: 10
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
    },
    list: {
        elevation: 7
    },
});

export default AddCartScreen
