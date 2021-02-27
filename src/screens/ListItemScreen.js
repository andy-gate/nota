import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import StockItem from '../components/StockItem';
import { useFocusEffect } from '@react-navigation/native';

const db = SQLite.openDatabase('db.db');

const ListItemScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);

    useFocusEffect(() => {
        db.transaction(tx => {
            tx.executeSql('select * from item', [], (_, { rows }) => {
                setItems(rows._array)
            }
            );
        });
    }, []);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerText}> Barang </Text>
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
                    return <TouchableOpacity style={styles.cardItem} onPress={() => navigation.navigate('AddItem', { id: item.id })}>
                        <StockItem item={item} />
                    </TouchableOpacity>
                }} />
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddItem')}>
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
        </View>
    )
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

export default ListItemScreen
