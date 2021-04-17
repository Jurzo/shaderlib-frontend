import CanvasComponent from './CanvasComponent'

const ShaderList = (props) => {
    const size = { width: 200, height: 200 };

    return (
        <div>
            {props.shaderList.map((shader, index) =>
                <div
                className="shader-list-section"
                key={index}
                onClick={() => {
                    window.location.href = process.env.SITE_URL + '/shader/' + index;
                }}>
                    <CanvasComponent
                        resolution={size}
                        vertex={shader.vsource.source}
                        fragment={shader.fsource.source}
                    />
                </div>
            )}
        </div>
    );
}

export default ShaderList;