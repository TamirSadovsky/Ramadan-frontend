import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import Item from "../Item/Item";
import Typography from "@material-ui/core/Typography";
import IconButton from "@mui/material/IconButton";
import { AddCircleOutlined } from "@material-ui/icons";

export default function ItemsList({
  items,
  customerLastOrders,
  customer,
  units,
  kusers,
  user,
  isValidOrder,
  setShowOverlayLoader,
}) {
  const [open, setOpen] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [showLastOrders, setShowLastOrders] = useState(false);

  useEffect(() => {
    // if (!customer) {
    //     setItemsList([]);
    // } else setShowLastOrders(true);
    if (customer) {
      setShowLastOrders(true);
    }
    setItemsList([]);
  }, [customer]);

  const handleRemove = (index) => {
    setItemsList((prevList) => {
      const newArray = [...prevList];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const updateItemInList = (itemDetails, i) => {
    // console.log(i, itemDetails);
    setItemsList((prevList) =>
      prevList.map((item, index) => {
        if (i === index) return { ...itemDetails };
        else return item;
      })
    );
  };

  const itemsRows = itemsList.map((item, index) => {
    return (
      <Item
        key={index}
        index={index}
        items={items}
        units={units}
        user={user}
        kusers={kusers}
        customer={customer}
        style={{ marginTop: "5px" }}
        handleRemove={handleRemove}
        itemProperties={item}
        updateItemInList={updateItemInList}
        setShowOverlayLoader={setShowOverlayLoader}
      ></Item>
    );
  });

  const handleAddItem = () => {
    if (customer) {
      // console.log(itemsList);
      if (itemsList.length !== 0 && !itemsList[itemsList.length - 1].valid) {
        setDialogHeader("שגיאה");
        setDialogContent("יש לסיים לערוך את הפריט האחרון כראוי ולשמור");
        setShowDialog(true);
      } else
        setItemsList((prevList) => [
          ...prevList,
          {
            // basePrice: 0,
            // quantity: 0,
            comment: "",
          },
        ]);
    } else {
      setDialogHeader("שגיאה");
      setDialogContent("יש לבחור לקוח לפני הוספת פריטים");
      setShowDialog(true);
    }
  };

  useEffect(() => {
    isValidOrder(itemsList);
  }, [itemsList]);

  const handleLoadLastOrder = (order) => {
    const list = order.lines.map((item) => {
      return {
        item: { partId: item.PartID, partDes: item.GenerlDes },
        basePrice: item.BasePrice,
        quantity: item.Qunt,
        unit: { unitId: item.Units, unitDes: item.UnitsDes },
        kuser: { id: item.kuserID, des: item.KuserDes },
        comment: item.Comment,
        valid: true,
        dbBasePrice: item.BasePrice,
      };
    });
    setItemsList(list);
    setShowLastOrders(false);
  };

  const lastOrdersList = customerLastOrders?.map((order) => {
    const date = order.Date?.toString()
      ?.slice(0, 10)
      ?.split("-")
      ?.reverse()
      ?.join("/");
    const length = order.lines.length;
    // console.log(order.lines.length);
    return (
      <View
        key={order.CustOrderID}
        style={{
          overflowX: "hidden",
          border: "1px solid grey",
          borderRadius: "10px",
          width: "75%",
          marginBottom: "5px",
        }}
        onClick={() => handleLoadLastOrder(order)}
      >
        <Text>{` תאריך הזמנה: ${date}. `}</Text>
        <Text>{` פריטים: ${length}.`}</Text>
      </View>
    );
  });

  // console.log(itemsList);
  return (
    <Container maxWidth="xs" style={{ overflowX: "hidden", height: "50%" }}>
      <Typography variant="h6">פריטים:</Typography>
      {itemsRows}
      <IconButton onClick={handleAddItem}>
        <AddCircleOutlined />
        <Text> הוסף מוצר נוסף</Text>
      </IconButton>

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
      <Dialog open={showLastOrders} onClose={() => setShowLastOrders(false)}>
        <DialogTitle>
          יצירת הזמנה חדשה מהזמנות קודמות של {customer?.value}
        </DialogTitle>
        <DialogContent>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {lastOrdersList?.length ? (
              lastOrdersList
            ) : (
              <Text>*לא נמצאו הזמנות.</Text>
            )}
          </View>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowLastOrders(false);
            }}
          >
            דלג/י
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
