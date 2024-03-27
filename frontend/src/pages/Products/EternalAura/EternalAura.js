import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const EternalAura = () => {
    const mountRef = useRef(null);
    const modelRef = useRef(); // Riferimento al modello per la rotazione
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor("#000");
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 5;

        const loader = new GLTFLoader();
        loader.load(
            process.env.PUBLIC_URL + '/3d-objects/ProjMask.glb',
            (gltf) => {
                modelRef.current = gltf.scene;
                scene.add(gltf.scene);
                animate();
            },
            undefined,
            (error) => {
                console.error('Errore nel caricamento del modello:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        const onDocumentMouseDown = (event) => {
            isDragging = true;
        };

        const onDocumentMouseMove = (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const rotationSpeed = 0.005;

                if (modelRef.current) {
                    modelRef.current.rotation.y += deltaMove.x * rotationSpeed;
                    modelRef.current.rotation.x += deltaMove.y * rotationSpeed;
                }

                previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        };

        const onDocumentMouseUp = () => {
            isDragging = false;
        };

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

        return () => {
            if (mountRef.current && renderer.domElement) { 
                mountRef.current.removeChild(renderer.domElement);
            }
            document.removeEventListener('mousedown', onDocumentMouseDown, false);
            document.removeEventListener('mousemove', onDocumentMouseMove, false);
            document.removeEventListener('mouseup', onDocumentMouseUp, false);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};
