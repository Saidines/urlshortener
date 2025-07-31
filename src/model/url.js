import mongoose from 'mongoose';
 const url_schema= new mongoose.Schema({
 	slug:{type:String,required:true,unique:true},
 	longurl:{type:String,required:true},
 	userid:{type:mongoose.Types.ObjectId,ref:'user',required:true},
 	createdAt:{type:Date,default: Date.now},
 	
 		  analytics: [
   	 {
  	    timestamp: { type: Date, default: Date.now,immutable:true },
    	    ip: String,
      	    userAgent: String,
      	    referrer: String,
      	    country: String,
      	    deviceType: String
    }
  ]}
 );
  
 const url=mongoose.model('url',url_schema);
 export default url;
