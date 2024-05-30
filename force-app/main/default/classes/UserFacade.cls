public without sharing class UserFacade {
    @AuraEnabled
    public static Repair_User__c getUserById(String userId) {
        return RepairUserController.getUserById(userId);
    }

    @AuraEnabled
    public static Map<String, String> getPayload(String token){
        return HomeController.getPayload(token);
    }

    @AuraEnabled
    public static List<Object> getRepairRequests(String repairUserId) {
        return RepairRequestController.getRepairRequests(repairUserId);
    }

    @AuraEnabled
    public static Repair_Request__c createRepairRequestRecord(Repair_Request__c repairRequest, String repairUserId) {
        return RepairRequestController.createRepairRequestRecord(repairRequest, repairUserId);
    }

    @AuraEnabled
    public static CustomerDetailsController.CustomerDetailsWrapper getCustomerDetail(String repairUserId) {
        return CustomerDetailsController.getCustomerDetail(repairUserId);
    }

    @AuraEnabled
    public static List<City__c> getCities() {
        return CustomerDetailsController.getCities();
    }

    @AuraEnabled
    public static void createCustomerDetail(String customerDetailsJSON, String repairUserId) {
        CustomerDetailsController.createCustomerDetail(customerDetailsJSON, repairUserId);
    }
}
