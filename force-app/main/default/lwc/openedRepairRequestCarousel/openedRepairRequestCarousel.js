import { LightningElement, api, track, wire } from 'lwc';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import getRepairRequests from '@salesforce/apex/UserFacade.getRepairRequests';
import STAGES from '@salesforce/schema/Repair_Request__c.Stage__c';


export default class OpenedRepairRequestCarousel extends LightningElement {
    @api userId;
    @track slideIndex = 0;
    stages;
    records = [];

    connectedCallback() {
        this.getRequests();
    }

    getRequests() {
        getRepairRequests({ repairUserId: this.userId})
        .then(result => {
            this.records = result;
            this.records.forEach(record => {
                record.address = record.address?.street;
            })
        })
        .catch(error => {
            console.error(error);
        });
    }

    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: STAGES }) 
    preferredDaysPicklistResults({ error, data }) {
        if (data) {
            this.stages = data.values.map(opt => {return {"label": opt.label, "value": opt.value}});
        }
        if (error) {
            console.error(error);
        }
    }
    
    @api
    refreshCarousel() {
        this.getRequests();
    }

    get slideTransformStyle() {
        return `transform: translateX(-${this.slideIndex * 100}%);`;
    }

    prevSlide() {
        if (this.slideIndex > 0) {
            this.slideIndex -= 1;
        }
    }

    nextSlide() {
        let totalSlides = this.template.querySelectorAll('.slide').length;
        if (this.slideIndex < totalSlides - 1) {
            this.slideIndex += 1;
        }
    }
}