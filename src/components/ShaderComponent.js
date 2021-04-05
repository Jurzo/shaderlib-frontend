import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

const ShaderComponent = (props) => {
    const mesh = useRef();
    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    const fragment = props.fragment;

    const vertex = props.vertex;
    
    const uniforms = {
        u_time: { type: "f", value: 0.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2(props.resolution.width, props.resolution.height)},
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    
    const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
    });
    
    useFrame(({mouse}) => {
        mesh.current.material.uniforms.u_time.value += 0.01;
        mesh.current.material.uniforms.u_mouse.value.x = mouse.x;
        mesh.current.material.uniforms.u_mouse.value.x = mouse.x;
    });

    return (
        <mesh
        ref={mesh}
        geometry={geometry}
        material={material}
        ></mesh>
    )
}

export default ShaderComponent;