import { Signature } from "../index";

import { Logo, BarcodeReader, BackToNavBtn } from "../../components/index";
import fetchConf from "../../fetchConfig";

import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { ScrollView } from "react-native";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ReactModal, { setAppElement } from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBarcode,
} from "@fortawesome/free-solid-svg-icons";

const axios = require("axios");

// Order test number 2001112

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function OrderPage({
  showOrderPage,
  setshowOrderPage,
  Table,
  Modal,
  setShowOverlayLoader,
  setShowButtons,
}) {
  const classes = useStyles();
  const [showTable, setshowTable] = useState(false);
  const [signatureObject, setSignatureObject] = useState(null);
  const [clientId, setclinetId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rowsData, setRowsData] = useState(true);
  const [modalContent, setModalContent] = useState({});
  const [orderViewd, setOrderViewd] = useState(false);
  const [showOrderModal, setOrderShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderIdNum, setOrderId] = useState(null);
  const [showBarcodeComponenet, setShowBarcodeComponenet] = useState(false);
  const orderIdRef = useRef(null);
  const [data, setData] = React.useState("Not Found");

  const resetData = () => {
    setclinetId(null);
    setRowsData(null);
    setShowOverlayLoader(false);
    setshowTable(false);
    setSignatureObject(null);
  };

  const onDetect = (result) => {
    console.log(result.codeResult.code);
    orderIdRef.current.focus();
    orderIdRef.current.value = result.codeResult.code;
    setShowBarcodeComponenet(false);
  };

  const orderData = async (orderId) => {
    const rows = [];
    try {
      setShowOverlayLoader(true);
      // const orderData = await axios.get("http://192.168.31.159:3000/getOrderDetails", {
      const orderData = await axios.get(`${fetchConf}/getOrderDetails`, {
        params: {
          orderId,
        },
        timeout: 5000,
      });
      const resolvedData = await orderData;
      // console.log(resolvedData.data.recordset[0].CustomerName);
      // console.log(resolvedData);
      if (
        resolvedData?.data?.comments &&
        resolvedData?.data?.comments?.length > 0
      ) {
        setModalContent({
          title: "הוראות מיוחדת להורדת סחורה:",
          content: resolvedData?.data?.comments,
        });
        setShowModal(true);
      }

      for (let ele of resolvedData.data.recordset) {
        rows.push({
          name: ele.HashDes,
          meatType: ele.GenerlDes,
          boxId: ele.BoxNum,
          weight: ele.Wight.toFixed(3),
          barCode: ele.BarCode,
        });
      }
      if (rows.length <= 0) {
        setModalContent({
          title: "שגיאה",
          content: "לא נמצאו הזמנות",
        });
        setShowModal(true);
        resetData();
        return;
      }
      rows.isSinged = resolvedData.data.signatureObject.isSinged;
      setRowsData(rows);
      rows.length > 0
        ? setclinetId(resolvedData.data.recordset[0].CustomerName)
        : null;
      console.log(
        "resolvedData.data.signatureObject ",
        resolvedData.data.signatureObject
      );
      setSignatureObject(resolvedData.data.signatureObject);
      if (resolvedData.data.signatureObject.isSinged) {
        setModalContent({
          title: "שימו לב!",
          content:
            "ההזמנה כבר חתומה, ניתן לראות את פרטי ההזמנה אך לא ניתן לחתום שוב.",
        });
        setShowModal(true);
      }
      setShowOverlayLoader(false);
      setshowTable(true);
      console.log("Leangth: ", resolvedData.data.recordset.length);
    } catch (e) {
      setModalContent({
        title: "שגיאה",
        content: "שגיאה במשיכת נתוני ההזמנה, אנא נסו שוב מאוחר יותר",
      });
      setShowModal(true);
      setShowOverlayLoader(false);
      console.log("Error occured while getting order data: ", e);
    }
  };

  if (showOrderPage) {
    return (
      <ScrollView
        vertical={true}
        style={{ backgroundColor: "#fff", Height: "100%" }}
      >
        <Container
          component="main"
          maxWidth="xs"
          style={{ overflowX: "hidden", height: "100" }}
        >
          <Modal
            show={showModal}
            color="primary"
            content={modalContent.content}
            title={modalContent.title}
            buttonText="אישור"
            toggleShowModal={setShowModal}
            speacilFunction={modalContent.speacilFunction}
          ></Modal>
          <CssBaseline />
          <div className={classes.paper}>
            {/* <Box sx={{ marginBottom: '30px', marginTop: '30px', textAlign: 'center' }}>
              <div className={classes.avatar}>
                <Logo />
              </div>
            </Box> */}
            <Typography component="h1" variant="h5">
              תעודת משלוח
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignContent: "space-between",
              }}
            >
              <TextField
                id="orderId"
                label="מס תעודת משלוח"
                variant="outlined"
                inputRef={orderIdRef}
              />
              <Button
                variant="outlined"
                // id="searchOrderBtn"
                style={{ right: "2px" }}
                color="primary"
                onClick={() => {
                  resetData();
                  setOrderId(orderIdRef.current.value);
                  orderData(orderIdRef.current.value);
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
              <Button
                variant="outlined"
                // id="searchOrderBtn"
                style={{ right: "5px" }}
                color="primary"
                onClick={() => {
                  setShowBarcodeComponenet(true);
                }}
              >
                <FontAwesomeIcon icon={faBarcode} />
              </Button>
            </Box>
            {showBarcodeComponenet && (
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
                      setShowBarcodeComponenet(false);
                    }}
                  >
                    סגור
                  </Button>
                </Box>
              </>
            )}
            <>
              {showTable && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "10px",
                      marginTop: "10px",
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      disabled
                      style={{ textAlign: "right" }}
                      id="outlined-disabled"
                      variant="outlined"
                      label="לקוח"
                      defaultValue={clientId}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "10px",
                      overflowX: "scroll",
                      maxWidth: "100%",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setOrderShowModal(true);
                        setOrderViewd(true);
                      }}
                    >
                      הצג תעודת משלוח
                    </Button>
                    <ReactModal
                      appElement={document.getElementById("root")}
                      isOpen={showOrderModal}
                      style={{
                        content: {
                          inset: "0",
                        },
                      }}
                    >
                      <Table rows={rowsData} show={!isLoaded}></Table>
                      <br />
                      <Button
                        color="primary"
                        variant="contained"
                        id="searchOrderBtn"
                        style={{
                          margin: "0 auto",
                          width: "100%",
                        }}
                        onClick={() => {
                          setOrderShowModal(false);
                          // setOrderViewd(true);
                        }}
                      >
                        סגור חלון
                      </Button>
                    </ReactModal>

                    <Signature
                      show={!isLoaded}
                      orderViewd={orderViewd}
                      orderId={orderIdNum}
                      setShowModal={setShowModal}
                      setModalContent={setModalContent}
                      resetData={resetData}
                      isSinged={rowsData ? rowsData.isSinged : null}
                      signatureObject={signatureObject}
                    />
                  </Box>
                </>
              )}
              {/* <ThreeDots 
                   height="100" 
                   width="100" 
                   radius="9"
                   color="#4fa94d" 
                   ariaLabel="three-dots-loading"
                   // wrapperStyle={{}}
                   // wrapperClassName=""
                   visible={isLoaded}
              />    */}
            </>
            <BackToNavBtn
              setShowCurr={setshowOrderPage}
              setShowButtons={setShowButtons}
            />
          </div>
        </Container>
      </ScrollView>
    );
  } else return null;
}
