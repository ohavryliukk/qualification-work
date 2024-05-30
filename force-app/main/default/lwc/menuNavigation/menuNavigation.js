import { LightningElement, api } from 'lwc';
import {NavigationMixin} from "lightning/navigation";

export default class MenuNavigation extends NavigationMixin(LightningElement) {
    @api user;
    @api menuItems = [];
    @api fromExternalSite;

    handleMenuItemClick(event) {
        const menuItemId = event.currentTarget.dataset.menuItemId;
        const menuItemUrl = event.currentTarget.dataset.menuItemUrl;
        if (menuItemId) {
            this.navigateToPage(menuItemId);
        } else {
            this.navigateToPageUrl(menuItemUrl);
        }
    }

    handleLogOutClick() {
        this.deleteCookie(this.user.Name);
        if (!this.fromExternalSite) {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Login'
                }
            });
        } else {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://repaircompany-dev-ed.develop.my.site.com/login'
                }
            }).then(url => {
                window.open(url, "_self");
                window.close('https://repaircompany-dev-ed.develop.my.site.com/login');
            });
        }
    }

    navigateToPage(pageApiName) {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApiName
            },
            state: {
                id: this.user.Id
            }
        });
    }

    navigateToPageUrl(curl) {
        window.open(curl + "?id=" + this.user.Id, "_self");
    }

    deleteCookie(cookieName) {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        var expires = ";expires=" + date;
        var value = "";
        document.cookie = cookieName + "=" + value + expires + "; path=/";
    }
}