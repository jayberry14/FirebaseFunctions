# Firebase Functionalities for the IBC Wallet app


## Getting Started
__________________
1. Run `npm i` from the root project folder
2. [Have java installed](https://openjdk.java.net/install/)
3. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
   1. Login to the account linked to the ibc-wallet projects
   2. For testing, select the project 'ibc-wallet' (you can switch that later once you're ready to deploy to the production project by runing `firebase use byui-ibc-wallet`)
4. To run the functions locally against mock data: [follow these instructions](https://jsmobiledev.com/article/firebase-emulator#copy-your-online-database-to-the-emulator) with the folder structure bellow in mind
   1. After that your project structure should have something like this:
   ```
   FirebaseFunctions/
   ├─ ...
   ├─ privateKeys/
   │  └─ ibc-wallet-firebase-adminsdk-xxxxxxxxxx.js (the generated key file from Firebase settigns)
   ├─ testDatabase/
   │  └─ mockDB.js (the imported DB from dev or prod)
   ├─ ...
   ```
5. Finally, for running/testing: `npm start`

Deploy all changes: `firebase deploy`\
Deploy specific function(s): `firebase deploy --only "functions:functionNameHere"`\
Debug a deploy: `firebase --debug deploy`

### Note
To test Pub/Sub Functions you will need to deploy them, and please do so to ibc-wallet (the dev one)
See [help and examples](https://cloud.google.com/appengine/docs/standard/python/config/cronref#schedule_format) for schedule format
