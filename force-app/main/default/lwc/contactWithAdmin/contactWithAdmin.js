import { LightningElement, api } from 'lwc';

export default class ContactWithAdmin extends LightningElement {
    @api userId;

    get inputFlowVariables() {
        return [
            {
                name: 'RepairUserId',
                type: 'String',
                value: this.userId
            }
        ];
    }
    
    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.dispatchEvent(new CustomEvent('toastmessage', {
                detail: {
                    type: 'success',
                    message: 'Your message was successfully sent to admin. We will contact with you later!'
                }
            }));
        }
    }
}