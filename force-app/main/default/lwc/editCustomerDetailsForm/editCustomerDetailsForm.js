import { LightningElement, api, track, wire } from 'lwc';
import getCustomerDetail from '@salesforce/apex/UserFacade.getCustomerDetail';
import getCities from '@salesforce/apex/UserFacade.getCities';
import createCustomerDetail from '@salesforce/apex/UserFacade.createCustomerDetail';

export default class EditCustomerDetailsForm extends LightningElement {
    @api userId;
    @track options;

    cityId;
    cityName;
    contactDetailObject;
    contactDetailObjectCopy;
    @track fields = [
        {
            fieldApiName: "firstName",
            label: "First Name",
            value: " "
        },
        {
            fieldApiName: "lastName",
            label: "Last Name",
            value: " "
        }, 
        {
            fieldApiName: "city",
            label: "City",
            value: " ",
            picklist: true
        },
        {
            fieldApiName: "address",
            label: "Address",
            value: " "
        },
        {
            fieldApiName: "phone",
            label: "Phone",
            value: " "
        },       
        {
            fieldApiName: "email",
            label: "Email",
            value: " "
        },
    ];
    isEditMode;

    connectedCallback() {
        this.getDetail();
    }

    getDetail() {
        getCustomerDetail({ repairUserId: this.userId })
        .then(result => {
            this.contactDetailObject = result;
            console.log(this.contactDetailObject);
            if(this.contactDetailObject.Id) {
                this.contactDetailObject.address = this.contactDetailObject.address.street;
            } 
            this.cityName = this.contactDetailObject.cityName;
            this.contactDetailObjectCopy = JSON.parse(JSON.stringify(this.contactDetailObject));

            this.fields.forEach(field => {
                let key = field.fieldApiName;
                field.value = this.contactDetailObject[key];
                if (key === 'city') {
                    field.value = this.cityName;
                }
            })
            this.getCitiOptions();
        })
        .catch(error => {
            console.error('Error loading fields:', error);
        });
    }

    getCitiOptions() {
        getCities()
        .then(data => {
            if (data) {
                const result = data;
                this.options = result.map(opt => {
                    if (opt.Name === this.cityName) {
                        this.cityId = opt.Id;
                    }
                    return {"label": opt.Name, "value": opt.Id}
                });
            }
        })
        .catch(error => {
            console.error('Error loading fields:', error);
        });
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    handleInputChange(event) {
        const apiName = event.target.dataset.api;
        const value = event.target.value;
        this.contactDetailObjectCopy[apiName] = value;
        console.log(JSON.stringify(this.contactDetailObjectCopy));
    }

    cancelChanges() {
        this.contactDetailObjectCopy = JSON.parse(JSON.stringify(this.contactDetailObject));
        this.isEditMode = false;
    }

    saveChanges() {
        this.contactDetailObjectCopy.repairUser = this.userId;
        createCustomerDetail({ customerDetailsJSON: JSON.stringify(this.contactDetailObjectCopy), repairUserId: this.userId })
            .then(result => {
                this.getDetail();
            })
            .catch(error => {

            });
        this.isEditMode = false;
    }
}
