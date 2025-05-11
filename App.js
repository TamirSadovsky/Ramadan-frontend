// Components
import {
  TableConetent,
  Modal,
  OverlayLoader,
  NewOrder,
  PendingOrders,
  Nav,
} from "./components/index";

import { Login, OrderPage } from "./pages/index";

// import Login from './pages/index';
import { magnifyGlass } from "@material-ui/icons";

import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";

export default function App() {
  const [view, setView] = useState(true);
  const [showNav, setShowNav] = useState(false); // needed to be false
  const { height } = Dimensions.get("window");
  const [showLoaderOverlay, setLoaderOverlay] = useState(false);
  const [user, setUser] = useState(null);

  {
    //   authenticated: true,
    //   userId: 101,
    //   username: "אביבית",
    //   needKuser: true,
    //   localDef: {
    //     DoNotNeedKuse: 0,
    //     DefKuserID: null,
    //     DefKuserDes: null,
    //   },
    //   maxAllow: 0,
    //   minAllow: 0,
    //   typeId: 101,
    // }
    // temporary user for tests in Cancun
    const styles = StyleSheet.create({
      container: {
        writingDirection: "rtl",
        flex: 1,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        writingDirection: "rtl",
      },
    });

    return (
      <View style={styles.container}>
        <OverlayLoader showLoader={showLoaderOverlay} />

        <Login
          style={{
            writingDirection: "rtl",
          }}
          setView={setView}
          view={view}
          // setOrderPageFun={setshowOrderPage}
          setShowNavFun={setShowNav}
          Modal={Modal}
          setShowOverlayLoader={setLoaderOverlay}
          setUser={setUser}
        ></Login>
        <View
          style={{
            display: showNav ? "block" : "none",
            width: "95%",
            height: "100%",
            direction: "rtl",
          }}
        >
          <Nav
            style={{ overflowX: "hidden" }}
            setShowOverlayLoader={setLoaderOverlay}
            user={user}
            Modal={Modal}
          ></Nav>
        </View>
      </View>
    );
  }
}
