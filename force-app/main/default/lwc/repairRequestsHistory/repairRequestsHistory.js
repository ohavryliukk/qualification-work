import { LightningElement, api } from 'lwc';
import getRepairRequests from '@salesforce/apex/UserFacade.getRepairRequests';

const columns = [
    { label: 'Repair Request Number', fieldName: 'name', wrapText: false },
    { label: 'Stage', fieldName: 'stage', wrapText: false},
    { label: 'Type of Repair', fieldName: 'typeOfRepair', wrapText: false},
    { label: 'Balance', fieldName: 'amount' },
    { label: 'Description', fieldName: 'description', wrapText: false},
    { label: 'Schedualed Visit', fieldName: 'scheduledVisit', wrapText: false},
    { label: 'Repairman', fieldName: 'repairmanName', wrapText: false},
    { label: 'Sum', fieldName: 'sum', type: 'currency', wrapText: false},
    { label: 'City', fieldName: 'city', wrapText: false},
    { label: 'Address', fieldName: 'address', wrapText: false},
    { label: 'Email', fieldName: 'email', wrapText: false},
    { label: 'Phone', fieldName: 'phone', wrapText: false}
];

export default class RepairRequestsHistory extends LightningElement {
    @api userId;
    data = [];
    columns = columns;
    rowOffset = 0;

    connectedCallback() {
        this.getRequests();
    }

    getRequests() {
        getRepairRequests({ repairUserId: this.userId})
        .then(result => {
            this.data = result;
            this.data.forEach(record => {
                record.address = record.address?.street;
            })
        })
        .catch(error => {

        });
    }

    @api
    refreshTable() {
        this.getRequests();
    }
}