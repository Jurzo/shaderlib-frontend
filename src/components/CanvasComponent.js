import React from 'react';
import { Canvas } from 'react-three-fiber';
import ShaderComponent from './ShaderComponent';

const CanvasComponent = (props) => {

    return (
        <div className="shader-list-element">
            <Canvas resize={{scroll: false}}>
                <ShaderComponent
                resolution = {props.resolution}
                vertex = {props.vertex}
                fragment = {props.fragment}
                />
            </Canvas>
        </div>
    )
}

export default CanvasComponent;