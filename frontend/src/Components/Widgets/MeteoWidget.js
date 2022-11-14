import { Component} from "react";
import * as React from 'react';
import { styled} from '@mui/material/styles';
import { backendUrl } from "../../scripts/backendUrl";
import { Box, Typography } from "@mui/material";
import background from "./spotify.jpg";

const Widget = styled('div')(({ theme }) => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    height: 300,
    maxWidth: '100%',
    margin: 'auto',
    padding: 'auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'grey',
    backdropFilter: 'blur(40px)',
    backgroundImage: `url(${background})`,
    display:"flex",
    alignItems:"center",
    flexDirection:"column"
  }));

  
class MeteoWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: null,
            weather : null
        };
    }

    componentDidMount() { 
        let data ={
            setCity: (city)=>this.setCity(city)
        };

        this.props.setData(data);
    }

   componentDidUpdate(prevProps, prevState){
        if(this.state.city !== prevState.city && this.state.city !== null){
            this.city();
        }
   }

    setCity(city) {
        this.setState({
            city: city
        });
    }


    async city() {
        const response = await fetch(backendUrl+"/api/meteo/city?ville="+this.state.city, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });

        response.json().then((data)=>{
            this.setState({
               weather: data
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    }  

    render(){
        return( <Widget >
        
            <Box 
            sx={{
                width: 310,
                height: 80,
                display:"flex",
                margin:"auto",
                flexDirection:"row",
                justifyContent:"space-between",
                
            }}>
                
                <Box 
                sx={{display:"flex",
                flexDirection:"column",
                marginLeft:1,
                marginTop:1}}>
                    <Typography variant="h5">
                    {this.state.weather !== null ?
                            Math.floor(this.state.weather.main.temp-273.15)+"°" : ""}
                    </Typography>
                    <Box>
                    {this.state.weather !== null &&
                            this.state.weather.weather[0].main}
                    </Box>
                </Box>
                <Box                
                sx={{display:"flex",
                flexDirection:"column",
                marginRight:1,
                marginTop:1
                }}>
                    <Typography variant="h5">
                        {this.state.weather !== null ? 
                            "🚩"+this.state.weather.name : <Typography variant="body2" sx={{color: "var(--text-danger)"}}>Veuillez renseigner une ville</Typography>
                        }
                    </Typography>
                </Box>


            </Box>

            <Box 
            sx={{
                width: 310,
                height: 30,
                display:"flex",
                margin:"auto",
                flexDirection:"row",
                justifyContent:"space-around",
                alignItems:"center",
            }}>
                <Typography variant="h6">
                 {this.state.weather !== null ?
                            "T-min"+Math.floor(this.state.weather.main.temp_min-273.15)+"°" : "" }
                </Typography>
                <Typography variant="h6">
                {this.state.weather !== null ?
                            "T-max"+Math.floor(this.state.weather.main.temp_max-273.15)+"°" : ""}
                </Typography>

            </Box>
            </Widget>
        )
    }
}


export default MeteoWidget;