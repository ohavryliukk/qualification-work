import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import TYPE_OF_REPAIR from '@salesforce/schema/Repair_Request__c.Type_of_Repair__c';
import PREFERRED_DAYS from '@salesforce/schema/Repair_Request__c.Preferred_Days__c';
import PREFERRED_TIME from '@salesforce/schema/Repair_Request__c.Preferred_Part_of_Day__c';
import createRepairRequestRecord from '@salesforce/apex/UserFacade.createRepairRequestRecord';

export default class CreateRepairRequestForm extends LightningElement {
    @track preferredDaysOptions = [];
    @track typeOfRepairOptions;
    @track preferredTimeOptions;
    @api userId;
    typeOfRepair;
    preferredTime;
    description;

    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: PREFERRED_DAYS }) 
    preferredDaysPicklistResults({ error, data }) {
        if (data) {
            this.preferredDaysOptions = data.values.map(opt => {return {"label": opt.label, "value": opt.value}});
            //console.log(this.template.querySelector('[role="cm-picklist"]'));
            //this.template.querySelector('[role="cm-picklist"]').setOptions(this.preferredDaysOptions);
        }
    }   

    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: PREFERRED_TIME }) 
    preferredTimePicklistResults({ error, data }) {
        if (data) {
            this.preferredTimeOptions = data.values.map(opt => {return {"label": opt.label, "value": opt.value}});
        }
    }
    
    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: TYPE_OF_REPAIR }) 
    typeOfRepairPicklistResults({ error, data }) {
        if (data) {
            this.typeOfRepairOptions = data.values.map(opt => {return {"label": opt.label, "value": opt.value}});
        }
    }   

    renderedCallback() {
        this.template.querySelector('[role="cm-picklist"]').setOptions(this.preferredDaysOptions);
    }

    handleDescriptionChange(event) {
        this.description = event.detail.value;
    }

    handleTypeOfRepairChange(event) {
        this.typeOfRepair = event.detail.value;
    }

    handlePreferredTimeChange(event) {
        this.preferredTime = event.detail.value;
    }

    handleSubmit() {
        const repairRequest = {
            Repair_User__c: this.userId,
            Type_of_Repair__c: this.typeOfRepair,
            Description__c: this.description,
            Preferred_Days__c: this.template.querySelector('[role="cm-picklist"]').getSelectedList(),
            Preferred_Part_of_Day__c: this.preferredTime
        };

        console.log(repairRequest);

        createRepairRequestRecord({ repairRequest: repairRequest, repairUserId: this.userId })
        .then( result => {
            this.description = ''
            this.typeOfRepair = null;
            this.preferredTime = null;
            this.template.querySelector('[role="cm-picklist"]').resetSelections();
            this.dispatchEvent(new CustomEvent('toastmessage', {
                detail: {
                    type: 'success',
                    message: `Request has been successfully sent`
                }
            }));
            this.dispatchEvent(new CustomEvent('refresh'));
        })
        .catch((error) => {
            this.dispatchEvent(new CustomEvent('toastmessage', {
                detail: {
                    type: 'error',
                    message: error.body.message || "Check if all fields are filled"
                }
            }));
        });
    }
}