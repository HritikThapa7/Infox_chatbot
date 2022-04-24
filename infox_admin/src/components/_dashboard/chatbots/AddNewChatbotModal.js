import {
  Box,
  Card,
  Container,
  Drawer,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';
import chatbot from '@iconify/icons-ant-design/robot-filled';
import next from '@iconify/icons-ant-design/arrow-right';
import { FetchContext } from '../../../context/FetchContext';
import AppButton from '../../AppButton';
import { UserListHead } from '../user';

const TABLE_HEAD = [
  { id: 'question', label: 'Question', alignRight: false },
  { id: 'answer', label: 'Answer', alignRight: false },
  { id: '' }
];

export default function AddNewChatbotModal(props) {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('asc');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [showCreateChatbot, setShowCreateChatbot] = useState(false);
  const [db, setDb] = useState([]);
  const [step, setStep] = useState(0);
  const { authAxios } = useContext(FetchContext);

  const handleAddNextQa = () => {
    if (!question || !answer) return;
    setDb((prev) => [
      ...prev,
      {
        question,
        answer
      }
    ]);
    setQuestion('');
    setAnswer('');
  };

  useEffect(() => {
    (() => db.length >= 5 && setShowCreateChatbot(true))();
  }, [db.length]);
  console.log({ db });

  const handleSubmit = () => {
    //  e.preventDefault();
    const qa = {};
    // const qa = {
    //   'What is your brother name?': 'My brother name is Sanup.',
    //   'Where do you live?': 'I live in Kathmandu.',
    //   'What is your hobby?': 'I like programming and playing guitar.',
    //   'How many members are there in your family?': 'I have 4 members in my family.',
    //   'What are you studying?':
    //     'I am currently pursuing my bachelors in Computer engineering in Kathmandu University.'
    // };
    db.forEach((item) => {
      console.log(item);
      qa[`${item.question}`] = item.answer;
    });
    toast.promise(
      (async () => {
        await authAxios.post('createEmbeddings/', {
          qa_name: title,
          title,
          description,
          image: imageUrl,
          QA: qa
        });
        props.handleClose();
        setDb([]);
        setImageUrl('');
        setDescription('');
        setStep(0);
        setAnswer('');
        setQuestion('');
        setTitle('');
      })(),
      {
        loading: 'Creating Embeddings...',
        success: <b>Embeddings created.</b>,
        error: <b>Could not create Embeddings.</b>
      }
    );
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
            variant="h3"
            sx={{
              marginTop: '20px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Icon icon={chatbot} width={43} height={43} />
            Add Chatbot
          </Typography>
          <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
            <Grid container spacing={2} direction="column">
              {step === 0 && (
                <>
                  <Typography
                    gutterBottom
                    variant="h4"
                    sx={{
                      marginTop: '20px',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    Add Meta Data
                  </Typography>

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
                      sx={{ width: '500px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      name="Image URL"
                      required
                      fullWidth
                      id="imageUrl"
                      label="Image URL"
                      autoFocus
                      sx={{ width: '500px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      name="Description"
                      maxRows={4}
                      required
                      fullWidth
                      multiline
                      id="description"
                      label="Description"
                      autoFocus
                      sx={{ width: '500px' }}
                    />
                  </Grid>
                  <AppButton
                    loading={loading}
                    onClick={() => {
                      if (!title || !description || !imageUrl) return;
                      setStep((_) => _ + 1);
                    }}
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'black',
                      color: '#ffffff'
                      //  textAlign: 'center'
                    }}
                  >
                    <span>Next Step</span>
                    <Icon icon={next} width={23} height={23} />
                  </AppButton>
                </>
              )}
              {step === 1 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      autoComplete="question"
                      name="question"
                      required
                      fullWidth
                      id="question"
                      label="Question"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      autoComplete="answer"
                      name="answer"
                      required
                      fullWidth
                      id="answer"
                      label="Answer"
                      autoFocus
                    />
                  </Grid>
                  <AppButton
                    loading={loading}
                    onClick={handleAddNextQa}
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'black',
                      color: '#ffffff'
                      //  textAlign: 'center'
                    }}
                  >
                    <span>Add Next QA </span>
                    <Icon icon={next} width={23} height={23} />
                  </AppButton>
                  <Grid item>
                    <Card>
                      <TableContainer>
                        <Table>
                          <UserListHead
                            order={order}
                            orderBy="question"
                            headLabel={TABLE_HEAD}
                            rowCount={100}
                            onRequestSort={() => {}}
                          />
                          <TableBody>
                            {db.map((row, index) => {
                              const { question, answer } = row;

                              return (
                                <TableRow hover key={`question${index}`} role="checkbox">
                                  <TableCell padding="checkbox" />
                                  <TableCell component="th" scope="row" padding="none">
                                    <Typography variant="subtitle2" noWrap>
                                      {question}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography variant="subtitle2" noWrap>
                                      {answer}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {showCreateChatbot && step === 1 && (
                        <AppButton
                          loading={loading}
                          onClick={handleSubmit}
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 3,
                            height: '80px',
                            mb: 2,
                            background: 'secondary',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: '20px'
                          }}
                        >
                          Start chatbot creation process
                          <Icon icon={chatbot} width={40} height={40} />
                        </AppButton>
                      )}
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Drawer>
  );
}
