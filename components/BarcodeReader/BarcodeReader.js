import React, { Component, useEffect } from "react";
import Quagga from "quagga";
import "../style.css";

const BarcodeReader = ({ onDetect }) => {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          // constraints: {
          //   width: 640,
          //   height: 300,
          //   facingMode: 'environment',
          // },
          //   area: { // defines rectangle of the detection/localization area
          //     top: "10%",    // top offset
          //     right: "10%",  // right offset
          //     left: "10%",   // left offset
          //     bottom: "10%"  // bottom offset
          //   },
        },
        locator: {
          halfSample: true,
          patchSize: "medium", // x-small, small, medium, large, x-large
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["code_128_reader"],
          // debug: {
          //     drawBoundingBox: true,
          //     showFrequency: true,
          //     drawScanline: true,
          //     showPattern: true
          // },
        },
        locate: true,
      },
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );
    // Quagga.onProcessed(function (result) {
    //     var drawingCtx = Quagga.canvas.ctx.overlay,
    //     drawingCanvas = Quagga.canvas.dom.overlay;

    //     if (result) {
    //         if (result.boxes) {
    //             drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    //             result.boxes.filter(function (box) {
    //                 return box !== result.box;
    //             }).forEach(function (box) {
    //                 Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
    //             });
    //         }

    //         if (result.box) {
    //             Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
    //         }

    //         if (result.codeResult && result.codeResult.code) {
    //             Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
    //         }
    //     }
    // });
    Quagga.onDetected(_onDetected);
    return () => {
      Quagga.offDetected(_onDetected);
    };
  }, []);

  const _onDetected = (result) => {
    // alert("got it");
    onDetect(result);
    Quagga.stop();
  };

  return (
    <div id="interactive" className="viewport">
      <video
        className="videoCamera"
        autoPlay={true}
        preload="auto"
        src=""
        muted={true}
        playsInline={true}
      ></video>
    </div>
  );
};

export default BarcodeReader;
