/* eslint-disable jsx-a11y/media-has-caption */
import { Card, Paper, Stack } from '@mui/material';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useEffect, useContext, useState } from 'react';
import recording from '@iconify/icons-ic/record-voice-over';
import mic from '@iconify/icons-eva/mic-off-outline';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import AppButton from '../../AppButton';
import { AppContext } from '../../../context/AppContext';
import publicFetch from '../../../utils/fetch';
import { FetchContext } from '../../../context/FetchContext';

const AudioRecorder = ({ title }) => {
  const [output, setOutput] = useState('');
  const appContext = useContext(AppContext);
  const { authAxios } = useContext(FetchContext);

  useEffect(() => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = output;
    window.speechSynthesis.speak(speech);

    return () => {
      setOutput('');
    };
  }, [output]);

  return (
    <Card>
      <Stack spacing={4}>
        <Paper sx={{ p: 4 }}>
          <ReactMediaRecorder
            audio
            mediaRecorderOptions={{
              mimeType: 'audio/wav',
              audioBitsPerSecond: '16'
            }}
            render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
              <>
                {/* <Typography variant="h4">{status}</Typography> */}
                <Stack spacing={4}>
                  {status === 'recording' && <Icon icon={recording} width={43} height={43} />}
                  {status === 'idle' && <Icon icon={mic} width={43} height={43} />}
                  {/* <p>{status}</p> */}
                  <audio src={mediaBlobUrl} controls autoPlay loop />
                  {status !== 'recording' && (
                    <AppButton
                      variant="contained"
                      onClick={() => {
                        startRecording();
                        // appContext.handleAlert({
                        //   severity: 'success',
                        //   message: 'Recording Started'
                        // });
                        toast.success('Recording started');
                      }}
                    >
                      Start Recording
                    </AppButton>
                  )}
                  {status === 'recording' && (
                    <AppButton
                      variant="contained"
                      onClick={() => {
                        // appContext.handleAlert({
                        //   severity: 'success',
                        //   message: 'Recording Stopped'
                        // });
                        toast.success('Recording Stopped');
                        stopRecording();
                      }}
                    >
                      Stop Recording
                    </AppButton>
                  )}
                  <AppButton
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      const formData = new FormData();

                      // convert blob url to blob
                      const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());

                      // get audio binary file from blon
                      const audiofile = new File([audioBlob], `wav_file.wav`, {
                        type: 'audio/wav'
                      });

                      formData.append('audio_file', audiofile);
                      toast.promise(
                        (async () => {
                          try {
                            // appContext.handleAlert({
                            //   severity: 'success',
                            //   message: 'Sending Audio...'
                            // });
                            // toast.success('Recording Stopped');
                            const res = await publicFetch.post(`app/${title}/`, formData);
                            // appContext.handleAlert({
                            //   severity: 'success',
                            //   message: 'Audio sent'
                            // });
                            console.log(res);
                            const { data } = res;
                            setOutput(data.output);
                            console.log('data from res', data.output);
                          } catch (error) {
                            throw console.log(error);
                            // appContext.handleAlert({
                            //   severity: 'error',
                            //   message: 'Could not send audio.'
                            // });
                          }
                        })(),
                        {
                          loading: 'Sending Audio...',
                          success: <b>Audio sent</b>,
                          error: <b>Could not send audio.</b>
                        }
                      );

                      //   {
                      //     loading: 'Sending Audio...',
                      //     success: <b>Audio sent</b>,
                      //     error: <b>Could not send audio.</b>
                      //   }
                      // );
                    }}
                  >
                    Get Answer
                  </AppButton>
                </Stack>
              </>
            )}
          />
        </Paper>
        <Paper sx={{ p: 4 }}>Output here: {output} </Paper>
      </Stack>
    </Card>
  );
};

export default AudioRecorder;
