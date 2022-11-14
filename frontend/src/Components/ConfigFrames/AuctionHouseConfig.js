import { Typography } from "@mui/material";
import { Component, createRef } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

class AuctionHouseConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.nameSearchRef = createRef();
        this.priceMinRef = createRef();
        this.priceMaxRef = createRef();
        this.typeRef = createRef();
    }

    search() {
        this.props.data.searchStart();
        let name = this.nameSearchRef.current.value;
        let priceMin = this.priceMinRef.current.value;
        let priceMax = this.priceMaxRef.current.value;
        let type = this.typeRef.current.value;

        
        let result = [];
        this.props.data.auctions.map(it=>{
            if(
                (it.name.toLowerCase().includes(name.toLowerCase()) || !name) &&
                (it.price > priceMin * 10000 || !priceMin) && 
                (it.price < priceMax * 10000 || !priceMax) &&
                (it.type == type || !type)) {
                result.push(it);
            }
        });

        this.props.data.searchEnd(result);
    }

    render() { 
        return <div className="d-flex flex-column gap justify-content-evenly ph-2 align-items-center widget-settings" >
        
        <Typography variant="h5" component="p" gutterBottom sx={{display: "flex", justifyContent:"space-between", alignItems: "center"}}>
            <img src="./assets/WoW_icon.svg" alt="icon wow"/>Wow auction house
        </Typography>
        <hr/>
        <TextField 
            id="outlined-search-name" 
            label="Item name" 
            variant="outlined" 
            inputRef={this.nameSearchRef}
            fullWidth
        />

        <TextField 
            id="outlined-price-min" 
            type="number" 
            label="Price min (en po)" 
            variant="outlined" 
            inputRef={this.priceMinRef}
            defaultValue={this.props.data?.minPrice} 
            fullWidth
        />
        <TextField 
            id="outlined-price-max" 
            type="number" 
            label="Price max (en po)" 
            variant="outlined" 
            inputRef={this.priceMaxRef}
            defaultValue={this.props.data?.maxPrice} 
            fullWidth
        />

        <FormControl sx={{
            margin: "auto"
        }} fullWidth>
            <InputLabel id="label-object-type">Type</InputLabel>
            <Select
                labelId="label-object-type"
                id="object-type-select"
                value={this.selectedType}
                label="Types"
                inputRef={this.typeRef}
                fullWidth
            >
            
                {this.props.data?.objectTypes.map((it, i)=>(<MenuItem key={i} value={it}>{it}</MenuItem>))}
            </Select>
        </FormControl>
        <Button onClick={()=>this.search()}>Search</Button>
    </div>;
    }
}
 
export default AuctionHouseConfig;