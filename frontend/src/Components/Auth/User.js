import { getCookie, setCookie } from "../../scripts/cookies";
import { backendUrl } from "../../scripts/backendUrl";
import { TrendingUp } from "@mui/icons-material";

export class User {
    constructor(email = null, firstName = null, lastName = null) {

        this.mapped = {
            "email": 0,
            "firstName": 1,
            "lastName": 2
        };
        this.email = email ?? this.getCookieElement("email") ?? "";
        this.firstName = firstName ?? this.getCookieElement("firstName") ?? "";
        this.lastName = lastName ?? this.getCookieElement("lastName") ?? "";
        this.callbackLogout = null;
        this.cookieTimeout = 30;
    }

    getCookieElement(index) {
        return getCookie("user").split("::")[this.mapped[index]];
    }

    stringify() {
        return JSON.stringify({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
        });
    }

    async isLoggedIn(){
        if(!this.email || !this.firstName || !this.lastName) {
            return false;
        }

        const response = await fetch(backendUrl+"/api/Auth/isLoggedIn", {
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
        const json = await response.json();
        if(json === false) {
            this.logout();
            return false;
        }

        return json;
    }

    logout() {
        this.email = "";
        this.firstName = "";
        this.lastName = "";
        setCookie("user", "", -1);

        if(this.callbackLogout !== null)
            this.callbackLogout();
    }

    save() {
        setCookie("user", this.email + "::" + this.firstName + "::" + this.lastName, this.cookieTimeout);
    }

}