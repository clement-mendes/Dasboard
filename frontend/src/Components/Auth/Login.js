import { User } from "./User.js";
import { backendUrl } from "../../scripts/backendUrl.js";

export async function login(data) {
    if(!data.email) {
        return false;
    }

    const response = await fetch(backendUrl + "/api/Auth/Login", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const parsed = await response.json();

    if(parsed["success"]) {
        const userInfos = parsed["success"];

        const user = new User(userInfos["email"], userInfos["first_name"], userInfos["last_name"]);
        
        return user;
    } else {
        return false;
    }
}