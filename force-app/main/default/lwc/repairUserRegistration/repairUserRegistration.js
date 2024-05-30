import { LightningElement} from 'lwc';
import {NavigationMixin} from "lightning/navigation";
import createUserRecord from '@salesforce/apex/RepairUserController.createUserRecord';

export default class RepairUserRegistration extends NavigationMixin(LightningElement) {
    login;
    password;
    user;

    handleLoginChange(event) {
        this.login = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleRegistration() {
        createUserRecord({ login: this.login, password: this.password })
            .then(result => {
                this.user = result;
                this.login = '';
                this.password = '';
                this.template.querySelector('c-custom-toast').showToast('success', 'You are successfully registered');
                document.cookie = `${this.user.name}=${this.user.token}`;
                this.navigateToHomePage();
            })
            .catch(error => {
                console.error(error);
                this.template.querySelector('c-custom-toast').showToast('error', error.body.message);
            });
    }

    handleLogInBtn() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login'
            }
        });
    }

    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Repair_Home__c'
            },
            state: {
                id: this.user.Id
            }
        });
    }
}
