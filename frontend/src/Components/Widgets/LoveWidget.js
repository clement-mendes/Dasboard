import { Component} from "react";
import * as React from 'react';
import { styled} from '@mui/material/styles';
import { backendUrl } from "../../scripts/backendUrl";
import { Box, Typography, Card } from "@mui/material";
import background from "./gif-heart-47.gif";

const Widget = styled('div')(({ theme }) => ({
    borderRadius: 16,
    width: 343,
    height: 300,
    maxWidth: '100%',
    position: 'relative',
    zIndex: 1,
    padding: 'auto',
    backgroundColor: 'grey',
    backdropFilter: 'blur(40px)',
    textAlign: "center",
    backgroundSize:"cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `url(${background})`,
    display:"flex",
    flexFlow:"column nowrap",
    alignItems:"center"
  }));

  
class LoveWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sname: null,
            fname: null,
            percentage : null
        };
    }

    componentDidMount() { 
        let data ={
            setName: (sname, fname)=>this.setName(sname, fname)
        };

        this.props.setData(data);
    }

   componentDidUpdate(prevProps, prevState){
        if(this.state.sname !== prevState.sname && this.state.sname !== null){
            this.calculate();
        }
        if(this.state.fname !== prevState.fname && this.state.fname !== null){
            this.calculate();
        }
   }

    setName(sname, fname) {
        this.setState({
            sname: sname,
            fname: fname
        });
    }


    async calculate() {
        const response = await fetch(backendUrl+"/api/love/percentage?sname="+this.state.sname+"&fname="+this.state.fname, {
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
               percentage: data
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    }  

    render(){
        return( <Widget><h1>Love calculator</h1>     
        <Card 
            sx={{
                height: 20,
                width: 150,
                textAlign:"center",
                marginTop:"20px",
                display:"flex",
                justifyContent:"space-around"
            }}>
            {this.state.percentage !== null && this.state.percentage.sname}
  
        </Card>
  
        <Box sx={{
                height: 15,
                }}>
        </Box>
  
        <Card 
            sx={{
                height: 20,
                width: 150,
                textAlign:"center",
                marginTop:"5px",
                display:"flex",
                justifyContent:"space-around"
            }}>
            {this.state.percentage !== null && this.state.percentage.fname}
        </Card>
  
        <Box 
        sx={{
            display:"flex",
            margin:"auto",
            flexDirection:"row",
            justifyContent:"space-around",
            alignItems:"center",
            marginTop:"80px"
        }}>
            <Typography >
            {this.state.percentage !== null ? "Love percentage: "+this.state.percentage.percentage+"%" : ""}
            </Typography>
        </Box>
        <Box 
        sx={{
            display:"flex",
            margin:"auto",
            flexDirection:"row",
            justifyContent:"space-around",
            alignItems:"center",
        }}>
            <Typography >
            {this.state.percentage !== null ? "Result: "+this.state.percentage.result : "Discover the percentage of match"}
            </Typography>
        </Box>
      </Widget>)
    }
}


export default LoveWidget;