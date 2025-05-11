import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { BarcodeReader, BackToNavBtn, MyTable } from "../../components/index";
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Typography,
  Box,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectList } from "react-native-dropdown-select-list";
import Dialog from "@mui/material/Dialog";
import { Entypo } from "@expo/vector-icons";

import fetchConf from "../../fetchConfig";
const axios = require("axios");

export default function OutStorageScan({
  setShowOutStorageScan,
  setShowButtons,
  showOutStorageScan,
  setShowOverlayLoader,
  user,
}) {
  const [showBarcodeComponent, setShowBarcodeComponent] = useState(false);
  const [scanValue, setScanValue] = useState(null);
  const [openOrders, setOpenOrders] = useState(null);
  const [openOrderKey, setOpenOrderKey] = useState(null);
  const [openOrder, setOpenOrder] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [scannedPlatforms, setScannedPlatforms] = useState([]);
  const [numberOfCartons, setNumberOfCartons] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [tableRows, setTableRows] = useState(null);

  // console.log(
  //   "user: ",
  //   user,
  //   " scanValue: ",
  //   scanValue,
  //   " openOrder: ",
  //   openOrder
  // );
  useEffect(() => {
    if (showOutStorageScan) {
      console.log("fetching open orders...");
      try {
        setShowOverlayLoader(true);
        (async () => {
          const ordersData = await axios.get(
            `${fetchConf}/getOpenOutStorageOrders`
          );
          const resolvedOrders = await ordersData.data;
          const ordersOptions = resolvedOrders.map((item) => {
            return {
              key: `${item.OutOrderID}`,
              value: `#${item.OutOrderID} ${
                item.OutStorgeName
              }, מתאריך: ${item.Date.slice(0, 10)}`,
              outStorageId: item.OutStorgeID,
              date: item.Date,
              outStorageName: item.OutStorgeName,
            };
          });
          setOpenOrders(ordersOptions);
        })();
      } catch (error) {
        console.log("Error fetching open orders:", error);
      } finally {
        setShowOverlayLoader(false);
      }
    }
  }, [showOutStorageScan]);

  useEffect(() => {
    if (openOrder) {
      // console.log(openOrder);
      console.log("fetching open order parts...");
      try {
        setShowOverlayLoader(true);
        (async () => {
          const orderPartsData = await axios.get(
            `${fetchConf}/getOpenOutStorageOrderLines`,
            {
              params: {
                orderId: openOrder.key,
              },
              timeout: 5000,
            }
          );
          const resolvedOrderParts = await orderPartsData.data;
          setTableRows(
            resolvedOrderParts.map((part) => [
              part.GenerlDes,
              part.Platforms,
              part.Comment,
            ])
          );
          // console.log(resolvedOrderParts);
        })();
      } catch (error) {
        console.log("Error fetching open orders:", error);
      } finally {
        setShowOverlayLoader(false);
      }
    }
  }, [openOrder]);

  const platformCartonsCheck = (barcode) => {
    try {
      setShowOverlayLoader(true);
      (async () => {
        const cartonsData = await axios.get(`${fetchConf}/getNumOfCartons`, {
          params: {
            scanValue: barcode,
          },
          timeout: 5000,
        });
        const cartonsQuantity = await cartonsData.data;
        if (cartonsQuantity) {
          setNumberOfCartons(cartonsQuantity.Qunt);
        } else {
          setScanValue(null);
          setBarcodeInput("");
          setDialogHeader("ברקוד לא נמצא");
          setDialogContent("הברקוד לא נמצא בנתוני המשטחים, אנא נסו שנית.");
          setShowDialog(true);
        }
      })();
    } catch (error) {
      console.log("Error fetching number of cartons:", error);
    } finally {
      setShowOverlayLoader(false);
    }
  };
  useEffect(() => {
    if (scanValue) {
      platformCartonsCheck(scanValue);
    }
  }, [scanValue]);

  const isOpenOrderSelected = () => {
    if (!openOrder) {
      setDialogHeader("לא נבחרה הזמנה");
      setDialogContent("יש לבחור הזמנה פתוחה לפני ביצוע הסריקה או הזנת ברקוד.");
      setShowDialog(true);
      return false;
    } else {
      return true;
    }
  };
  const handleScan = () => {
    if (isOpenOrderSelected()) {
      setShowBarcodeComponent(true);
      setBarcodeInput("");
      setNumberOfCartons("");
    }
  };
  const onDetect = (result) => {
    if (showBarcodeComponent) {
      setScanValue(result.codeResult.code);
      // setScannedPlatforms((prev) => [...prev, result.codeResult.code]);
      setShowBarcodeComponent(false);
    }
  };

  const getOrderData = () => {
    if (openOrderKey && openOrders) {
      setOpenOrder(openOrders.filter((order) => order.key === openOrderKey)[0]);
    }
  };

  // const isValid = () => {
  //   const validNumber = numberOfCartons
  //   return scanValue && validNumber
  // }
  const handleSend = async () => {
    const barcodeValue = scanValue ? scanValue : barcodeInput;
    if (barcodeValue) {
      try {
        setShowOverlayLoader(true);
        const scanData = {
          orderId: openOrder.key,
          outStorageId: openOrder.outStorageId,
          outStorageName: openOrder.outStorageName,
          scanValue: barcodeValue,
          userId: user.userId,
          username: user.username,
          numOfCartons: numberOfCartons,
        };
        const sendingStatus = await axios.post(
          `${fetchConf}/platformScan`,
          scanData
        );
        if (await sendingStatus.data) {
          setDialogHeader("סריקה נשלחה בהצלחה");
          setDialogContent("הסריקה נקלטה בשרת.");
          setShowDialog(true);
          setBarcodeInput("");
          setNumberOfCartons("");
        } else {
          setDialogHeader("שגיאה בשליחת סריקה");
          setDialogContent(
            "בעיה בשליחת נתונים לשרת אנא העבר/י למנהל את פרטי הסריקה."
          );
          setShowDialog(true);
        }
        setScanValue(null);
      } catch (error) {
        console.log("Error sending scan to DataBase: ", error);
        setDialogHeader("שגיאה בשליחת ברקוד");
        setDialogContent(
          "בעיה בשליחת נתונים לשרת אנא וודאו כי משטח זה לא נקלט בעבר."
        );
        setShowDialog(true);
        return false;
      } finally {
        setShowOverlayLoader(false);
      }
    } else {
      setDialogHeader("שגיאה בשליחת סריקה");
      setDialogContent("וודאו כי נסרק ברקוד יחד עם מספר קרטונים תקין");
      setShowDialog(true);
    }
  };
  // console.log(tableRows);

  // const scannedList = scannedPlatforms.map((platform, index) => {
  //   return (
  //     <Text key={index}>
  //       {index}: {platform}
  //     </Text>
  //   );
  // });

  const handleBarcodeInputCheck = () => {
    if (isOpenOrderSelected()) {
      setScanValue(null);
      platformCartonsCheck(barcodeInput);
    }
  };

  const tableHeaders = ["שם המוצר", "כמות משטחים", "הערה"];
  if (showOutStorageScan)
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
          <Typography component="h1" variant="h5" style={{ marginBottom: 16 }}>
            סריקת הזמנה מבית קירור
          </Typography>
          <View style={{ marginBottom: 16 }}>
            <SelectList
              setSelected={(item) => {
                setOpenOrderKey(item);
              }}
              onSelect={getOrderData}
              save="key"
              data={openOrders}
              placeholder="בחר/י הזמנה פתוחה"
              searchPlaceholder="חיפוש"
            />
          </View>
          {tableRows && (
            <MyTable show={openOrder} headers={tableHeaders} rows={tableRows} />
          )}

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
          <View>
            <Text>סריקת משטח או הקלדה ידנית:</Text>
            <Button
              variant="outlined"
              // id="searchOrderBtn"
              //   style={{ right: "5px" }}
              color="primary"
              onClick={handleScan}
            >
              <FontAwesomeIcon icon={faBarcode} />
            </Button>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                onChangeText={(text) => setBarcodeInput(text)}
                value={barcodeInput}
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 4,
                  borderRadius: 4,
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  marginTop: 8,
                  direction: "rtl",
                }}
                placeholder="הקלד/י ברקוד..."
              />
              <View
                style={{
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 4,
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0,
                  marginTop: 8,
                }}
              >
                <TouchableOpacity onPress={handleBarcodeInputCheck}>
                  <Entypo name="check" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {showBarcodeComponent && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <BarcodeReader
                  style={{ marginTop: "5px" }}
                  onDetect={onDetect}
                />
                <Button
                  variant="outlined"
                  // id="searchOrderBtn"
                  style={{ right: "5px" }}
                  color="primary"
                  onClick={() => {
                    setShowBarcodeComponent(false);
                  }}
                >
                  סגור
                </Button>
              </Box>
            </>
          )}
          {/* {scannedPlatforms.length > 0 && (
            <>
              <Text>משטחים:</Text>
            </>
          )} */}
          {numberOfCartons > 0 && (
            <View
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              {scanValue && (
                <View>
                  <Text>הערך שנסרק: </Text>
                  <Text style={{ fontWeight: "bold", marginVertical: 8 }}>
                    {scanValue}
                  </Text>
                </View>
              )}
              <Text>מספר קרטונים: </Text>
              <TextInput
                onChangeText={(text) => setNumberOfCartons(text)}
                value={numberOfCartons}
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 8,
                  width: 50,
                  hight: 50,
                  marginTop: 8,
                }}
              />
            </View>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            style={{
              marginTop: "25px",
              marginBottom: "25px",
            }}
          >
            אישור סריקה
          </Button>

          <View style={{ alignItems: "center" }}>
            <BackToNavBtn
              setShowCurr={setShowOutStorageScan}
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
  else return null;
}
