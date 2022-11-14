import { Component } from "react";
import { Typography } from "@mui/material";
import { backendUrl } from "../../scripts/backendUrl";
import * as React from 'react';
import { styled} from '@mui/material/styles';
import background from "./alexback.jpg";

const Widget = styled('div')(({ theme }) => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    height: 300,
    maxWidth: '100%',
    position: 'relative',
    zIndex: 1,
    overflowY: "auto",
    backgroundColor: 'grey',
    backdropFilter: 'blur(40px)',
    backgroundImage: `url(${background})`
  }));

class CoinUnitWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cryptos: [],
            selectedCryptos:undefined,
        }
    }

    componentDidMount() { 
        this.getId();
        let mySize = this.props.getMySize();
        this.setState({
            width: mySize.width,
            height: mySize.height
        });
    }

    componentDidUpdate(prevProps, prevState) {
        let mySize = this.props.getMySize();
        if(mySize.width !== this.state.width || mySize.height !== this.state.height) {
            this.setState({
                width: mySize.width,
                height: mySize.height
            });
        } 
    }

    async getId() {
        const response = await fetch(backendUrl + "/api/coinmarketcap/getId", {
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
            this.setState({});
            this.props.setData({
                "cryptos": data.data,
                "addCrypto": (crypto)=>this.addCrypto(crypto)
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    } 

    addCrypto(crypto) {
        this.getLogo(crypto.id).then((data)=>{
            this.setState({
                selectedCryptos: data
            });
        }).catch((err)=>{
            console.error(err);
        });
    }

    async getLogo(cryptoId) {
        const response = await fetch(backendUrl + "/api/coinmarketcap/getLogo?cryptoId="+ cryptoId, {
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
        const result = await response.json();
        return result.data[cryptoId];
    }
    

    render() { 
        return (
        <Widget
            sx={{
            width: 400,
            height: 300,
            borderRadius:"15px",
            backgroundColor: 'rgb(250,247,234)',
        }}>
            <div 
            sx={{
                display:"flex",
                flexDirection: "column",
                gap:1,
                justifyContent:"space-evenly",
                alignItems:'center'
            }}>   
                <div sx={{
                width: 400,
                height: 80}}>
                    <img 
                    src={this.state.selectedCryptos?.logo} 
                    alt="" 
                    height="80px"
                    />
                </div>
                <Typography variant="h4" color="white">
                    {this.state.selectedCryptos?.name}<br/>
                </Typography>
                <Typography variant="body2" color="white">
                {this.state.selectedCryptos !== null && this.state.selectedCryptos !== undefined ? 
                    "Description : "+ this.state.selectedCryptos?.description : "Veuillez selectionner une Cryptomonnaie"
                        }
                </Typography>
                <Typography variant="body2" color="white">
                {this.state.selectedCryptos !== null && this.state.selectedCryptos !== undefined ? 
                    "Listing Date :"+ new Date(this.state.selectedCryptos?.date_added).toDateString() : ""
                        }
                </Typography>
            </div> 
        </Widget>
        )
    }
}    
 
export default CoinUnitWidget;