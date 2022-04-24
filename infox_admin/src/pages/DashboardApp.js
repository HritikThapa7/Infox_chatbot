// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Loader from '../components/Loader';

// components
import Page from '../components/Page';
import { TotalChatbotsCount } from '../components/_dashboard/app';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { FetchContext } from '../context/FetchContext';

// ----------------------------------------------------------------------
const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function DashboardApp() {
  const [state, setState] = useState(null);
  const authContext = useContext(AuthContext);
  const { authAxios } = useContext(FetchContext);
  const appCtx = useContext(AppContext);

  const username = authContext.getUsername();

  const url = appCtx.userMode ? `app/usermode/${username}` : `app/get_all/`;
  useEffect(() => {
    authAxios
      .get(url)
      .then((res) => {
        setState({ chatbots: JSON.parse(res.data)?.length });
      })
      .catch(() => {});
  }, [appCtx.userMode, authAxios, url, username]);

  //   useEffect(() => {
  //     setState({
  //       chatbots: 9
  //     });
  //  fetchContext.authAxios
  //    .get('stats')
  //    .then((res) => {
  //      console.log('stats');
  //      console.log(res);
  //      const { videos, news, blogs, gallery } = res.data;
  //      setState({
  //        videos,
  //        news,
  //        blogs,
  //        gallery
  //      });
  //    })
  //    .catch(() => {
  //      appContext.handleAlert();
  //    });
  //   }, []);
  return (
    <Page title="Dashboard | Admin Panel">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Hi, {authContext.authState?.userInfo?.first_name}{' '}
            {authContext.authState?.userInfo?.last_name}
          </Typography>
        </Box>
        <Grid container spacing={3} direction="column">
          {!state ? (
            <Loader />
          ) : (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TotalChatbotsCount count={state.chatbots} />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3}>
                <TotalBlogCount count={state.blogs} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TotalYoutubeVideos count={state.videos} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TotalGalleryCount count={state.gallery} />
              </Grid> */}
              {/* <Grid item xs={12} sm={6} md={3}>
                <h1>Toggle to User mode</h1>
                <Switch
                  {...label}
                  checked={appCtx.userMode}
                  onChange={() => {
                    if (!appCtx.userMode) {
                      appCtx.setUserMode(true);
                      authContext.logout();
                      nagivate('/dashboard/chatbots', { replace: true });
                    } else {
                      appCtx.setUserMode(false);
                    }
                  }}
                />
              </Grid> */}
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
