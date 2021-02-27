import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import RowPreview from '../components/RowPreview';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/id';

const db = SQLite.openDatabase('db.db');

const PreviewScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([]);
    const [nota, setNota] = useState({});
    const [total, setTotal] = useState(0);
    const [show, setShow] = useState(true);
    const [bayar, setBayar] = useState('');

    useEffect(() => {
        const { id } = route.params;
        db.transaction(tx => {
            tx.executeSql('select * from cart where nota_id = ?', [id], (_, { rows }) => {
                setItems(rows._array);
            });
            tx.executeSql('select * from nota where id = ?', [id], (_, { rows }) => {
                setNota(rows._array[0]);
                if (rows._array[0].bayar !== 0) {
                    setBayar(rows._array[0].bayar.toString());
                    setShow(false);
                }
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

    const saveBayar = () => {
        db.transaction(tx => {
            tx.executeSql('update nota set bayar = ? where id = ?', [bayar, nota.id]);
        });
        setShow(false);
    }

    const setSelesai = () => {
        db.transaction(tx => {
            tx.executeSql('update nota set done = 1 where id = ?', [nota.id]);
        });
        navigation.navigate('Home');
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}> Preview </Text>
                </View>
                {nota.done !== 1 &&
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setShow(true)}>
                            <Text>Edit Uang Bayar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelesai()}>
                            <Text>Selesai</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            {nota.name !== "Tanpa Nama" &&
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: '20%' }}>Nama Pembeli</Text>
                    <Text>{nota.name}</Text>
                </View>
            }
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '20%' }}>Tanggal</Text>
                <Text>{moment(nota.timestamp, 'DD-MM-YYYY').format('DD MMMM YYYY')}</Text>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 2 }}>
                <View style={{ width: '5%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>No</Text>
                </View>
                <View style={{ width: '45%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nama Barang</Text>
                </View>
                <View style={{ width: '10%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Jumlah</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Harga Satuan</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total</Text>
                </View>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={items}
                keyExtractor={(item, index) => {
                    return item.id.toString();
                }}
                ListFooterComponent={() => {
                    return (
                        <View style={{ width: '50%', alignSelf: 'flex-end', }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontSize: 16 }}>Total Belanja</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{convertToRupiah(total)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontSize: 16 }}>Total Bayar</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{convertToRupiah(bayar)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontSize: 16 }}>Total Kembalian</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{convertToRupiah(parseFloat(bayar) - total)}</Text>
                            </View>
                        </View>
                    )
                }}
                renderItem={({ item, index }) => {
                    return <View>
                        <RowPreview item={item} index={index} />
                    </View>
                }} />
            {show &&
                <View style={styles.layoutModal}>
                    <View style={styles.box}>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.labelInput}>Uang yang dibayarkan</Text>
                            <View style={styles.textBox}>
                                <TextInput keyboardType='number-pad' width={"100%"} value={bayar} onChangeText={setBayar} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buttonSave} onPress={() => saveBayar()}>
                            <Text style={{ color: 'white' }}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
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

export default PreviewScreen
