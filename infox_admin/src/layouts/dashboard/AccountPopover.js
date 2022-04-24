import { useContext, useRef, useState } from 'react';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, Typography, Avatar, IconButton } from '@mui/material';
// components
import { Icon } from '@iconify/react';
import logoutIcon from '@iconify/icons-eva/log-out-fill';
import userIcon from '@iconify/icons-ant-design/user';
import MenuPopover from '../../components/MenuPopover';
//
import { AppContext } from '../../context/AppContext';
// import account from '../../_mocks_/account';
import { AuthContext } from '../../context/AuthContext';

// ----------------------------------------------------------------------
const label = { inputProps: { 'aria-label': 'Switch demo' } };
// const MENU_OPTIONS = [
//   {
//     label: 'Home',
//     icon: homeFill,
//     linkTo: '/'
//   },
//   {
//     label: 'Profile',
//     icon: personFill,
//     linkTo: '#'
//   },
//   {
//     label: 'Settings',
//     icon: settings2Fill,
//     linkTo: '#'
//   }
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const nagivate = useNavigate();
  const authContext = useContext(AuthContext);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const appCtx = useContext(AppContext);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
        <Icon icon={userIcon} width={22} height={22} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {authContext.authState?.userInfo?.first_name} &nbsp;{' '}
            {authContext.authState?.userInfo?.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {authContext.authState?.userInfo?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))} */}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button onClick={authContext.logout} fullWidth color="inherit" variant="outlined">
            <Icon icon={logoutIcon} width={22} height={22} />
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
