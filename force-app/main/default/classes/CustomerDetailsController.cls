public without sharing class CustomerDetailsController {
    @AuraEnabled
    public static CustomerDetailsWrapper getCustomerDetail(String repairUserId) {
        List<Customer_Detail__c> customerDetailList = [SELECT Id, 
        First_Name__c, 
        Last_Name__c, 
        City__r.Name, 
        Address__c, 
        Phone__c, 
        Email__c 
        FROM Customer_Detail__c 
        WHERE Repair_User__c = :repairUserId
        ORDER BY CreatedDate DESC
        LIMIT 1];
        if (customerDetailList.size() > 0) {
            return new CustomerDetailsWrapper(customerDetailList[0]);
        } else {
            return new CustomerDetailsWrapper();
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Customer_Detail__c> getAllCustomersDetail() {
        List<Customer_Detail__c> customerDetailList = [ SELECT Id,
            First_Name__c, 
            Last_Name__c, 
            City__r.Name,
            City__c, 
            Address__c, 
            Phone__c, 
            Email__c 
            FROM Customer_Detail__c 
            WHERE Active__c = true
            ORDER BY CreatedDate DESC
        ];
        List<CustomerDetailsWrapper> newCustomerDetailsWrapper = new List<CustomerDetailsWrapper>();
        for (Customer_Detail__c customerDetail : customerDetailList) {
            newCustomerDetailsWrapper.add(new CustomerDetailsWrapper(customerDetail));
        }
        return customerDetailList;
    }

    @AuraEnabled
    public static List<City__c> getCities() {
        return [SELECT Id, Name FROM City__c];
    }

    @AuraEnabled
    public static void createCustomerDetail(String customerDetailsJSON, String repairUserId) {
        List<Customer_Detail__c> oldCustomerDetailList = [SELECT Id, Active__c FROM Customer_Detail__c WHERE Repair_User__c = :repairUserId];
        if (oldCustomerDetailList.size() > 0) {
            for (Customer_Detail__c oldCustomerDetail : oldCustomerDetailList) {
                oldCustomerDetail.Active__c = false;
            }
            update oldCustomerDetailList;
        }
        NewCustomerDetailWrapper customerDetail = (NewCustomerDetailWrapper)JSON.deserialize(customerDetailsJSON, NewCustomerDetailWrapper.class);
        Customer_Detail__c newCustomerDetail = new Customer_Detail__c();
        newCustomerDetail.First_Name__c = customerDetail.firstName;
        newCustomerDetail.Last_Name__c = customerDetail.lastName;
        newCustomerDetail.City__c = customerDetail.city;
        newCustomerDetail.Address__Street__s = customerDetail.address;
        newCustomerDetail.Phone__c = customerDetail.phone;
        newCustomerDetail.Email__c = customerDetail.email;
        newCustomerDetail.Repair_User__c = customerDetail.repairUser;
        newCustomerDetail.Active__c = true;
        insert newCustomerDetail;
    }

    @AuraEnabled
    public static void updateCustomerDetail(Object data) {
        List<Customer_Detail__c> listOfCustomerDetail = (List<Customer_Detail__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Customer_Detail__c>.class
        );
        update listOfCustomerDetail;
    }

    public class CustomerDetailsWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String firstName {get; set;}
        @AuraEnabled public String lastName {get; set;}
        @AuraEnabled public String cityName {get; set;}
        @AuraEnabled public String city {get; set;}
        @AuraEnabled public System.Address address {get; set;}
        @AuraEnabled public String phone {get; set;}
        @AuraEnabled public String email {get; set;}

        public CustomerDetailsWrapper (Customer_Detail__c customerDetail) {
            Id = customerDetail.Id;
            firstName = customerDetail.First_Name__c;
            lastName = customerDetail.Last_Name__c;
            cityName = customerDetail.City__r.Name;
            city = customerDetail.City__c;
            address = customerDetail.Address__c;
            phone = customerDetail.Phone__c;
            email = customerDetail.Email__c;
        }

        public CustomerDetailsWrapper () {
            firstName = null;
            lastName = null;
            cityName = null;
            city = null;
            address = null;
            phone = null;
            email = null;
        }
    }

    public class NewCustomerDetailWrapper {

        public String address;
        public String city;
        public String firstName;
        public String lastName;
        public String phone;
        public String email;
        public String repairUser;
    }
}