import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import { backendUrl } from '../../scripts/backendUrl';
import background from "./spotify.jpg";


const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  height: 300,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: 'grey',
    // theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});



export default function SpotifyWidget() {
  const theme = useTheme();
  const [paused, setPausedState] = React.useState(false);
  const [devices, setDevices] = React.useState(null);
  const [icon, setIcon] = React.useState(null);

  

  React.useEffect(() => {
    if (devices === null){
      getDevices();
    }
  });


  const getDevices = async function (){
    const response = await fetch(backendUrl+"/api/spotify/devices", {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no
    })
    response.json().then((data)=>{
      if(data.error !== undefined) {
        if(data.url !== undefined) {
            document.location = data.url
        }
        return;
      }
      if (data !== null && data.devices.length !==0 ){
        getIcon();
      }
      setDevices(data);

    })
  .catch((err)=>{
      console.error(err);
    })
  }

  const getNext = async function (){
    const response = await fetch(backendUrl+"/api/spotify/next?device_id="+devices["devices"][0]["id"], {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no
    });
    response.json().then((data)=>{
      if(data.error !== undefined) {
        if(data.url !== undefined) {
            document.location = data.url
        }
        return;
      }
      getIcon();
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  const getPrevious = async function (){
    const response = await fetch(backendUrl+"/api/spotify/previous?device_id="+devices["devices"][0]["id"], {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no
    });
    response.json().then((data)=>{
      if(data.error !== undefined) {
        if(data.url !== undefined) {
            document.location = data.url
        }
        return;
      }
      getIcon()
    })
  .catch((err)=>{
      console.error(err);
    })
  }

  const getIcon = async function (){
    const response = await fetch(backendUrl+"/api/spotify/icon", {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no
    });
    response.json().then((data)=>{
      if(data.error !== undefined) {
        if(data.url !== undefined) {
            document.location = data.url
        }
        return;
      }
      setIcon(data);
      setPausedState(!data.is_playing);
    })
  .catch((err)=>{
      console.error(err);
    })
  }

  const setPaused = async function (paused){
    setPausedState(paused);
    let url;
    if(paused) {
      url = backendUrl+"/api/spotify/pause";
    } else {
      url = backendUrl+"/api/spotify/play";
    }
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no
    });
    response.json().then((data)=>{
      if(data.error !== undefined) {
        if(data.url !== undefined) {
            document.location = data.url
        }
        return;
      }
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  return (
    
      <Widget sx ={{backgroundImage: `url(${background})`}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
               alt="Connect a device"
              src={icon?.item?.album?.images[0].url}
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {icon?.item?.album?.artists?.[0].name}
            </Typography>
            <Typography noWrap>
              <b> {icon?.item?.album?.name}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              {icon?.item?.name} &mdash;
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton 
          aria-label="previous song" onClick={() => getPrevious()}>
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
            
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton 
             aria-label="next song" onClick={() => getNext()}
            ><FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
      </Widget>
  );
}
