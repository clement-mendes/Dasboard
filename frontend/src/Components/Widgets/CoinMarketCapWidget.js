import { Component } from "react";
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import * as React from 'react';
import { styled} from '@mui/material/styles';
import { backendUrl } from "../../scripts/backendUrl";
import background from "./alexback.jpg";

const Widget = styled('div')(({ theme }) => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    height: 300,
    maxWidth: '100%',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'grey',
    backdropFilter: 'blur(40px)',
    backgroundImage: `url(${background})`
  }));

class CoinMarketCapWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cryptos: [],
            searchResults:[],
            logo:[],
            currency: "USD",
            selectedCryptos:[],
        };
    }
    
    HandleChange = (event) => {
        this.setCurrency(event.target.value);
    };

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
            crypto.logo = data;
            this.setState({
                selectedCryptos: [...this.state.selectedCryptos, crypto]
            });
        }).catch((err)=>{
            console.error(err);
        });
    }

    removeCrypto(crypto){
        this.state.selectedCryptos = this.state.selectedCryptos.splice(crypto,1);
        this.setState();
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
        return result.data[cryptoId].logo;
    }
    
    render() {
        return  <Box
                        sx={{
                        width: 660,
                        height: 300,
                        borderRadius:"15px",
                        backgroundColor: 'lightgrey',
                        display:"flex",
                        flexDirection:"row",
                        gap:1,
                        margin:0,
                        justifyContent:"center",
                        alignItems:'center'
                    }}>
                        {this.state.selectedCryptos.slice(0,5).map((it, i)=>(
                        <Widget onClick={()=>this.removeCrypto(i)}          
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius:"15px",
                                backgroundColor: "white",
                            }}>
                                <div 
                                    style={{
                                        display:"flex",
                                        flexFlow:"row",
                                        alignItems:"center",
                                        justifyContent:"space-between",
                                        gap:1,  
                                        flexWrap:"nowrap",
                                        color:"white",               
                                    }}>
                                    <img 
                                    src={it.logo} 
                                    alt="" 
                                    height="30px"
                                    />
                                    <Typography variant="body2" color="white">
                                    {it.quote.USD.percent_change_7d.toFixed(1)} %
                                    </Typography>
                                </div>
                                <div 
                                    style={{
                                        display:"flex",
                                        flexFlow:"column",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        gap:1,
                                        color:"white",
                                        textAlign:"center",
                                        flexWrap:"wrap",
                                        marginTop:1,       
                                    }}>
                                    <Typography variant="body1" color="white">
                                    {it.name} <br />
                                    {it.quote.USD.price.toFixed(2)} $
                                    </Typography>
                                </div>
                            </Widget>
                            ))}
                    </Box>
        }
}

export default CoinMarketCapWidget;
