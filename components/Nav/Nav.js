import {
  OverlayLoader,
  Logo,
  TableConetent,
  Modal,
  NewOrder,
  PendingOrders,
  OutStorageScan,
  SearchOrder,
} from "../../components/index";
import { OrderPage } from "../../pages";

import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

import fetchConf from "../../fetchConfig";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Nav({ setShowOverlayLoader, user, Modal }) {
  const classes = useStyles();
  const [showButtons, setShowButtons] = useState(true); // needed to be true
  const [showOrderPage, setshowOrderPage] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [showSearchOrder, setShowSearchOrder] = useState(false);
  const [showOutStorageScan, setShowOutStorageScan] = useState(false); // needed to be false

  const [buttonsId, setButtonsId] = useState(null);

  useEffect(() => {
    if (user && showButtons) {
      try {
        setShowOverlayLoader(true);
        (async () => {
          const buttonsData = await axios.get(`${fetchConf}/getUserButtons`, {
            params: {
              typeId: user?.typeId,
            },
            timeout: 5000,
          });
          const resolvedButtons = await buttonsData.data;
          // console.log("resolvedButtons: ", resolvedButtons);
          setButtonsId(resolvedButtons?.map((button) => button.ButtonID));
        })();
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setShowOverlayLoader(false);
      }
    }
    // console.log("NAV useEffect");
    // if (user?.typeId === 100)
    //     console.log("נהג");
    // if (user?.typeId === 101)
    //     console.log("סוכן");
  }, [user]);

  // console.log(buttonsId);
  const userButtons = buttonsId?.map((id) => {
    switch (id) {
      case 1:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            // id="newOrderBtn"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {
              setShowButtons(false);
              setshowOrderPage(true);
            }}
          >
            חיפוש תעודת משלוח
          </Button>
        );
        break;
      case 2:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            id="newOrderBtn"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {
              setShowButtons(false);
              setShowNewOrder(true);
            }}
          >
            הזמנה חדשה
          </Button>
        );
        break;
      case 3:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            id="pendingOrdersBtn"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {
              setShowButtons(false);
              setShowPendingOrders(true);
            }}
          >
            הזמנות ממתינות
          </Button>
        );
        break;
      case 4:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {}}
          >
            קבלות {user.typeId === 100 ? "נהגים" : "סוכנים"}
          </Button>
        );
        break;
      case 5:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {}}
          >
            הזמנה מבית קירור
          </Button>
        );
      case 6:
        return (
          <Button
            key={id}
            color="primary"
            variant="contained"
            style={{ width: "50%", marginBottom: "25px" }}
            onClick={() => {
              setShowButtons(false);
              setShowOutStorageScan(true);
            }}
          >
            סריקה מבית קירור
          </Button>
        );
      default:
        return <Text>לא נמצאו פעולות מתאימות למשתמש זה...</Text>;
        break;
    }
  });
  return (
    <ScrollView
      vertical={true}
      style={{ backgroundColor: "#fff", minHeight: "100%" }}
    >
      <Container
        component="main"
        maxWidth="xs"
        style={{ overflowX: "hidden", height: "100%" }}
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Box
            sx={{
              marginBottom: "30px",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <div className={classes.avatar}>
              <Logo />
            </div>
          </Box>
          {showButtons && (
            <View
              style={{
                width: "95%",
                height: "100%",
                direction: "rtl",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              {userButtons}
            </View>
          )}
          <View
            style={{
              display: showOrderPage ? "block" : "none",
              width: "95%",
              height: "100%",
              direction: "rtl",
            }}
          >
            <OrderPage
              showOrderPage={showOrderPage}
              setshowOrderPage={setshowOrderPage}
              setShowButtons={setShowButtons}
              Table={TableConetent}
              style={{ overflowX: "hidden" }}
              Modal={Modal}
              setShowOverlayLoader={setShowOverlayLoader}
              // setShowButtons={setShowButtons}
            ></OrderPage>
          </View>
          <View
            style={{
              display: showNewOrder ? "block" : "none",
              width: "95%",
              height: "100%",
              direction: "rtl",
            }}
          >
            <NewOrder
              setShowButtons={setShowButtons}
              setShowNewOrder={setShowNewOrder}
              showNewOrder={showNewOrder}
              user={user}
              Modal={Modal}
              setShowOverlayLoader={setShowOverlayLoader}
            ></NewOrder>
          </View>
          <View
            style={{
              display: showPendingOrders ? "block" : "none",
              width: "95%",
              height: "100%",
              direction: "rtl",
            }}
          >
            <PendingOrders
              setShowButtons={setShowButtons}
              setShowPendingOrders={setShowPendingOrders}
              user={user}
              showPendingOrders={showPendingOrders}
              setShowOverlayLoader={setShowOverlayLoader}
            ></PendingOrders>
          </View>
          <View
            style={{
              display: showOutStorageScan ? "block" : "none",
              width: "95%",
              height: "100%",
              direction: "rtl",
            }}
          >
            <OutStorageScan
              setShowButtons={setShowButtons}
              setShowOutStorageScan={setShowOutStorageScan}
              showOutStorageScan={showOutStorageScan}
              setShowOverlayLoader={setShowOverlayLoader}
              user={user}
              key={showOutStorageScan}
            />
          </View>
        </div>
      </Container>
    </ScrollView>
  );
}
