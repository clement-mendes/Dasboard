import { Component, Fragment } from "react";
import { ListItem, ListItemButton, ListItemText, List, Typography, Divider } from "@mui/material";
import { backendUrl } from "../../scripts/backendUrl";

const [maxWidth, maxHeight] = ["50%", "400px"];

class MountsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounts: {},
            width: undefined,
            height: undefined,
            selectedImage: undefined,
            token: undefined
        };
    }

    componentDidMount() { 
        this.getMounts();
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

    async getMounts() {
        const response = await fetch(backendUrl + "/api/battlenet/getMounts", {
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
            let result = {};
            data.mounts.forEach(it=>{
                result[it.mount.name] = {
                    "name": it.mount.name,
                    "url": undefined,
                    "href": it.mount.key.href
                }
            });

            this.setState({
                mounts: result,
                token: data.token
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    getImage(mount) {
        if(this.state.mounts[mount].url !== undefined) {
            return;
        }

        fetch(this.state.mounts[mount].href.split("?")[0] + "?namespace=static-eu&access_token=" + this.state.token)
        .then((res)=>res.json())
        .then((res)=>{
            fetch(res._links.self.href + "&access_token=" + this.state.token,  {
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
            .then((resImage)=>resImage.json())
            .then((resImage)=>{
                fetch(resImage.creature_displays[0].key.href + "&access_token=" + this.state.token,  {
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
                .then((finalImage)=>finalImage.json())
                .then((finalImage)=>{
                    this.state.mounts[mount].url = finalImage.assets[0].value;
                    this.setState({
                    });
                })
                .catch((err)=>{
                    console.error(err);
                })
                
            })
            .catch((err)=>{
                console.error(err);
            });


            
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    selectMount(mount) {
        this.getImage(mount);
        this.setState({
            selectedImage: mount
        });
    }

    render() { 
        return <div className="d-flex flex-wrap widget" style={{
            width: this.state.width,
            height: 300,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            overflow: "hidden",
            padding: 0,
            border: "1px var(--line-color) solid",
            borderRadius: "0.25em"
        }}>
            
            <div className="w-30" style={{
                overflow: "auto",
                height: "100%",
                borderRight: "1px var(--line-color) solid",
            }}>
                <List sx={{
                    padding: 0
                }}>
                    {
                        Object.keys(this.state.mounts).map((it, i) => 
                        <Fragment>
                            <ListItem key={i} disablePadding>
                                <ListItemButton onClick={()=>this.selectMount(it)}>
                                <ListItemText>{it}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li"></Divider>
                        </Fragment>
                        )
                    }
                    
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#simple-list">
                            
                        <ListItemText></ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
            <div className="w-70" style={{
                height: "100%",
                width: "70%"

            }}>
                {
                    this.state.selectedImage !== undefined ? 
                        <a href={this.state.mounts[this.state.selectedImage]?.url} style={{
                            width: "100%",
                            height: "100%",
                            display: "inline-block"
                        }}><img 
                            src={this.state.mounts[this.state.selectedImage]?.url} 
                            alt="No image for this mount" 
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "fill"
                            }}/>
                            </a>
                        :null
                }
                
            </div>
        </div>;
    }
}
 
export default MountsWidget;