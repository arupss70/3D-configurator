import React, { useEffect, useRef } from "react";
import IMG from "./targets.mind";

const ARView = ({ model }) => {
  const iframeRef = useRef(null);
  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
        <style>
          body { margin: 0; overflow: hidden; }
          #move-btn { position: absolute; top: 10px; left: 10px; background: white; padding: 8px; cursor: pointer; z-index: 10; }
        </style>
      </head>
      <body>
        <div id="move-btn">Move Model</div>
        <a-scene
          mindar-image="imageTargetSrc:${IMG};"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true;"
          style="width: 100vw; height: 100vh;"
          embedded
        >
          <a-assets timeout="30000">
            <a-asset-item id="model-0" src="${model}" response-type="arraybuffer"></a-asset-item>
          </a-assets>
          <a-light type="ambient" color="#FFFFFF" intensity="1"></a-light>
          <a-light type="directional" color="#FFFFFF" intensity="1" position="1 2 3"></a-light>
          <a-camera position="0 0 5" look-controls="enabled: true">
            <a-entity
              position="0 0 -1"
              geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: white; shader: flat"
              cursor="fuse: false"
            ></a-entity>
          </a-camera>
          <!-- MindAR Tracking only for detecting marker -->
          <a-entity id="marker" mindar-image-target="targetIndex: 0"></a-entity>
          <!-- Actual Model placed independently -->
          <a-entity id="model-wrapper" position="0 0 0" scale="0.5 0.5 0.5" rotation="0 0 0">
            <a-gltf-model id="ar-model" src="#model-0"></a-gltf-model>
          </a-entity>
        </a-scene>
        <script>
          const marker = document.querySelector('#marker');
          const modelWrapper = document.querySelector('#model-wrapper');
          let modelPosition = { x: 0, y: 0, z: 0 }; // Initial position
          
          // When marker is detected, set initial position once
          marker.addEventListener('targetFound', () => {
            const pos = marker.object3D.position;
            modelPosition = { x: pos.x, y: pos.y, z: pos.z };
            modelWrapper.setAttribute('position', modelPosition);
            console.log('Marker Found. Model position set:', modelPosition);
          });

          // Button to simulate moving the model
          document.getElementById('move-btn').addEventListener('click', () => {
            modelPosition.x += 0.1; // Example movement along X-axis
             modelWrapper.setAttribute('position', \`\${modelPosition.x} \${modelPosition.y} \${modelPosition.z}\`);
            console.log('Model moved to:', modelPosition);
          });

          // Ensure model loading logic is intact
          const modelEntity = document.querySelector('#ar-model');
          modelEntity.addEventListener('model-loaded', () => {
            console.log('Model Loaded');
          });
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.addEventListener('load', () => console.log('iframe loaded'));
      iframe.srcdoc = htmlContent;
    }
  }, [htmlContent]);

  return (
    <div className="w-full h-screen">
      <iframe
        ref={iframeRef}
        title="AR View"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default ARView;