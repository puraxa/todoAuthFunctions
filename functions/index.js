const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.onUserRegister = functions.region('europe-west1').auth.user().onCreate(user => {
    if(user.email === 'edinpurivatra@gmail.com'){
        return admin.auth().setCustomUserClaims(user.uid,{admin:true});
    }
    return admin.auth().setCustomUserClaims(user.uid,{admin:false});
});
exports.getUsers = functions.region('europe-west1').https.onRequest((req,res)=> {
  cors(req,res, async() => {
      try {
        const body = JSON.parse(req.body);
        console.log(body);
        const checkAdmin = await admin.auth().getUser(body.uid);
        if(checkAdmin.customClaims.admin){
          const users = await admin.auth().listUsers();
          return res.send(users);
        }
        return res.status(401).send({message:'Not admin'});        
        // const users = await admin.auth().listUsers();
        // res.send(users);
      } catch (err) {
        console.log(err);
        res.status(401).send(err);
      }
  })
});
exports.setAdmin = functions.region('europe-west1').https.onRequest((req,res)=>{
  cors(req, res, async() => {
    try {
      const body = JSON.parse(req.body);
      const checkAdmin = await admin.auth().getUser(body.adminUid);
      if(checkAdmin.customClaims.admin){
        await admin.auth().setCustomUserClaims(body.uid,{admin:true});
        return res.send({message:'Succesfull'});
      }
      return res.status(401).send({message:'Not admin'});        
    } catch (err) {
      res.status(400).send(err);
    }
  })
});
exports.removeAdmin = functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req,res, async() => {
    try {
      const body = JSON.parse(req.body);
      const checkAdmin = await admin.auth().getUser(body.adminUid);
      if(checkAdmin.customClaims.admin){
        await admin.auth().setCustomUserClaims(body.uid,{admin:false});
        return res.send({message:'Succesfull'});
      }
      return res.status(401).send({message:'Not admin'});        
    } catch (err) {
      res.status(400).send(err);
    }
  })
})