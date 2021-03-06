import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackBar from '@material-ui/core/Snackbar';

import CanvasComponent from './CanvasComponent';
import EditorComponent from './EditorComponent';
import AuthenticationService from './service/AuthenticationService';

const ShaderLibComponent = (props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [vertex, setVertex] = useState("");
  const [vertexId, setVertexId] = useState("");
  const [fragment, setFragment] = useState("");
  const [fragmentId, setFragmentId] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [author, setAuthor] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("Upload failed");
  const params = useParams();

  const update = () => {
    const vertexData = {
      id: vertexId,
      source: vertex
    }
    const fragmentData = {
      id: fragmentId,
      source: fragment
    }
    const shaderData = {
      id: id,
      name: name,
      author: author,
      fsource: fragmentData,
      vsource: vertexData
    }
    post(shaderData);
  }

  const post = (shaderData) => {
    let shader = shaderData;
    AuthenticationService.postData(shader.vsource, 'vertexshader').then(response => {
      shader.vsource.id = response.data.id;
      console.log(shader);

      AuthenticationService.postData(shader.fsource, 'fragmentshader').then(response => {
        shader.fsource.id = response.data.id;
        console.log(shader);

        AuthenticationService.postData(shader, 'shader').then(response => {
          console.log(response.data);
          setSnackMessage("Upload successful");
          setSnackBarOpen(true);
        })
          .catch(error => {
            console.log(error);
          });
      })
        .catch(error => {
          console.log(error);
        });
    })
      .catch(error => {
        console.log(error);
        setSnackMessage("Upload failed");
        setSnackBarOpen(true);
      });
  }

  useEffect(() => {
    if (params.index >= 0) {
      const shader = props.shaderList[params.index];
      setVertex(shader.vsource.source);
      setVertexId(shader.vsource.id);
      setFragment(shader.fsource.source);
      setFragmentId(shader.fsource.id);
      setName(shader.name);
      setId(shader.id);
      setAuthor(shader.author);
      setLoading(false);
    } else {
      AuthenticationService.getData("/newshader")
        .then(response => response.data)
        .then(response => {
          console.log(response);
          const shader = response;
          setVertex(shader.vsource.source);
          setFragment(shader.fsource.source);
          setVertexId(-1);
          setFragmentId(-1);
          setId(-1); // to not overwrite old shader
          setName(shader.name);
          setAuthor(AuthenticationService.getAuth1());
          setLoading(false);
        })
        .catch(error => {
          console.log(error)
        });
    }
  }, [params.index]);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = () => {
    setName(input);
    setOpen(false);
  }

  const inputChanged = (event) => {
    setInput(event.target.value);
  }

  const closeSnackBar = () => {
    setSnackBarOpen(false);
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div class="shader-lib-component">
      <table style={{ margin: 'auto' }}>
        <tr>

          <td>
            <h1 style={{ textAlign: 'center' }}>{name}</h1>
          </td>

          {(AuthenticationService.isUserLoggedIn() && AuthenticationService.getAuth1() === author)
            || AuthenticationService.isAdmin() ?
            <div>
              <td>
                <button class="updateButton" onClick={() => update()}>save</button>
              </td>
              <td>
                <button class="updateButton" onClick={handleClickOpen}>change name</button>
              </td>
            </div>
            : null
          }
        </tr>
      </table>
      <CanvasComponent
        resolution={props.resolution}
        vertex={vertex}
        fragment={fragment}
      />
      <EditorComponent
        source={fragment}
        setSource={(setFragment)}
        type={"fragment shader"}
      />
      <EditorComponent
        source={vertex}
        setSource={setVertex}
        type={"vertex shader"}
      />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Choose a name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a name for the shader
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            value={input}
            onChange={inputChanged}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBar
        open={snackBarOpen}
        message={snackMessage}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      />
    </div>
  );

}

export default ShaderLibComponent;