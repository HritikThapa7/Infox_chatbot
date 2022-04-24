import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AppContext } from '../../../context/AppContext';
import publicFetch from '../../../utils/fetch';
import { AuthContext } from '../../../context/AuthContext';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      username: 'santosh',
      password: 'subedi'
      //   remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async ({ username, password }) => {
      try {
        const res = await publicFetch.post('login/', {
          username,
          password
        });
        appContext.handleAlert({ type: 'success', message: 'Logged in' });

        const userInfo = await publicFetch.get(`getUser/`, {
          headers: {
            'x-access-token': res.data.Token
          }
        });

        // console.log(JSON.parse(userInfo.data['User Details'])[0]);
        authContext.setAuthState({
          token: res.data.Token,
          userInfo: JSON.parse(userInfo.data['User Details'])[0]
          //  expiresAt: res.data.exp
        });
        navigate('/dashboard', { replace: true });
      } catch (error) {
        appContext.handleAlert();
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            label="Username"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
