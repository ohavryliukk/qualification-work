import { LightningElement } from 'lwc';
import {NavigationMixin} from "lightning/navigation";
import getUser from '@salesforce/apex/RepairUserController.getUserById';
import getPayload from '@salesforce/apex/HomeController.getPayload';

export default class MenuNavigationAdmin extends NavigationMixin(LightningElement) {
    parameters;
    token;
    payload;
    user;
    showSpinner = true;
    showHomeComponent = false;

    menuItems = [
        { url: 'https://repaircompany-dev-ed.develop.my.site.com/repair-admin', label: 'Home'},
        { url: 'https://repaircompany-dev-ed.develop.my.site.com/repairservice/s/dashboards', label: 'Dashboards'},
        { url: 'https://repaircompany-dev-ed.develop.my.site.com/repairservice/s/case', label: 'Cases'}
    ];

    connectedCallback() {
        this.parameters = this.getQueryParameters();
        console.log(JSON.stringify(this.parameters));
        let id = this.parameters['id'];
        if (id) {
            getUser({ userId: id })
            .then(result => {
                this.user = result;
                this.token = this.getCookie(this.user.Name);
                if (this.token) {
                    getPayload({token: this.token})
                    .then(result => {
                        this.payload = result;
                    })
                    .catch(error => {
                        this.showSpinner = false;
                        console.error('Error in getPayload', error);
                        this.template.querySelector('c-custom-toast').showToast('error', error.body.message);
                    });
                }
                this.showSpinner = false;
                this.showHomeComponent = true;
            })
            .catch(error => {
                this.showSpinner = false;
                console.error('Error in getUser', error);
                this.template.querySelector('c-custom-toast').showToast('error', error.body.message);
            });
        } else {
            this.showSpinner = false;
            this.showHomeComponent = false;
        }
    }

    handleLogInBtn() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login'
            }
        });
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    getQueryParameters() {
        let params = {};
        let search = location.search.substring(1);

        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === '' ? value : decodeURIComponent(value)
            });
        } else {
            console.log(document.referrer);
            let previousUrl = new URL(document.referrer);
            params["id"] = previousUrl.searchParams.get("id");
        }
        return params;
    }
}