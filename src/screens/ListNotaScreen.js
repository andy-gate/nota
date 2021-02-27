import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import NotaItem from '../components/NotaItem';

const db = SQLite.openDatabase('db.db');

const ListNotaScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists item (id integer primary key not null, name text, unit text, price float, harga_beli float);'
                // 'drop table if exists item'
                , []
            );
            tx.executeSql(
                'create table if not exists cart (id integer primary key not null, nota_id integer, name text, unit text, price float, qty float, total float);'
                // 'drop table if exists cart'
                , []
            );
            tx.executeSql(
                'create table if not exists nota (id integer primary key not null, name text, timestamp date, bayar float, done integer);'
                // 'drop table if exists nota'
                , []
            );
        });
    }, []);

    useFocusEffect(() => {
        db.transaction(tx => {
            tx.executeSql('select * from nota', [], (_, { rows }) => {
                setItems(rows._array);
                // console.log(JSON.stringify(rows._array));
            },
            );
        });
    }, []);

    const createNota = () => {
        const pembeli = name.length > 0 ? name : "Tanpa Nama";
        db.transaction(
            tx => {
                tx.executeSql('insert into nota (name, timestamp, bayar, done) values (?, ?, 0, 0)', [pembeli, moment().format('DD-MM-YYYY')]);
            },
            (error) => { console.log(error) },
            () => {
                setOpen(false);
                setName('');
            }
        );
    }

    return (
        <>
            <View style={styles.root}>
                <View style={styles.header}>
                    <Text style={styles.headerText}> Nota </Text>
                    {/* <FontAwesome5 name="search" size={20} color="black" /> */}
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={items}
                    keyExtractor={(item, index) => {
                        return item.id.toString();
                    }}
                    renderItem={({ item }) => {
                        return <TouchableOpacity style={styles.cardItem} onPress={() => item.done === 1 ? navigation.navigate('Preview', { id: item.id }) : navigation.navigate('ListCart', { id: item.id })}>
                            <NotaItem item={item} />
                        </TouchableOpacity>
                    }} />
                <TouchableOpacity style={styles.fab} onPress={() => setOpen(!open)}>
                    <FontAwesome5 name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>
            {open &&
                <TouchableOpacity style={styles.layoutModal} onPress={() => setOpen(false)}>
                    <View style={styles.box}>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.labelInput}>Nama Pembeli</Text>
                            <View style={styles.textBox}>
                                <TextInput width={"100%"} value={name} onChangeText={setName} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buttonSave} onPress={() => createNota()}>
                            <Text style={{ color: 'white' }}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            }
        </>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingTop: 20,
        paddingHorizontal: 10,
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
    },
    layoutModal: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8
    },
    box: {
        backgroundColor: 'white',
        width: '50%',
        alignItems: 'center'
    },
    labelInput: {
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
    buttonSave: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 20,
        marginVertical: 10
    }
});

export default ListNotaScreen
