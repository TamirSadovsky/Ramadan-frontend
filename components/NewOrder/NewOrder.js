import { View, Text } from "react-native";
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import BackToNavBtn from "../BackToNavBtn/BackToNavBtn";
import Typography from "@material-ui/core/Typography";
import { SelectList } from "react-native-dropdown-select-list";
import TextField from "@mui/material/TextField";
import { ScrollView } from "react-native";
import ItemsList from "../ItemsList/ItemsList";
import Dialog from "@mui/material/Dialog";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import fetchConf from "../../fetchConfig";
import CustomerSearch from "../CustomerSearch/CustomerSearch";

const axios = require("axios");

export default function NewOrder({
  showNewOrder,
  setShowNewOrder,
  setShowButtons,
  user,
  setShowOverlayLoader,
}) {
  const [customers, setCustomers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customerValue, setCustomerValue] = useState(null);
  const [customerLastOrders, setCustomerLastOrders] = useState(null);
  const [supplyDate, setSupplyDate] = useState(new Date());
  const [items, setItems] = useState(null);
  const [units, setUnits] = useState(null);
  const [kusers, setKusers] = useState(null);
  const [validOrder, setValidOrder] = useState(false);
  const [isForPending, setIsForPending] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [lines, setLines] = useState(null);
  const [reset, setReset] = useState(false);

  // console.log(user);
  useEffect(() => {
    if (showNewOrder && customer) {
      try {
        setShowOverlayLoader(true);
        (async () => {
          const ordersData = await axios.get(
            `${fetchConf}/getOrdersByCustomer`,
            {
              params: {
                customerID: customer.key,
              },
              timeout: 5000,
            }
          );
          const resolvedOrders = await ordersData.data;
          // console.log(resolvedOrders);
          setCustomerLastOrders(resolvedOrders);
        })();
      } catch (error) {
        console.log("Error fetching last orders of customer: ", error);
      } finally {
        setShowOverlayLoader(false);
      }
    } else if (showNewOrder) {
      try {
        setShowOverlayLoader(true);
        (async () => {
          // const customersData = await axios.get("http://192.168.31.159:3000/getCustomers");
          const customersData = await axios.get(`${fetchConf}/getCustomers`, {
            params: {
              userId: user.userId,
            },
            timeout: 5000,
          });
          const resolvedCustomers = await customersData.data;
          const customersOptions = resolvedCustomers.map((item) => {
            return {
              key: `${item.CustomerID}`,
              value: item.Name,
              address: item.Address,
              city: item.City,
              zipCode: item.ZipCode,
            };
          });
          setCustomers(customersOptions);
          const itemsData = await axios.get(`${fetchConf}/getItems`);
          const resolvedItems = await itemsData.data;
          const itemsOptions = resolvedItems.map((item) => {
            return {
              partId: `${item.PartID}`,
              partDes: item.PartDes,
              base64Img: item.SigBase64,
            };
          });
          setItems(itemsOptions);
          const unitsData = await axios.get(`${fetchConf}/getUnits`);
          const resolvedUnits = await unitsData.data;
          const unitsOptions = resolvedUnits.map((item) => {
            return {
              unitId: item.UnitsID,
              unitDes: item.UnitsDes,
            };
          });
          setUnits(unitsOptions);
          if (user?.needKuser) {
            const kusersData = await axios.get(`${fetchConf}/getKusers`);
            const resolvedKusers = await kusersData.data;
            const kusersOptions = resolvedKusers.map((item) => {
              return {
                id: item.ID,
                des: item.Des,
                kuserType: item.KuserType,
              };
            });
            setKusers(kusersOptions);
          }
        })();
      } catch (error) {
        console.log("Error fetching customers:", error);
      } finally {
        setShowOverlayLoader(false);
      }
    }
  }, [showNewOrder, customer]);

  useEffect(() => {
    setLines(null);
  }, [customer]);

  const getCustomerData = () => {
    // console.log(customerValue);
    if (customerValue && customers) {
      setCustomer(customers.filter((cust) => cust.value === customerValue)[0]);
    }

    // console.log(customerLastOrders);
  };

  const validItems = (itemsList) => {
    for (let item of itemsList) if (!item.valid) return false;
    return true;
  };

  const isValidOrder = (itemsList) => {
    if (user && customer && itemsList?.length > 0 && validItems(itemsList)) {
      setLines(itemsList);
      setValidOrder(true);
      let isPending = false;
      for (const item of itemsList) {
        // console.log(user, item, item.basePrice > item.dbBasePrice * (user.maxAllow * 0.01 + 1) || item.basePrice < item.dbBasePrice * (1 - user.minAllow * 0.01));
        if (
          item.basePrice > item.dbBasePrice * (user.maxAllow * 0.01 + 1) ||
          item.basePrice < item.dbBasePrice * (1 - user.minAllow * 0.01)
        ) {
          setIsForPending(true);
          isPending = true;
          break;
        }
      }
      if (!isPending) setIsForPending(false);
    } else {
      setValidOrder(false);
    }
  };
  // console.log(user);
  const sendData = async () => {
    try {
      setShowOverlayLoader(true);
      const orderData = {
        customerId: customer.key,
        customerName: customer.value,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode,
        transDate: supplyDate,
        userId: user.userId,
        username: user.username,
        lines: [],
      };
      for (const line of lines) {
        orderData.lines.push({
          partId: line.item.partId,
          generalDes: line.item.partDes,
          qunt: line.quantity,
          units: line.unit.unitId,
          kuserId: user.needKuser ? user.kuser.id : user.localDef.DefKuserID,
          kuserDes: user.needKuser ? user.kuser.des : user.localDef.DefKuserDes,
          comment: line.comment,
          basePrice: isForPending ? line.dbBasePrice : line.basePrice,
          totalPrice: line.basePrice * line.quantity,
          unitsDes: line.unit.unitDes,
          basePriceRequest: line.basePrice,
        });
      }
      const endpoint = isForPending ? "insertPendingOrder" : "insertOrder";
      console.log(endpoint);
      const insertStatus = await axios.post(
        `${fetchConf}/${endpoint}`,
        orderData
      );
      console.log("insertStatus", await insertStatus.data);
      return await insertStatus.data;
    } catch (error) {
      console.log("Error sending order to DataBase: ", error);
      return false;
    } finally {
      setShowOverlayLoader(false);
    }
  };
  const handleSend = () => {
    if (validOrder) {
      const respond = sendData();
      if (respond) {
        setDialogHeader("הזמנה נשלחה בהצלחה");
        setDialogContent(
          isForPending
            ? "שימו לב, בהזמנה זו קיים לפחות פריט אחד עם מחיר בסיס מעבר לטווח האפשרי. הזמנה זו תועבר להזמנות הממתינות לאישור."
            : "ההזמנה תקינה ונקלטה במערכת."
        );
        setShowDialog(true);
        setReset((prev) => !prev);
        setCustomer(null);
      } else {
        setDialogHeader("שגיאה בשליחת הזמנה");
        setDialogContent(
          "ההזמנה לא נקלטה, אנא נסו שנית, במידת הצורך צרו קשר עם מנהל."
        );
        setShowDialog(true);
      }
    } else {
      setDialogHeader("הזמנה לא תקינה! וודאו כי:");
      setDialogContent("נבחר לקוח, יש לפחות פריט אחד, אין פריטים עם מידע חסר.");
      setShowDialog(true);
    }
  };

  return (
    <ScrollView
      vertical={true}
      style={{ backgroundColor: "#fff", minHeight: "100%" }}
    >
      <View
        component="main"
        maxWidth="xs"
        style={{ overflowX: "hidden", height: "100%" }}
      >
        <Typography
          component="h1"
          variant="h5"
          style={{ marginBottom: "20px" }}
        >
          יצירת הזמנה
        </Typography>
        <SelectList
          setSelected={(item) => {
            setCustomerValue(item);
          }}
          onSelect={getCustomerData}
          save="value"
          data={customers}
          placeholder="בחר/י לקוח"
          searchPlaceholder="חיפוש"
          key={reset}
          // dropdownStyles={{ zIndex: 500 }}
        />
        {/* <CustomerSearch
          customersOptions={customers}
          onSelect={getCustomerData}
          setSelected={setCustomerValue}
          key={reset}
        /> */}
        <View style={{ marginTop: "20px" }}>
          {/* <Text> בחר תאריך הספקה</Text> */}
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              label="בחר/י מועד הספקה"
              inputFormat="DD/MM/YYYY"
              value={supplyDate}
              minDate={supplyDate}
              onChange={(date) => {
                setSupplyDate(date._d);
              }}
              closeOnSelect={true}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </View>

        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginLeft: 5,
            marginRight: 5,
            marginTop: "20px",
            marginBottom: "20px",
          }}
        />
        <ItemsList
          items={items}
          setItems={setItems}
          customer={customer}
          units={units}
          kusers={kusers}
          user={user}
          isValidOrder={isValidOrder}
          customerLastOrders={customerLastOrders}
          setShowOverlayLoader={setShowOverlayLoader}
        ></ItemsList>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            style={{ width: "75%" }}
          >
            שלח הזמנה
          </Button>
          <BackToNavBtn
            setShowCurr={setShowNewOrder}
            setShowButtons={setShowButtons}
          />
        </View>
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>{dialogHeader}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogContent}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowDialog(false);
              }}
            >
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      </View>
    </ScrollView>
  );
}
