import { Component } from "react";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

class CoinMarketCap extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() { 
        return <div className="d-flex flex-column gap justify-content-evenly ph-2 align-items-center widget-settings" >
        <Typography variant="h4">CoinMarketCap</Typography>

        <FormControl sx={{
            margin: "auto"
        }} fullWidth>
            <InputLabel id="label-object-type">Crypto</InputLabel>
            <Select
                labelId="label-object-type"
                id="object-type-select"
                label="Crypto"
                fullWidth
            >
            
            {
            this.props.data?.cryptos?.map((it, i)=>
            <MenuItem key={i} onClick={()=>this.props.data.addCrypto(it)}>{it.name}</MenuItem>
            )}
            </Select>
        </FormControl>
        </div>
    }
}
 
export default CoinMarketCap;