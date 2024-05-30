import { LightningElement, api, track, wire } from 'lwc';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import getAllRepairRequests from '@salesforce/apex/AdminFacade.getAllRepairRequests';
import STAGES from '@salesforce/schema/Repair_Request__c.Stage__c';
import repairRequestManagementModal from 'c/repairRequestManagementModal';
import getRepairRequestById from '@salesforce/apex/AdminFacade.getRepairRequestById';
import updateRepairStage from '@salesforce/apex/RepairRequestController.updateRepairStage';

export default class RepairRequestManagementCarousel extends LightningElement {
    @track slideIndex = 0;
    stages;
    selectedStage;
    @track records = [];
    isEditMode;

    connectedCallback() {
        getAllRepairRequests()
        .then(result => {
            this.records = result;
            this.records.forEach(record => {
                record.address = record.address.street;
                let date = new Date(record.scheduledVisit);
                date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
                record.scheduledVisit = date.toISOString();
            })
        })
        .catch(error => {

        });
    }

    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: STAGES }) 
    preferredDaysPicklistResults({ error, data }) {
        if (data) {
            this.stages = data.values.map(opt => {return {"label": opt.label, "value": opt.value}});
        }
    }   

    get slideTransformStyle() {
        return `transform: translateX(-${this.slideIndex * 100}%);`;
    }

    prevSlide() {
        if (this.slideIndex > 0) {
            this.slideIndex -= 1;
            this.selectedStage = null;
        }
    }

    nextSlide() {
        let totalSlides = this.template.querySelectorAll('.slide').length;
        if (this.slideIndex < totalSlides - 1) {
            this.slideIndex += 1;
            this.selectedStage = null;
        }
    }

    handleStageSelect(event) {
        this.selectedStage = event.target.value;
    }

    handleChangeStage(event) {
        console.log(this.selectedStage);
        if (this.selectedStage) {
            updateRepairStage({repairStage: this.selectedStage, repairRequestId: event.target.dataset.recordId})
            .then(result => {
                getAllRepairRequests()
                .then(result => {
                    this.records = result;
                    this.records.forEach(record => {
                        record.address = record.address.street;
                        let date = new Date(record.scheduledVisit);
                        date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
                        record.scheduledVisit = date.toISOString();
                    })
                })
                .catch(error => {
        
                });
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    async toggleEditMode(event) {
        const repairRequest = await getRepairRequestById({ repairUserId: event.target.dataset.recordId});
        const result = await repairRequestManagementModal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            repairRequest: repairRequest,
        });
        getAllRepairRequests()
        .then(result => {
            this.records = result;
            this.records.forEach(record => {
                record.address = record.address.street;
                let date = new Date(record.scheduledVisit);
                date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
                record.scheduledVisit = date.toISOString();
            })
        })
        .catch(error => {

        });
    }
}