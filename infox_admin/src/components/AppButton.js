import { CircularProgress, Grid, Stack } from '@mui/material';
import Button from '@mui/material/Button';

export default function AppButton(props) {
  return (
    <Button {...props}>
      <Grid container justifyContent="center" alignItems="center">
        {props?.loading ? (
          <Grid item>
            <CircularProgress />
          </Grid>
        ) : null}
        <Stack direction="row">{props.children}</Stack>
      </Grid>
    </Button>
  );
}
