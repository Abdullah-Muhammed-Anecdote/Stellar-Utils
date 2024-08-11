

 module.exports.createNotification = async function  ({ admin,type,owner,url_ref,})  {

     const notificationData = {
         type: type,
         created_at: admin.firestore.FieldValue.serverTimestamp(),
         owner: owner,
         url_ref: url_ref,
         read_at: null,
     };

     await admin.firestore().collection('notification').add(notificationData);

}
