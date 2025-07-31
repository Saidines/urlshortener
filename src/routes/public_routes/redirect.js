import express from 'express';
import url from '../../model/url.js';

const router=express.Router();

	 router.get('/favicon.ico', (req, res) => res.status(204).end());

	router.get('/:slug',async (req,res)=>{
	const slug=req.params.slug;
	//console.log(slug);
	const lurl=await url.findOne({slug});
	//console.log(lurl);
	try{
		//const lurl=await url.findOne({slug});
		if(!lurl) return res.status(400).send("no such short url");
		let longUrl=lurl.longurl;
		lurl.analytics.push({
				ip:req.ip,
				userAgent:req.headers['user-agent'],
				referer: req.headers['referer'],
				deviceType: req.useragent
					});
					lurl.save();
		console.log(lurl.analytics);
		 if (!/^https?:\/\//i.test(longUrl)) {
      longUrl = "http://" + longUrl; // fallback
    }
   	console.log(lUrl);
		res.redirect(302,longUrl);}
		
		catch(error){
		console.log("fialed redirect");
			res.status(500).send(error);
			
		}});
		
export default router;	
