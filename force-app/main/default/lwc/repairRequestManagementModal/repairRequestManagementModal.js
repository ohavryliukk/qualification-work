import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import getRepairmenByCity from '@salesforce/apex/AdminFacade.getRepairmenByCity';
import updateRepairRequestById from '@salesforce/apex/AdminFacade.updateRepairRequestById';

export default class MyModal extends LightningModal {
    @api repairRequest;
    options;
    sum;
    repairman;
    scheduledVisit;
    repairDuration;

    connectedCallback() {
        getRepairmenByCity({cityName: this.repairRequest.city})
        .then(data => {
            if (data) {
                const result = data;
                this.options = result.map(opt => {
                    return {"label": opt.firstName + opt.lastName, "value": opt.Id}
                });
            }
        })
        .catch(error => {
            console.error('Error loading fields:', error);
        });
    }

    handleRepairmanChange(event) {
        this.repairman = event.target.value;
    }

    handleVisitChange(event) {
        this.scheduledVisit = event.target.value;
    }

    handleDurationChange(event) {
        this.repairDuration = event.target.value;
    }

    handleSumChange(event) {
        this.sum = event.target.value;
    }

    handleSave() {
        const repairRequest = {
            id: this.repairRequest.Id,
            scheduledVisit: this.scheduledVisit || this.repairRequest.scheduledVisit,
            repairDuration: this.repairDuration || this.repairRequest.repairDuration,
            sum: this.sum || this.repairRequest.sum,
            repairman: this.repairman || this.repairRequest.repairman
        }

        updateRepairRequestById({repairRequestJSON: JSON.stringify(repairRequest)})
        .then(result => {
            this.close(result);
        })
        .catch(error => {

        });
    }
}