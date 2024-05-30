public without sharing class RepairUserController {
    public class CustomException extends Exception {}

    @AuraEnabled
    public static RepairUserWrapper createUserRecord(String login, String password) {
        List<Repair_User__c> user = [SELECT Id, Name, Password__c FROM Repair_User__c WHERE Name =: login];
        if (user.size() == 0) {
            Blob digest = Crypto.generateDigest('SHA-256', Blob.valueOf(password));
            String encryptedPassword = EncodingUtil.base64Encode(digest);
            Repair_User__c newUser = new Repair_User__c();
            newUser.Name = login;
            newUser.Password__c = encryptedPassword;
            insert newUser;

            Map<String, String> userMap = new Map<String, String>{'id' => newUser.Id, 'name' => newUser.Name};
            String token = JWT.createToken(JSON.serialize(userMap));
            return new RepairUserWrapper(newUser, token);
        } else {
            throw new CustomException('User with such a login is already registered');
        }
    }

    @AuraEnabled
    public static RepairUserWrapper loginUser(String login, String password) {
        List<Repair_User__c> user = [SELECT Id, Name, Password__c, Administrator__c FROM Repair_User__c WHERE Name =: login];
        if (user.size() > 0) {
            Blob digest = Crypto.generateDigest('SHA-256', Blob.valueOf(password));
            String encryptedPassword = EncodingUtil.base64Encode(digest);

            if (encryptedPassword == user[0].Password__c) {
                Map<String, String> userMap = new Map<String, String>{'id' => user[0].Id, 'name' => user[0].Name};
                String token = JWT.createToken(JSON.serialize(userMap));
                return new RepairUserWrapper(user[0], token);
            } else {
                throw new CustomException('The password is wrong');
            }
        } else {
            throw new CustomException('User with this login is not found');
        }
    }

    @AuraEnabled
    public static Repair_User__c getUserById(String userId) {
        return [SELECT Id, Name FROM Repair_User__c WHERE Id =: userId];
    }

    public class RepairUserWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String name {get; set;}
        @AuraEnabled public String token {get; set;}
        @AuraEnabled public Boolean administrator {get; set;}

        public RepairUserWrapper (Repair_User__c repairUser, String userToken) {
            Id = repairUser.Id;
            name = repairUser.Name;
            administrator = repairUser.Administrator__c;
            token = userToken;
        }
    }
}