import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const NotaItem = ({ item }) => {

    return (
        <View style={styles.cardLayout}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>{item.timestamp}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cardLayout: {
        borderRadius: 10,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        elevation: 3,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default NotaItem