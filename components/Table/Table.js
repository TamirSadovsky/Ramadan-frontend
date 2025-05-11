import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyleSheet, Text, View } from "react-native";

const rows = [];

export default function TableConetent({ show, rows }) {
  if (show) {
    // orderData("2001112");
    return (
      <View style={{ writingDirection: "rtl", height: "50vh" }}>
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            size="small"
            aria-label="a dense table"
            style={{
              width: "100%",
              overflowX: "scroll",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">שם המוצר</TableCell>
                <TableCell align="right">סוג הבשר</TableCell>
                <TableCell align="right">מספר מארז</TableCell>
                <TableCell align="right">משקל</TableCell>
                <TableCell align="right">בר קוד</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  align="right"
                  key={row.barCode}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="right">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.meatType}</TableCell>
                  <TableCell align="right">{row.boxId}</TableCell>
                  <TableCell align="right">{row.weight}</TableCell>
                  <TableCell align="right">{row.barCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </View>
    );
  } else return null;
}
