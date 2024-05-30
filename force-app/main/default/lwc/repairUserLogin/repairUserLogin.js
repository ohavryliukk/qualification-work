import { LightningElement} from 'lwc';
import {NavigationMixin} from "lightning/navigation";
import loginUser from '@salesforce/apex/RepairUserController.loginUser';

export default class UserLogin extends NavigationMixin(LightningElement) {
    login;
    password;
    user

    handleLoginChange(event) {
        this.login = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        if (!this.login || !this.password) {
            this.template.querySelector('c-custom-toast').showToast('error', 'Please enter login and password');
            return;
        }
        console.log(this.login);
        loginUser({ login: this.login, password: this.password })
            .then(result => {
                this.user = result;
                this.template.querySelector('c-custom-toast').showToast('success', 'You are successfuly loged in');
                this.login = '';
                this.password = '';

                document.cookie = `${this.user.name}=${this.user.token}`;

                if (this.user.administrator) {
                  this.navigateToAdminPage();
                } else this.navigateToHomePage();
            })
            .catch(error => {
                console.error('login error: ', error);
                this.template.querySelector('c-custom-toast').showToast('error', error.body.message);
            });
    }

    handleRegisterBtn(event) {
      event.preventDefault();
      this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Register'
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

    navigateToAdminPage() {
      this[NavigationMixin.Navigate]({
          type: 'comm__namedPage',
          attributes: {
              name: 'Repair_Admin__c'
          },
          state: {
              id: this.user.Id
          }
      });
    }
}
