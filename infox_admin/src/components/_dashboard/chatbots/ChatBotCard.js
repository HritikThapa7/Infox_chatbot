import { useContext, useState } from 'react';
// material
import { Box, Card, Typography, Stack, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
//
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import playFill from '@iconify/icons-eva/play-circle-fill';

import PlayChatbotModal from './PlayChatbotModal';
import { MoreMenu } from '../user';
import { FetchContext } from '../../../context/FetchContext';
// ----------------------------------------------------------------------

const VideoImgStyle = styled('img')({
  //   top: 0,
  width: '100%',
  height: '140px',
  objectFit: 'cover'
  //   position: 'absolute'
});

// ----------------------------------------------------------------------

export default function ChatBotCard({ chatbot, setTriggerRefresh }) {
  const { authAxios } = useContext(FetchContext);
  const { Title, Description, Image, QA_NAME } = chatbot;
  //   const youtubeVideoId = youtubeLink.split('v=')[1];
  const [openPlayChatbotModal, setOpenPlayChatbotModal] = useState(false);

  const handleDelete = async () => {
    toast.promise(
      (async () => {
        await authAxios.post(`deleteEmbeddings/${QA_NAME}`);
        setTriggerRefresh((prev) => prev + 1);
      })(),
      {
        loading: 'Deleting Chatbot...',
        success: <b>Chatbot Deleted.</b>,
        error: <b>Could not delete Chatbot.</b>
      }
    );
  };

  return (
    <Card sx={{ minHeight: 345 }}>
      <PlayChatbotModal
        {...chatbot}
        open={openPlayChatbotModal}
        handleOpen={() => setOpenPlayChatbotModal(true)}
        handleClose={() => setOpenPlayChatbotModal(false)}
      />
      <MoreMenu
        handleDelete={() => {
          handleDelete();
        }}
      />
      <Box sx={{ minHeight: 145 }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )} */}
        <VideoImgStyle
          alt="title"
          //  src={`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`}
          src={Image}
        />
      </Box>

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack
          direction="column"
          alignItems="left"
          justifyContent="space-between"
          sx={{ height: 100 }}
        >
          <Typography variant="h6">{QA_NAME}</Typography>
          <Typography variant="subtitle2">{Description}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Button onClick={() => setOpenPlayChatbotModal(true)}>
          <IconButton edge="end">
            <Icon icon={playFill} />
          </IconButton>
        </Button>
      </Stack>
    </Card>
  );
}
