import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

const EditorComponent = (props) => {
    const [source, setSource] = useState("");
    const [type, setType] = useState("None");

    useEffect(() => {
        setType(props.type);
    }, []);

    return (
        <div style={{height: '400px', marginBottom: '60px' ,marginTop: '20px'}}>
            <table style={{margin: 'auto'}}>
                <tr>
                    <td>
                        <h2 style={{ textAlign: 'left' }}>{type}</h2>
                    </td>
                    <td>
                        <button style={{marginTop: '4px'}} class="updateButton" onClick={() => props.setSource(source)}>update</button>
                    </td>
                </tr>
            </table>
            <CodeMirror
                value={props.source}
                onChange={(editor)=>setSource(editor.getValue())}
                options={{
                    theme: 'monokai',
                    keyMap: 'sublime',
                    mode: 'c++',
                }}
            />
        </div>
    );

}

export default EditorComponent;