public without sharing class AdminFacade {
    @AuraEnabled
    public static Repair_User__c getUserById(String userId) {
        return RepairUserController.getUserById(userId);
    }

    @AuraEnabled
    public static Map<String, String> getPayload(String token){
        return HomeController.getPayload(token);
    }

    @AuraEnabled
    public static List<Object> getAllRepairRequests() {
        return RepairRequestController.getAllRepairRequests();
    }

    @AuraEnabled
    public static RepairRequestController.RepairRequestToUpdateWrapper updateRepairRequestRecord(String repairRequestJSON) {
        return RepairRequestController.updateRepairRequestById(repairRequestJSON);
    }

    @AuraEnabled
    public static RepairRequestController.RepairRequestToUpdateWrapper updateRepairRequestById(String repairRequestJSON) {
        return RepairRequestController.updateRepairRequestById(repairRequestJSON);
    }

    @AuraEnabled
    public static RepairRequestController.RepairRequestWrapper getRepairRequestById(String repairUserId) {
        return RepairRequestController.getRepairRequestById(repairUserId);
    }

    @AuraEnabled
    public static List<Customer_Detail__c> getAllCustomersDetail() {
        return CustomerDetailsController.getAllCustomersDetail();
    }

    @AuraEnabled
    public static void updateCustomerDetail(Object data) {
        CustomerDetailsController.updateCustomerDetail(data);
    }

    @AuraEnabled
    public static List<RepairmanController.RepairmanWrapper> getRepairmenByCity(String cityName){
        return RepairmanController.getRepairmenByCity(cityName);
    }
}
