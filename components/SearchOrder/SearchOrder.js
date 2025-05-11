import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackToNavBtn from '../BackToNavBtn/BackToNavBtn';
import Typography from '@material-ui/core/Typography';
import { ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'


import fetchConf from '../../fetchConfig';
const axios = require('axios');

export default function SearchOrder({
    setShowSearchOrder,
    setShowButtons,
    showSearchOrder,
    setShowOverlayLoader,
    user
}) {
    const [customers, setCustomers] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [customerValue, setCustomerValue] = useState(null);
    const [reset, setReset] = useState(false);

    console.log(customer);

    useEffect(() => {
        if (showSearchOrder) {
            try {
                setShowOverlayLoader(true);
                (async () => {
                    const customersData = await axios.get(`${fetchConf}/getCustomers`, {
                        params: {
                            userId: user.userId,
                        },
                        timeout: 5000,

                    });
                    const resolvedCustomers = await customersData.data;
                    const customersOptions = resolvedCustomers.map(item => {
                        return {
                            key: `${item.CustomerID}`,
                            value: item.Name,
                            // address: item.Address,
                            // city: item.City,
                            // zipCode: item.ZipCode
                        }
                    })
                    setCustomers(customersOptions);
                })();
            } catch (error) {
                console.log("Error fetching customers options: ", error);

            } finally {
                setShowOverlayLoader(false);
                setReset(prev => !prev);
            }
        } else {
            setCustomer(null);

        }
    }, [showSearchOrder])

    useEffect(() => {
        if (customer) {
            try {
                (async () => {

                })()
            } catch (error) {

            }
        }
    }, [customer])

    const getCustomerData = () => {
        // console.log(customerValue);
        if (customerValue && customers) {
            setCustomer(customers.filter(cust => cust.value === customerValue)[0]);
        }

        // console.log(customerLastOrders);
    }

    return (
        <ScrollView vertical={true} style={{ backgroundColor: '#fff', minHeight: '100%' }}>
            <View component="main" maxWidth="xs" style={{ overflowX: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" style={{ marginBottom: "20px" }}>
                    חפש/י הזמנות
                </Typography>
                <SelectList
                    setSelected={item => {
                        setCustomerValue(item);
                    }}
                    onSelect={getCustomerData}
                    save="value"
                    data={customers}
                    placeholder="חפש/י הזמנות לפי לקוח"
                    searchPlaceholder="חיפוש"
                    key={reset}
                />
                <BackToNavBtn setShowCurr={setShowSearchOrder} setShowButtons={setShowButtons} />
            </View>

        </ScrollView>

    )
}