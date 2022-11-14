import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, Typography } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Component, Fragment } from "react";
import { backendUrl } from "../../scripts/backendUrl";

class WowCharacters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: [],
            accounts: [],
            selectedAccount: undefined,
            width: undefined,
            height: undefined,
            accessToken: undefined,
            currentCharacter: undefined
        };
    }

    componentDidMount() { 
        let mySize = this.props.getMySize();
        this.setState({
            width: mySize.width,
            height: mySize.height
        });
        this.getCharacters();
        
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

    async getCharacters() {
        const response = await fetch(backendUrl+"/api/battlenet/getCharacters", {
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
                accounts: data.wow_accounts,
                accessToken: data.accessToken
            });

            

            this.props.setData({
                accounts: data.wow_accounts,
                setAccount: (account)=>this.setAccount(account)
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    setAccount(account) {
        this.setState({
            selectedAccount: account
        }, ()=>{
            let newCharacters = [];
            let counter = 0;
            let max = this.state.accounts[this.state.selectedAccount].characters.length;
            this.state.accounts[this.state.selectedAccount].characters.forEach(async (it, i)=>{
                
                const characInfos = await this.getCharactersInfo(i);
                if(characInfos.assets === undefined) {
                    max--;
                    return;
                }
                it.imgMain = characInfos?.assets[3]?.value;
                it.avatar = characInfos?.assets[1]?.value;
                newCharacters.push(it);
                counter++;
                if(counter === max) {
                    this.setState({

                        characters: newCharacters,
                    });
                }
                
            });
            
        });
        
        
    }

    async getCharactersInfo(character) {
        let charName = this.state.accounts[this.state.selectedAccount].characters[character].name;
        let charRealm = this.state.accounts[this.state.selectedAccount].characters[character].realm.name;

        const response = await fetch("https://eu.api.blizzard.com/profile/wow/character/"+charRealm.toLowerCase()+"/"+charName.toLowerCase()+"/character-media?namespace=profile-eu&access_token="+this.state.accessToken, {
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
        return await response.json();
        //https://eu.api.blizzard.com/profile/wow/character/archimonde/acidly/character-media?namespace=profile-eu
    }

    setCharacter(i) {
        this.setState({
            currentCharacter: i
        });
    }

    clearCharacter() {
        this.setState({
            currentCharacter: undefined
        });
    }

    render() { 
        return <div className="widget mw-50">
            {
                this.state.currentCharacter !== undefined ? 
                    <div className="widget" style={{
                        border: "1px black solid",
                        borderRadius: "0.25em",
                        width: "100%",
                        height: "400px"
                    }}>
                        <div className="d-flex align-items-center" style={{ 
                                position: "absolute",
                                cursor: "pointer",
                                fontSize: "26px",
                                color: "#EEE !important"
                            }} onClick={()=>this.clearCharacter()} >
                            <ExitToAppIcon color="secondary" sx={{
                                width: 20,
                                height: 20,
                            }} />
                            <strong>Précédent</strong>
                        </div>
                        <img src={this.state.characters[this.state.currentCharacter].imgMain} width="100%" height="100%" alt="" style={{objectFit: "cover"}} />
                        
                    </div>
                    :
                    <TableContainer component={Paper} sx={{
                        height: "100%"
                    }}>
                        <Table aria-label="auction-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Race</TableCell>
                                    <TableCell>Classe</TableCell>
                                    <TableCell>Seveur</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            
                            {
                                this.state.characters.length ? this.state.characters.map((it, i)=>
                                    <TableRow key={i} onClick={()=>this.setCharacter(i)} sx={{cursor: "pointer"}}>
                                        <TableCell>
                                            {it.avatar !== undefined ? 
                                                <img src={it.avatar} alt="" width="30" height="30" />
                                                :
                                                null
                            }
                                        </TableCell>
                                        <TableCell>{it.name}</TableCell>
                                        <TableCell>{it.level}</TableCell>
                                        <TableCell>{it.playable_class?.name}</TableCell>
                                        <TableCell>{it.playable_race?.name}</TableCell>
                                        <TableCell>{it.realm?.name}</TableCell>
                                    </TableRow>
                                ) : <TableCell colSpan={5}>
                                        <Typography variant="body2" sx={{color:"var(--text-danger)", margin: "2em"}}>Séléctionnez un compte</Typography>
                                    </TableCell>
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            
            
        </div>;
    }
}
 
export default WowCharacters;