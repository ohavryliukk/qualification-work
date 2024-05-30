public without sharing class JWT {
    public static String createToken(String payload) {
        final String header = '{"alg": "HS256","typ":"JWT"}';
    	Blob key = Blob.valueof(Keys.JWTkey);
    	String jwt = base64URLencode(Blob.valueof(header)) + '.' +base64URLencode(blob.valueof(payload));
    	Blob signature = Crypto.generateMac('hmacSHA256', Blob.valueof(jwt), key);
        System.debug(signature);
        String token = jwt + '.' + base64URLencode(signature) ;
        System.debug(token);
        return token;
    } 
    public static Map<String, String> getPayload(String input){
        String[] pieces = input.split('\\.');
		String b64payload = pieces[1];
		String payload = encodingUtil.base64Decode(b64payload).toString();
        Map<String, String> payloadMap = (Map<String,String>) JSON.deserialize(payload, Map<String,String>.class);
        return payloadMap;
	}
       
    private static String base64URLencode(Blob input){ 
            String output = encodingUtil.base64Encode(input);
            output = output.replace('+', '-');
            output = output.replace('/', '_');
            while ( output.endsWith('=')){
                output = output.subString(0,output.length()-1);
            }
            return output;
   }
}