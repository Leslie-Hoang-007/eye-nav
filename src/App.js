import logo from './logo.svg';
import './App.css';

import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;

  var camera = null;

  function onResults(results) {
    console.log(results);
  }

  useEffect(()=>{
    // init face mesh
    const faceMesh = new FaceMesh({
      locateFile: (file) =>{// get their model
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    })

    // set face mesh options
    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence:0.5,
      minTrackingConfidence:0.5,
    })

    faceMesh.onResults(onResults);

    // check if webCam active
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null){

      // set camera
      camera = new cam.Camera(webcamRef.current.video, {// pass in current webcam video
        onFrame: async () => {// when frame received send data
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  },[])


  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          margin: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: '300px',
          height: 'auto',
        }}
      />
      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          position: "absolute",
          margin: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: '300px',
          height: 'auto',
        }}
      ></canvas>
    </div>
  );
}

export default App;
