public without sharing class HomeController {
    @AuraEnabled
    public static Map<String, String> getPayload(String token){
        return JWT.getPayload(token);
    }
}