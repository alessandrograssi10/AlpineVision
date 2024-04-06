import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Modello3D = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
};

export const Visualizzazione3D = ({ modelPath }) => {
  return (
    <Canvas style={{ height: "200px", width: "100%" }}>
      {/* Luce ambientale per un'illuminazione generale debole */}
      <ambientLight intensity={0.3} />
      {/* Luce direzionale per simulare il sole o una sorgente lontana */}
      <directionalLight position={[0, 10, 0]} intensity={1} />
      {/* Due luci di punto per aggiungere più dettaglio e profondità */}
      <pointLight position={[-10, -10, -10]} intensity={100} />
      <pointLight position={[10, 10, 10]} intensity={100} />
      <pointLight position={[10, 10, 10]} />
      <Modello3D modelPath={modelPath} />
      <OrbitControls />
    </Canvas>
  );
};
