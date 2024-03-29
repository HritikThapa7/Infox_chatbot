import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { useContext, useState } from 'react';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import news from '@iconify/icons-eva/archive-fill';
import { Icon } from '@iconify/react';
import { AppContext } from '../../../context/AppContext';
import { FetchContext } from '../../../context/FetchContext';
import { getErrorMessage } from '../../../utils/helper';
import AppButton from '../../AppButton';

export default function AddProgramModal(props) {
  const fetchContext = useContext(FetchContext);
  const appContext = useContext(AppContext);
  const [star, setStar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [nepalidate, setNepaliDate] = useState('');

  const [state, setState] = useState({
    editorState: EditorState.createEmpty()
  });
  const [file, setFile] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('nepaliDate', nepalidate);
    formData.append('body', draftToHtml(convertToRaw(state.editorState.getCurrentContent())));
    formData.append('image', image);
    formData.append('star', Boolean(star));

    setLoading(true);
    fetchContext.authAxios
      .post('programs', formData)
      .then(() => {
        appContext.handleAlert({
          severity: 'success',
          message: 'Program Added'
        });
        setTitle('');
        setStar(0);
        setNepaliDate('');
        setState({
          editorState: EditorState.createEmpty()
        });
        setFile('');
        setImage(null);
        setLoading(false);
        setTimeout(() => {
          props.handleClose();
        }, 700);
      })
      .catch((err) => {
        appContext.handleAlert({
          type: 'error',
          message: getErrorMessage(err)
        });
        setLoading(false);
      });
  };
  const onEditorStateChange = (editorState) => {
    // console.log(editorState.getCurrentContent());
    setState({
      editorState
    });
  };
  const handleChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setImage(e.target.files[0]);
    setFile(url);
  };

  return (
    <Drawer anchor="right" open={props.open} onClose={props.handleClose}>
      <Container style={{ width: '1000px' }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Typography
            gutterBottom
            variant="h2"
            sx={{
              marginTop: '20px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* <Avatar sx={{ m: 1, background: 'green' }}>
              <ProgrampaperIcon />
            </Avatar> */}
            <Icon icon={news} width={43} height={43} />
            Add Program
          </Typography>
          <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="title"
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-full-width"
                  label="Image Upload"
                  style={{ margin: 8 }}
                  name="upload-photo"
                  type="file"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  onChange={handleChange}
                />
                {file.length > 0 && (
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        image={file}
                        title="Contemplative Reptile"
                      />
                    </CardActionArea>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} sx={{ border: '1px solid lightgrey', borderRadius: '10px' }}>
                <Editor
                  editorState={state.editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={nepalidate}
                  onChange={(e) => setNepaliDate(e.target.value)}
                  autoComplete="nepalidate"
                  name="nepalidate"
                  required
                  fullWidth
                  id="nepalidate"
                  placeholder="१० मंसिर २०७७, वीरगंज"
                  label="Nepali Date & Location"
                />
              </Grid>
            </Grid>
            <AppButton
              loading={loading}
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: 'black',
                color: '#ffffff'
              }}
            >
              Add Program
            </AppButton>
          </Box>
        </Box>
      </Container>
    </Drawer>
  );
}
