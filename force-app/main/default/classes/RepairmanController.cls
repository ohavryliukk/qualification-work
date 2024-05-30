public without sharing class RepairmanController {
    @AuraEnabled
    public static List<RepairmanWrapper> getRepairmenByCity(String cityName){
        List<Repairman__c> repairmen = [
            SELECT Id, 
            Name,
            City__r.Name, 
            Skills__c, 
            First_Name__c,
            Last_Name__c,
            Phone__c
            FROM Repairman__c 
            WHERE City__r.Name = :cityName
        ];
        List<RepairmanWrapper> newRepairmenList = new List<RepairmanWrapper>();
        for (Repairman__c repairman : repairmen) {
            newRepairmenList.add(new RepairmanWrapper(repairman));
        }
        return newRepairmenList;
    }

    public class RepairmanWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String name {get; set;}
        @AuraEnabled public String city {get; set;}
        @AuraEnabled public String skills {get; set;}
        @AuraEnabled public String firstName {get; set;}
        @AuraEnabled public String lastName {get; set;}
        @AuraEnabled public String phone {get; set;}

        public RepairmanWrapper (Repairman__c repairman) {
            Id = repairman.Id;
            name = repairman.Name;
            city = repairman.City__r.Name;
            skills = repairman.Skills__c;
            firstName = repairman.First_Name__c;
            lastName = repairman.Last_Name__c;
            phone = repairman.Phone__c;
        }
    }
}