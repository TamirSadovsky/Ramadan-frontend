import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { ScrollView, StyleSheet } from 'react-native';
import Typography from '@material-ui/core/Typography';
import BackToNavBtn from '../BackToNavBtn/BackToNavBtn';
import PendingOrdersScrollview from '../PendingOrdersScrollview/PendingOrdersScrollview';

import fetchConf from '../../fetchConfig';


const axios = require('axios');

export default function PendingOrders({
    setShowPendingOrders,
    setShowButtons,
    showPendingOrders,
    user,
    setShowOverlayLoader
}) {
    const [approvedList, setApprovedList] = useState(null);
    const [partlyApprovedList, setPartlyApprovedList] = useState(null);
    const [pendingList, setPendingList] = useState(null);
    const [deniedList, setDeniedList] = useState(null);

    // console.log(user);
    useEffect(() => {
        if (showPendingOrders) {

            (async () => {
                try {
                    setShowOverlayLoader(true);
                    const ordersData = await axios.get(`${fetchConf}/getPendingOrdersByUser`, {
                        params: {
                            userID: user?.userId
                        },
                        timeout: 5000,

                    });
                    const resolvedOrders = await ordersData.data;
                    // console.log(resolvedOrders);
                    setPendingList(resolvedOrders?.filter(order => {
                        return order.Status === 0
                    }));
                    setApprovedList(resolvedOrders?.filter(order => {
                        return order.Status === 1
                    }));
                    setPartlyApprovedList(resolvedOrders?.filter(order => {
                        return order.Status === 2
                    }));
                    setDeniedList(resolvedOrders?.filter(order => {
                        return order.Status === 3
                    }));

                } catch (error) {
                    console.log("Error fetching pending orders: ", error);
                } finally {
                    setShowOverlayLoader(false);

                }
            })()
        }
    }, [showPendingOrders])

    const approved = approvedList?.map(order => {
        return (
            <View
                key={order.CustOrderID}
                style={styles.order}
            >
                <Text>{` מס' הזמנה: ${order?.CustOrderID}.`}</Text>
                <Text>{` תאריך הזמנה: ${order.Date?.Date?.toString()?.slice(0, 10)?.split("-")?.reverse()?.join("/")}. `}</Text>
                <Text>{` לקוח: ${order.CustomerName}.`}</Text>
            </View>
        )
    });
    const partlyApproved = partlyApprovedList?.map(order => {
        return (
            <View
                key={order.CustOrderID}
                style={styles.order}
            >
                <Text>{` מס' הזמנה: ${order?.CustOrderID}.`}</Text>
                <Text>{` תאריך הזמנה: ${order.Date?.Date?.toString()?.slice(0, 10)?.split("-")?.reverse()?.join("/")}. `}</Text>
                <Text>{` לקוח: ${order.CustomerName}.`}</Text>
            </View>
        )
    });
    const pending = pendingList?.map(order => {

        return (
            <View
                key={order.CustOrderID}
                style={styles.order}
            >
                {/* "2022-12-03".split("-").reverse().join("/") */}
                <Text>{` מס' הזמנה: ${order?.CustOrderID}.`}</Text>
                <Text>{` תאריך הזמנה: ${order?.Date?.toString()?.slice(0, 10)?.split("-")?.reverse()?.join("/")}. `}</Text>
                <Text>{` לקוח: ${order.CustomerName}.`}</Text>
            </View>
        )
    });
    const denied = deniedList?.map(order => {
        return (
            <View
                key={order.CustOrderID}
                style={styles.order}
            >
                <Text>{` מס' הזמנה: ${order?.CustOrderID}.`}</Text>
                <Text>{` תאריך הזמנה: ${order.Date?.Date?.toString()?.slice(0, 10)?.split("-")?.reverse()?.join("/")}. `}</Text>
                <Text>{` לקוח: ${order.CustomerName}.`}</Text>
            </View>
        )
    });

    return (
        <ScrollView vertical={true} style={{ backgroundColor: '#fff', minHeight: '100%' }}>
            <View component="main" maxWidth="xs" style={{ overflowX: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" style={{ marginBottom: "20px" }}>
                    סטטוס הזמנות ממתינות:
                </Typography>
                <Typography variant="h6" style={{ marginBottom: "10px", fontSize: '1rem' }}>
                    *מציג מידע מיומיים אחרונים.
                </Typography>
                {/* <Typography variant="h6" style={{ marginBottom: "10px", marginTop: "10px", textAlign: 'center', textDecorationLine: 'underline' }}>
                    ממתין לאישור:
                </Typography>
                <View style={{ borderTop: '1px dotted', borderBottom: '1px dotted' }}>
                    <ScrollView contentContainerStyle={styles.listScrollView} showsVerticalScrollIndicator={false}>
                        {pending?.length ? pending : <Text>לא נמצאו...</Text>}
                    </ScrollView>
                </View> */}
                <PendingOrdersScrollview header={"ממתין לאישור:"} list={pending} />
                <PendingOrdersScrollview header={"מאושר:"} list={approved} />
                <PendingOrdersScrollview header={"אושר חלקית:"} list={partlyApproved} />
                <PendingOrdersScrollview header={"נדחה:"} list={denied} />
                {/* <Typography variant="h6" style={{ marginBottom: "10px", marginTop: "10px", textAlign: 'center', textDecorationLine: 'underline' }}>
                    מאושר:
                </Typography>
                {approved?.length ? approved : <Text>לא נמצאו...</Text>}
                <Typography variant="h6" style={{ marginBottom: "10px", marginTop: "10px", textAlign: 'center', textDecorationLine: 'underline' }}>
                    אושר חלקית:
                </Typography>
                {partlyApproved?.length ? partlyApproved : <Text>לא נמצאו...</Text>}
                <Typography variant="h6" style={{ marginBottom: "10px", marginTop: "10px", textAlign: 'center', textDecorationLine: 'underline' }}>
                    נדחה:
                </Typography>
                {denied?.length ? denied : <Text>לא נמצאו...</Text>} */}
                <BackToNavBtn setShowCurr={setShowPendingOrders} setShowButtons={setShowButtons} />

            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create({

    order: {
        overflowX: 'hidden',
        border: '1px solid grey',
        borderRadius: '10px',
        width: '90%',
        marginBottom: '5px',
    }
});