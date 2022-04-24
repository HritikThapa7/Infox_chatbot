import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import { Icon } from '@iconify/react';
import Loader from '../components/Loader';
import Page from '../components/Page';
import { ChatbotList } from '../components/_dashboard/chatbots';
import AddNewChatbotModal from '../components/_dashboard/chatbots/AddNewChatbotModal';
import { AppContext } from '../context/AppContext';
import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';
// ----------------------------------------------------------------------

export default function Chatbots() {
  const [chatbots, setChatbots] = useState(null);
  const navigate = useNavigate();
  const appCtx = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const { authAxios } = useContext(FetchContext);
  //   const [chatbots, setChatbots] = useState([
  // {
  //   id: 1,
  //   title: 'Infox Chatbot',
  //   description:
  //     'This chatbot is about team Infox and teams. Who are they, what they are building',
  //   imageSrc: 'https://miro.medium.com/max/800/0*oz2e-hQtsHOWzoB4.'
  // },
  // {
  //   id: 2,
  //   title: 'Dhulikhel Hospital',
  //   description: 'Know about Dhulikhel Hospital, its service and schedule',
  //   imageSrc:
  //     'https://www.hamrodoctor.com/image.php?src=/uploads/hospitals/580c87f7aed26.jpg&w=1000'
  // },
  // {
  //   id: 2,
  //   title: 'Kathmandu University',
  //   description: 'Get information on admission, courses at Kathmandu University',
  //   imageSrc: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Kathmandu_University_Logo.svg'
  // }
  //   ]);
  const [openEditVideoModal, setOpenEditVideoModal] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const username = authContext.getUsername();
  const url = appCtx.userMode ? `app/usermode/${username}` : `app/get_all/`;
  useEffect(() => {
    authAxios
      .get(url)
      .then((res) => {
        setChatbots(JSON.parse(res.data));
      })
      .catch(() => {});
  }, [authAxios, url, triggerRefresh]);

  return (
    <Page title="Admin Panel | Chatbots">
      <AddNewChatbotModal
        open={openEditVideoModal}
        handleOpen={() => setOpenEditVideoModal(true)}
        handleClose={() => setOpenEditVideoModal(false)}
      />
      <Container>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          {appCtx.userMode && (
            <Button
              sx={{ fontSize: '20px' }}
              variant="contained"
              onClick={() => {
                navigate('/login');
                appCtx.setUserMode(false);
              }}
            >
              Login as admin
            </Button>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Chatbots
          </Typography>
          {!appCtx?.userMode && (
            <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={() => setOpenEditVideoModal(true)}
            >
              New Chatbot
            </Button>
          )}
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }} />
          {!chatbots ? (
            <Loader />
          ) : (
            <ChatbotList
              chatbots={chatbots}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
            />
          )}
        </Stack>
      </Container>
    </Page>
  );
}
