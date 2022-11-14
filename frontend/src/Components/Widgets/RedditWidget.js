import { Component } from "react";
import { Box, Card, Typography } from "@mui/material";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import "./reddit.css";
import { backendUrl } from "../../scripts/backendUrl";

class Reddit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bestThreads: [],
            width: 400,
            height: 360
        }
    }

    componentDidMount() { 
        
        this.getThreads();
    }


    async getThreads() {
        const response = await fetch(backendUrl + "/api/reddit/getThreads", {
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
                bestThreads: data.data.children
            });

        })
        .catch((err)=>{
            console.error(err);
        });
    }

    share(link) {
        navigator.clipboard.writeText(link);
        this.props.showNotif("Copied link to clipboard", "success");
    }

    render() { 
        return (
        <Card
            sx={{
            width: this.state.width,
            height: 300,
            maxHeight: "500px",
            backgroundColor: '#D3D3D3',
            display:"flex",
            flexFlow: "row wrap",
            gap:1,
            overflowY: "auto",
        }}>
            {this.state.bestThreads?.map((it, i)=>
                <Card  
                    key={i}     
                    sx={{
                        width: 400,
                        height: 60,
                        backgroundColor: "white",
                        textAlign:"center",
                        display:"flex",
                        flexDirection:"column"
                    }}>
                        <Box       
                            sx={{
                                width: 400,
                                height: 60,
                                minHeight: 60,
                                backgroundColor: "white",
                                textAlign:"center",
                                display:"flex",
                                flexDirection:"row",
                            }}>
                            <Box       
                                sx={{
                                    width: 80,
                                    height: 60,
                                }}>
                                    {
                                        it.data.thumbnail !== undefined && it.data.thumbnail !== null && it.data.thumbnail.startsWith("https://b.thumbs.redditmedia.com/") ?

                                        <img src={it.data.thumbnail} alt="Thumbnail" width="80"  height="60"/>
                                            :
                                            null
                                    }
                            </Box>   
                            <Box       
                                sx={{
                                    width: 320,
                                    height: 60,
                                    backgroundColor: "white",
                                    display:"flex",
                                    marginLeft:"5px",
                                    alignItems:"flex-start",
                                    flexDirection:"column",
                                    justifyContent:"center",
                                    gap:0.5,

                                    // fonction on click à rajouter qui redirige vers l'article oul qui l'aggrandit sur la largeur du widget
                                }}>
                                <a href={"https://www.reddit.com"+it.data.permalink}>
                                    <p className="title" title={it.data.title}>{it.data.title}</p>
                                </a>
                                <p className="posted" title={"Posted by" + it.data.author +" the " + new Date(it.data.created * 1000).toDateString() + " - " + it.data.subreddit}>Posted by {it.data.author} the {new Date(it.data.created * 1000).toDateString()} - <strong>{it.data.subreddit}</strong></p>
                                <div className="comment">
                                    <Typography variant="body2"><InsertCommentOutlinedIcon sx={{height:10}} />{it.data.num_comments} Comments</Typography>
                                    <Typography variant="body2" onClick={()=>this.share("https://www.reddit.com"+it.data.permalink)} sx={{cursor: "pointer"}}><IosShareOutlinedIcon sx={{height:10}} />Share</Typography>
                                </div>
                            </Box>  
                    </Box>   
                </Card> 
                )}
                 
        </Card>       
        )
    }
}
 
export default Reddit;