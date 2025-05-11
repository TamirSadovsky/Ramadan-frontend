import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyleSheet, Text, View } from "react-native";

// const headers = ["עניינים", "חברים"];
// const rows = [
//   ["1ב", "1א"],
//   ["2ב", "2א"],
//   ["3ב", "3א"],
// ];

export default function MyTable({ show, headers, rows }) {
  if (show) {
    // orderData("2001112");
    return (
      <View style={{ writingDirection: "rtl", maxHeight: "33vh" }}>
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
                {headers.map((header) => {
                  return (
                    <TableCell key={header} align="right">
                      {header}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  align="right"
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {row.map((item) => (
                    <TableCell key={item} align="right">
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </View>
    );
  } else return null;
}
