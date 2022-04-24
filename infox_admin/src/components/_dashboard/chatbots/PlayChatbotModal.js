import { Box, Button, Container, Drawer, Grid, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import play from '@iconify/icons-eva/mic-fill';
import { AppContext } from '../../../context/AppContext';
import { FetchContext } from '../../../context/FetchContext';
import { getErrorMessage } from '../../../utils/helper';
import AudioRecorder from './AudioRecorder';

export default function PlayChatbotModal(props) {
  const [isChanged, setIsChanged] = useState(false);
  const fetchContext = useContext(FetchContext);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [link, setLink] = useState(props.youtubeLink);

  useEffect(() => {
    if (title !== props.title) {
      setIsChanged(true);
    }
    if (link !== props.link) {
      setIsChanged(true);
    }
  }, [title, link]);

  const handleSubmit = () => {
    // e.preventDefault();
    if (!isChanged) return;
    setLoading(true);
    fetchContext.authAxios
      .put(`videos/${props._id}`, {
        title,
        youtubeLink: link
      })
      .then(() => {
        appContext.handleAlert({ severity: 'success', message: 'Video Updated.' });
        setTitle('');
        setLink('');
        setLoading(false);
        setTimeout(() => {
          props.handleClose();
        }, 700);
      })
      .catch((err) => {
        appContext.handleAlert({ severity: 'error', message: getErrorMessage(err) });
        setLoading(false);
      });
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
            <Icon icon={play} width={43} height={43} />
            Ask Info
          </Typography>
          <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <AudioRecorder title={props.Title} />
            </Grid>
          </Box>
        </Box>
      </Container>
    </Drawer>
  );
}
