import { Grid } from '@mui/material';
import { ChatBotCard } from '.';

// ----------------------------------------------------------------------

export default function ChatbotList({ chatbots, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {chatbots.map((chatbot, index) => (
        <Grid key={`chatbot${index}`} item xs={12} sm={6} md={3}>
          <ChatBotCard chatbot={chatbot} {...other} />
        </Grid>
      ))}
    </Grid>
  );
}
