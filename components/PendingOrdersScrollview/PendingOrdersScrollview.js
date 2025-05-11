import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native';
import Typography from '@material-ui/core/Typography';


export default function PendingOrdersScrollview({
    header,
    list
}) {
    return (
        <View style={{ width: '75%' }}>
            <Typography variant="h6" style={{ marginBottom: "10px", marginTop: "10px", textAlign: 'center', textDecorationLine: 'underline' }}>
                {header}
            </Typography>
            <View style={{ borderTop: '1px dotted', borderBottom: '1px dotted', paddingBottom: '5px', paddingTop: '5px' }}>
                <ScrollView contentContainerStyle={styles.listScrollView} showsVerticalScrollIndicator={false}>
                    {list?.length ? list : <Text>לא נמצאו...</Text>}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listScrollView: {
        maxHeight: '10rem',
        display: 'flex',
        alignItems: 'center',
        // border: '1px dotted grey',
        // borderTopWidth: '0'
    },

});