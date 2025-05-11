import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  writingDirection: 'rtl',
});


console.log("Loaded")
ReactDOM.render(
  <CacheProvider value={cacheRtl} >
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </CacheProvider >,
  document.querySelector("#root"));
