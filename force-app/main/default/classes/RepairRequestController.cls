public without sharing class RepairRequestController {
    public class CustomException extends Exception {}

    @AuraEnabled
    public static Repair_Request__c createRepairRequestRecord(Repair_Request__c repairRequest, String repairUserId) {
        List<Customer_Detail__c> customerDetail = [SELECT Id FROM Customer_Detail__c WHERE Repair_User__c = :repairUserId ORDER BY CreatedDate DESC LIMIT 1];
        if (customerDetail.size() > 0) {
            repairRequest.Customer_Detail__c = customerDetail[0].Id;
            insert repairRequest;
            return repairRequest;
        } else {
            throw new CustomException('You have to fill your personal information first. Go to "My Details"');
        }
    }

    @AuraEnabled
    public static List<RepairRequestWrapper> getRepairRequests(String repairUserId) {
        List<Repair_Request__c> repairRequests = [
            SELECT Id, 
            Name, 
            Stage__c, 
            Type_of_Repair__c, 
            Description__c, 
            Preferred_Days__c, 
            Preferred_Part_of_Day__c,
            Scheduled_Visit__c,
            Repair_Duration__c,
            Repairman__c,
            Repairman__r.Full_Name__c,
            Sum__c,
            Customer_Detail__r.First_Name__c,
            Customer_Detail__r.Last_Name__c,
            Customer_Detail__r.City__r.Name,
            Customer_Detail__r.Address__c,
            Customer_Detail__r.Email__c,
            Customer_Detail__r.Phone__c
            FROM Repair_Request__c 
            WHERE Repair_User__c = :repairUserId
            ORDER BY CreatedDate DESC
        ];
        List<RepairRequestWrapper> newRepairRequestWrapper = new List<RepairRequestWrapper>();
        for (Repair_Request__c repairRequest : repairRequests) {
            newRepairRequestWrapper.add(new RepairRequestWrapper(repairRequest));
        }
        return newRepairRequestWrapper;
    }

    @AuraEnabled
    public static List<RepairRequestWrapper> getAllRepairRequests() {
        List<Repair_Request__c> repairRequests = [
            SELECT Id, 
            Name, 
            Stage__c, 
            Type_of_Repair__c, 
            Description__c, 
            Preferred_Days__c, 
            Preferred_Part_of_Day__c,
            Scheduled_Visit__c,
            Repair_Duration__c,
            Repairman__r.Full_Name__c,
            Sum__c,
            Customer_Detail__r.First_Name__c,
            Customer_Detail__r.Last_Name__c,
            Customer_Detail__r.City__r.Name,
            Customer_Detail__r.Address__c,
            Customer_Detail__r.Email__c,
            Customer_Detail__r.Phone__c
            FROM Repair_Request__c 
            ORDER BY CreatedDate DESC
        ];
        List<RepairRequestWrapper> newRepairRequestWrapper = new List<RepairRequestWrapper>();
        for (Repair_Request__c repairRequest : repairRequests) {
            newRepairRequestWrapper.add(new RepairRequestWrapper(repairRequest));
        }
        return newRepairRequestWrapper;
    }

    @AuraEnabled
    public static RepairRequestWrapper getRepairRequestById(String repairUserId) {
        Repair_Request__c repairRequest = [
            SELECT Id, 
            Name, 
            Stage__c, 
            Type_of_Repair__c, 
            Description__c, 
            Preferred_Days__c, 
            Preferred_Part_of_Day__c,
            Scheduled_Visit__c,
            Repair_Duration__c,
            Repairman__c,
            Repairman__r.Full_Name__c,
            Sum__c,
            Customer_Detail__r.First_Name__c,
            Customer_Detail__r.Last_Name__c,
            Customer_Detail__r.City__r.Name,
            Customer_Detail__r.Address__c,
            Customer_Detail__r.Email__c,
            Customer_Detail__r.Phone__c
            FROM Repair_Request__c 
            WHERE Id = :repairUserId
            LIMIT 1
        ];
        return new RepairRequestWrapper(repairRequest);
    }

    @AuraEnabled
    public static RepairRequestToUpdateWrapper updateRepairRequestById(String repairRequestJSON) {
        RepairRequestToUpdateWrapper repairRequestToUpdate = (RepairRequestToUpdateWrapper)JSON.deserialize(RepairRequestJSON, RepairRequestToUpdateWrapper.class);
        Repair_Request__c repairRequest = [
            SELECT Id, 
            Name, 
            Stage__c,
            Scheduled_Visit__c,
            Repair_Duration__c,
            Repairman__c,
            Sum__c
            FROM Repair_Request__c 
            WHERE Id = :repairRequestToUpdate.id
            LIMIT 1
        ];
        repairRequest.Scheduled_Visit__c = repairRequestToUpdate.scheduledVisit;
        repairRequest.Repair_Duration__c = repairRequestToUpdate.repairDuration.addHours(3);
        repairRequest.Repairman__c = repairRequestToUpdate.repairman;
        repairRequest.Sum__c = repairRequestToUpdate.sum;
        update repairRequest;
        return repairRequestToUpdate;
    }

    @AuraEnabled
    public static void updateRepairStage(String repairStage, String repairRequestId) {
        Repair_Request__c repairRequest = [SELECT Id, Stage__c FROM Repair_Request__c WHERE Id =: repairRequestId];
        repairRequest.Stage__c = repairStage;
        update repairRequest;
    }

    public class RepairRequestWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String name {get; set;}
        @AuraEnabled public String stage {get; set;}
        @AuraEnabled public String typeOfRepair {get; set;}
        @AuraEnabled public String description {get; set;}
        @AuraEnabled public String preferredDays {get; set;}
        @AuraEnabled public String preferredPartOfDay {get; set;}
        @AuraEnabled public Datetime scheduledVisit {get; set;}
        @AuraEnabled public String repairDuration {get; set;}
        @AuraEnabled public String repairman {get; set;}
        @AuraEnabled public String repairmanName {get; set;}
        @AuraEnabled public Decimal sum {get; set;}
        @AuraEnabled public String firstName {get; set;}
        @AuraEnabled public String lastName {get; set;}
        @AuraEnabled public String city {get; set;}
        @AuraEnabled public System.Address address {get; set;}
        @AuraEnabled public String email {get; set;}
        @AuraEnabled public String phone {get; set;}

        public RepairRequestWrapper (Repair_Request__c repairRequest) {
            Id = repairRequest.Id;
            name = repairRequest.Name;
            stage = repairRequest.Stage__c;
            typeOfRepair = repairRequest.Type_of_Repair__c;
            description = repairRequest.Description__c;
            preferredDays = repairRequest.Preferred_Days__c;
            preferredPartOfDay = repairRequest.Preferred_Part_of_Day__c;
            scheduledVisit = repairRequest.Scheduled_Visit__c;
            repairDuration = String.valueOf(repairRequest.Repair_Duration__c);
            repairman = repairRequest.Repairman__c;
            repairmanName = repairRequest.Repairman__r.Full_Name__c;
            sum = repairRequest.Sum__c;
            firstName = repairRequest.Customer_Detail__r.First_Name__c;
            lastName = repairRequest.Customer_Detail__r.Last_Name__c;
            city = repairRequest.Customer_Detail__r.City__r.Name;
            address = repairRequest.Customer_Detail__r.Address__c;
            email = repairRequest.Customer_Detail__r.Email__c;
            phone = repairRequest.Customer_Detail__r.Phone__c;
        }
    }

    public class RepairRequestToUpdateWrapper {
        public String id;
        public Datetime scheduledVisit;
        public Time repairDuration;
        public Decimal sum;
        public String repairman;
    }
}