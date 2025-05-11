import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import { SelectList } from "react-native-dropdown-select-list";
import Typography from "@material-ui/core/Typography";
import { Autocomplete } from "@material-ui/lab";
import IconButton from "@mui/material/IconButton";
import { RemoveCircleOutline } from "@material-ui/icons";

import fetchConf from "../../fetchConfig";
const axios = require("axios");

export default function Item({
  items,
  units,
  kusers,
  user,
  customer,
  index,
  handleRemove,
  updateItemInList,
  itemProperties,
  setShowOverlayLoader,
}) {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [basePrice, setBasePrice] = useState(null);
  const [DbBasePrice, setDbBasePrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [unit, setUnit] = useState(null);
  const [kuser, setKuser] = useState(null);
  const [comment, setComment] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  //   console.log(item);
  // (() => {
  //     if (itemProperties) {
  //         setItem(itemProperties.item);
  //         setBasePrice(itemProperties.basePrice);
  //         setQuantity(itemProperties.quantity);
  //         setUnit(itemProperties.unit);
  //         setKuser(itemProperties.kuser);
  //         setComment(itemProperties.comment);
  //     }
  // })()
  useEffect(() => {
    // console.log(basePrice?.length >= 0);
    const itemDetails = {
      item: item ? item : itemProperties?.item,
      basePrice: basePrice?.length >= 0 ? basePrice : itemProperties?.basePrice,
      quantity: quantity?.length >= 0 ? quantity : itemProperties?.quantity,
      unit: unit ? unit : itemProperties?.unit,
      kuser: user.needKuser
        ? kuser
          ? kuser
          : itemProperties?.kuser
        : user.localDef,
      comment: comment?.length >= 0 ? comment : itemProperties?.comment,
      dbBasePrice: DbBasePrice,
      valid: itemProperties?.valid,
      priceInRange: priceInRange(),
    };
    updateItemInList(itemDetails, index);
  }, [item, basePrice, quantity, kuser, unit, comment, DbBasePrice]);

  useEffect(() => {
    if (customer && (item || itemProperties?.item))
      try {
        setShowOverlayLoader(true);
        (async () => {
          const priceData = await axios.get(`${fetchConf}/getPrice`, {
            params: {
              customerId: customer.key,
              itemId: item?.partId ? item?.partId : itemProperties?.item.partId,
            },
            timeout: 5000,
          });
          const resolvedPrice = await priceData.data.value;
          // console.log("resolvedPrice: ", resolvedPrice);
          setDbBasePrice(resolvedPrice);
          setBasePrice(resolvedPrice?.toString());
        })();
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setShowOverlayLoader(false);
      }
  }, [item]);

  const setItemObject = (name) => {
    const itemObject = items.filter((item) => {
      return item.partDes === name;
    })[0];
    setItem(itemObject);
  };

  const priceInRange = () => {
    const currPrice = basePrice >= 0 ? basePrice : itemProperties?.basePrice;
    return (
      currPrice <= DbBasePrice * (user.maxAllow * 0.01 + 1) &&
      currPrice >= DbBasePrice * (1 - user.minAllow * 0.01)
    );
  };
  const isValid = () => {
    // console.log(itemProperties.basePrice, basePrice);
    return (
      itemProperties?.item &&
      itemProperties.basePrice > 0 &&
      itemProperties.quantity > 0 &&
      itemProperties?.unit &&
      (!user?.needKuser || itemProperties?.kuser)
    );
  };

  const validateItem = () => {
    if (isValid()) {
      const itemDetails = {
        item: { ...itemProperties.item },
        basePrice: itemProperties.basePrice,
        quantity: itemProperties.quantity,
        unit: { ...itemProperties.unit },
        kuser: { ...itemProperties.kuser },
        comment: itemProperties.comment,
        priceInRange: priceInRange(),
        dbBasePrice: itemProperties.dbBasePrice,
        valid: true,
      };
      updateItemInList(itemDetails, index);
      setOpen(false);
    } else {
      setDialogHeader("נתונים לא תקינים");
      setDialogContent(
        " כדי להוסיף פריט להזמנה, יש לוודא כי נבחר מוצר כראוי ושאר הפרמטרים הנדרשים תקינים."
      );
      setShowDialog(true);
    }
  };

  const handleExit = () => {
    const itemDetails = {
      item: { ...itemProperties.item },
      basePrice: itemProperties.basePrice,
      quantity: itemProperties.quantity,
      unit: { ...itemProperties.unit },
      kuser: { ...itemProperties.kuser },
      comment: itemProperties.comment,
      priceInRange: priceInRange(),
      dbBasePrice: itemProperties.dbBasePrice,
      valid: isValid(),
    };
    updateItemInList(itemDetails, index);
    setOpen(false);
  };

  return (
    <View
      style={{ overflowX: "hidden", display: "flex", flexDirection: "row" }}
    >
      <View
        style={{
          overflowX: "hidden",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View
          style={{
            border: "1px solid grey",
            borderRadius: "5px",
            width: "75%",
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Text>
            {itemProperties?.item
              ? itemProperties.item.partDes
              : "יש לבחור פריט"}
          </Text>
          <Text>{` כמות: ${
            itemProperties?.quantity ? itemProperties?.quantity : ""
          }      מחיר כולל: ${
            itemProperties?.quantity && itemProperties?.basePrice
              ? itemProperties?.quantity * itemProperties?.basePrice
              : ""
          }`}</Text>
          {/* <Text>{item ? item.partDes : "יש לבחור פריט"}</Text>
                    <Text>{` כמות: ${quantity}      מחיר כולל: ${quantity * basePrice}`}</Text> */}
        </View>
        <IconButton
          onClick={() => {
            handleRemove(index);
          }}
        >
          <RemoveCircleOutline />
          <Text> הסר</Text>
        </IconButton>
      </View>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        style={{ overflowX: "hidden" }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            הוספת פריט להזמנה
          </Text>
          <View
            style={{
              width: 75,
              height: 75,
              borderRadius: 8,
              marginHorizontal: 16,
              marginTop: 8,
            }}
          >
            {item?.base64Img && (
              <Image
                // source={require("../../assets/WhatsApp Image 2023-01-30 at 13.20.22.jpeg")}
                source={{ uri: item.base64Img }}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: "black",
                }}
              />
            )}
          </View>
        </View>
        <DialogContent>
          <Autocomplete
            options={items?.map((i) => i.partDes)}
            renderInput={(params) => (
              <TextField {...params} label="בחר/י מוצר" />
            )}
            value={itemProperties?.item ? itemProperties.item.partDes : null}
            onChange={(event, newValue) => setItemObject(newValue)}
            style={{ direction: "rtl" }}
          />

          <View
            style={{
              overflowX: "hidden",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              variant="outlined"
              margin="dense"
              id="basePrice"
              label="מחיר בסיס"
              name="basePrice"
              autoComplete="base_price"
              style={{ margin: "10px" }}
              value={
                itemProperties?.basePrice
                  ? itemProperties?.basePrice
                  : basePrice
                  ? basePrice
                  : ""
              }
              onChange={(val) => {
                setBasePrice(val.target.value);
              }}
            />
            <Text>
              {priceInRange()
                ? ""
                : `*מחיר הבסיס הוא: ${DbBasePrice}, המחיר שהוזן לא בטווח האפשרי, בסיום  ההזמנה תשלח ותחכה לאישור מנהל.`}
            </Text>
            <Autocomplete
              // size='medium'
              options={units?.map((i) => i.unitDes)}
              renderInput={(params) => (
                <TextField {...params} label="בחר/י יחידות" />
              )}
              value={itemProperties?.unit ? itemProperties.unit.unitDes : null}
              onChange={(event, newValue) =>
                setUnit(units?.filter((type) => type.unitDes === newValue)[0])
              }
              style={{ width: "75%", margin: "0px 10px 10x 10px" }}
            />
            <TextField
              variant="outlined"
              margin="dense"
              id="quantity"
              label="כמות"
              name="quantity"
              autoComplete="quantity"
              style={{ margin: "10px" }}
              value={itemProperties?.quantity ? itemProperties?.quantity : ""}
              onChange={(val) => {
                setQuantity(val.target.value);
              }}
            />
            {user?.needKuser && (
              <Autocomplete
                // size='medium'
                options={kusers?.map((i) => i.des)}
                renderInput={(params) => (
                  <TextField {...params} label="בחר/י כשרות" />
                )}
                value={itemProperties?.kuser ? itemProperties.kuser.des : null}
                onChange={(event, newValue) =>
                  setKuser(kusers?.filter((type) => type.des === newValue)[0])
                }
                // sx={{ width: '100%', margin: '10px' }}
                style={{ width: "75%", margin: "10px" }}
              />
            )}
            <Typography variant="h6" style={{ margin: "20px" }}>
              מחיר כולל:{" "}
              {itemProperties.quantity &&
                itemProperties.basePrice &&
                itemProperties.quantity * itemProperties.basePrice}
            </Typography>
            <TextField
              label="הערה..."
              multiline
              maxRows={4}
              variant="outlined"
              margin="dense"
              style={{ margin: "10px" }}
              value={itemProperties.comment}
              onChange={(val) => {
                setComment(val.target.value);
              }}
            />
          </View>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" onClick={handleExit}>
            סגור
          </Button>
          <Button variant="contained" color="primary" onClick={validateItem}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>
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
  );
}
