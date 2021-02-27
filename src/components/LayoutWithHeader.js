import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LayoutWithHeader = ({ title, children, id, onDelete }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.layout}>
            <View style={styles.header}>
                <View style={{ width: '12%' }}>
                    <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: 10 }}>
                    <Text style={styles.textHeader}>{title}</Text>
                    {id !== 0 &&
                        <TouchableOpacity onPress={() => onDelete()}>
                            <MaterialIcons name="delete-forever" size={24} color="white" />
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20,
    },
    background: {
        height: 80,
        width: '100%',
        backgroundColor: '#AABE2A',
    },
    header: {
        height: 50,
        backgroundColor: 'black',
        alignItems: 'center',
        flexDirection: 'row'
    },
    iconBack: {
        marginHorizontal: 10
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    },
})

export default LayoutWithHeader;