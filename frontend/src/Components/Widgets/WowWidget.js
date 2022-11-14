import { Component } from "react";
import { backendUrl } from "../../scripts/backendUrl";
import { Select, MenuItem, FormControl, InputLabel, Table, TableCell, TableBody, TableHead, TableRow, Paper, TableContainer, Typography } from "@mui/material";
import "./bnet.css";
import { ArrowDownwardSharp, ArrowUpwardSharp, DoubleArrowSharp } from "@mui/icons-material";
import "../../css/widget.css";

const [maxWidth, maxHeight] = ["100%", "400px"];

class WowWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realms: [],
            auctions:{},
            searchResults: [],
            objectTypes: [],
            selectedRealm: null,
            selectedType: null,
            images: [],
            loading: false,
            sortBy: null,
            width: undefined,
            height: undefined
        };

        
    }

    componentDidMount() { 
        this.getEveryRealms();
        let mySize = this.props.getMySize();
        this.setState({
            width: mySize.width,
            height: mySize.height
        });
    }

    componentDidUpdate() {
        let mySize = this.props.getMySize();
        if(mySize.width !== this.state.width || mySize.height !== this.state.height) {
            this.setState({
                width: mySize.width,
                height: mySize.height
            });
        }
        
    }

    async getEveryRealms() {
        const response = await fetch(backendUrl + "/api/battlenet/getEveryRealms", {
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
            if(data.error !== undefined) {
                if(data.url !== undefined) {
                    document.location = data.url
                }
                return;
            }
            this.setState({
                realms: data
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    }

    async getAuctions() {
        
        const response = await fetch(backendUrl + "/api/battlnet/getEveryAuctions?realmId="+this.state.selectedRealm, {
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
            if(data.error !== undefined) {
                if(data.url !== undefined) {
                    document.location = data.url
                }
                return;
            }
            if(Object.keys(this.state.auctions).includes(data.name)) {
                delete this.state.auctions[data.name];
            }

            let maxPrice = 0;
            let minPrice = 0;
            
            for(let i = 0; i < data.length; i++) {
                this.state.objectTypes.push(data[i].type);

                if(data[i].price > maxPrice) {
                    maxPrice = data[i].price;
                } else if(data[i].price < minPrice) {
                    minPrice = data[i].price;
                }
                if(!this.state.images.includes(data[i].media)) {
                    fetch(data[i].media, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    })
                    .then((res)=>res.json())
                    .then((res)=>{
                        if(Object.keys(res).includes("assets")) {
                            this.setState({
                                images: [...this.state.images, data[i].media]
                            });
                            data[i].href = res.assets[0].value
                            
                        }
                            
                    })
                    .catch((err)=>{
                        console.error(err);
                    });
                } else {
                    data[i].href = this.state.images[data[i].media];
                }
                
            }
            data.minPrice = minPrice;
            data.maxPrice = maxPrice;

            this.state.auctions[this.state.selectedRealm] = data;

            this.props.setData({
                "auctions": data,
                "searchStart": ()=>this.searchStart(),
                "searchEnd": (result)=>this.searchEnd(result),
                "objectTypes": [...new Set(this.state.objectTypes)]
            });
            
            this.setState({
                loading: false,
                objectTypes: [...new Set(this.state.objectTypes)],
                searchResults: data
            });
        });
    }

    handleChangeRealm(e) {
        if(Object.keys(this.state.auctions).includes(e.target.value)) {
            return;
        }
        this.setState({
            selectedRealm: e.target.value,
            loading:true,
        }, ()=>{
            this.getAuctions();
        });
    }

    searchStart() {
        this.setState({
            searchResult : {},
            loading: true
        });
    }

    searchEnd(result) {
        this.setState({
            loading: false,
            searchResults: result
        });
    }

    sortBy() {
        let result;
        
        if(this.state.sortBy === "asc"){
            result = this.state.searchResults.sort((a, b) => a.price > b.price)
        } else if(this.state.sortBy === "desc") {
            result = this.state.searchResults.sort((a, b) => a.price < b.price)
        } else {
            result = this.state.auctions[this.state.selectedRealm];
        }

        this.setState({
            searchResult: result,
            sortBy: this.state.sortBy === "asc" ? "desc" : this.state.sortBy === "desc" ? null : "asc"
        });
    }

    render() { 
        return <div className="bnet-widget widget"> 
            
                <div className="w-100" style={{
                    maxHeight: "100%",
                    height: "100%"
                }}>
                    <FormControl sx={{
                        margin: "auto",
                        maxHeight: "56px"
                    }} fullWidth>
                        <InputLabel id="label-realm">Realm</InputLabel>
                        <Select
                            labelId="label-realm"
                            id="realm-select"
                            value={this.selectedRealm}
                            label="Realm"
                            onChange={(e)=>this.handleChangeRealm(e)}
                            fullWidth
                        >
                        
                        {this.state.realms.map((it, i)=>(<MenuItem value={it.id}>{it.name}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <TableContainer component={Paper} sx={{
                        height: "calc(100% - 56px)"
                    }}>
                        <Table aria-label="auction-table" sx={{height: "100%"}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Materiel</TableCell>
                                    <TableCell onClick={()=>this.sortBy()} sx={{cursor:"pointer"}}>
                                        Prix
                                        {
                                            this.state.sortBy === "asc" ? 
                                                <ArrowUpwardSharp sx={{maxHeight: "14px"}}/> 
                                                : 
                                                this.state.sortBy === "desc" ?
                                                    <ArrowDownwardSharp sx={{maxHeight: "14px"}}/> 
                                                    :
                                                    <DoubleArrowSharp sx={{maxHeight: "14px"}}/>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{
                                maxHeight: "100%",
                                minHeight: "100%",
                                overflowY: "auto",
                            }}>
                                
                                {   
                                    Object.keys(this.state.auctions).includes(this.state.selectedRealm) ?
                                        this.state.searchResults.map((it, i)=>
                                            <TableRow>
                                                <TableCell sx={{lineHeight: "30px", verticalAlign: "center"}}><img src={it.href} alt={"image of "+it.name} className="item-icon-bnet"/> {it.name}</TableCell>
                                                <TableCell>{it.type}</TableCell>
                                                <TableCell>{it.subtype}</TableCell>
                                                <TableCell>
                                                    <span className="text-gold">{Math.floor(Number(it.price) / 10000)} po </span>
                                                    <span className="text-silver">{Math.floor((Number(it.price) % 10000) / 100)} pa </span>
                                                    <span className="text-bronze">{(Number(it.price) % 10000) % 100} pc</span>
                                                </TableCell>
                                            </TableRow>)
                                    : 
                                    <TableRow>
                                        <TableCell colSpan={4}>{this.state.loading ? 
                                            <div className="text-center"><div class="lds-ring"><div></div><div></div><div></div><div></div></div><Typography variant="h4">Loading</Typography></div>
                                    :
                                            <Typography variant="body2" sx={{color:"var(--text-danger)", margin: "2em"}}>Séléctionnez un serveur</Typography>}
                                        </TableCell>
                                    </TableRow>
                                    
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                
            </div>
    }
}
 
export default WowWidget;