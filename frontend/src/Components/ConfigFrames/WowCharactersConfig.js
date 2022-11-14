import { Component } from "react";
import { FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

class WowCharactersConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: "",
        };

    }

    render() { 
        return <div className="widget-settings d-flex flex-column gap">
            <Typography variant="h5" component="p" gutterBottom sx={{display: "flex", justifyContent:"space-between", alignItems: "center"}}>
                <img src="./assets/WoW_icon.svg" alt="icon wow"/>Wow Characters
            </Typography>
            <hr/>
            <FormControl sx={{
                margin: "auto"
            }} fullWidth>
            <InputLabel id="label-object-type">Account</InputLabel>
            <Select
                labelId="label-object-type"
                id="object-type-select"
                label="Account"
                fullWidth
            >
                {this.props.data?.accounts?.map((it, i)=>(<MenuItem key={i} value={i} onClick={()=>this.props.data?.setAccount(i)}>Account {i}</MenuItem>))}
            </Select>
        </FormControl>
        </div>;
    }
}
 
export default WowCharactersConfig;