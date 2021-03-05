# Firebase Functionalities for the IBC Wallet app


## Getting Started
__________________
1. Run `npm i` from the root project folder
2. Have java installed (https://openjdk.java.net/install/)
3. Install Google Cloud SDK (https://cloud.google.com/sdk/docs/install)
   1. Login to the account linked to the ibc-wallet projects
   2. For testing, select the project 'ibc-wallet' (you can switch that later once you're ready to deploy to the production project by runing `firebase use byui-ibc-wallet`)
4. Running/Testing Functions: `npm start`

Deploy all changes: `firebase deploy`\
Deploy specific function(s): `firebase deploy --only "functions:functionNameHere"`\
Debug a deploy: `firebase --debug deploy`

### Note
To test Pub/Sub functions you will need to deploy them, and please do so to ibc-wallet (the dev one)


[comment]: <> (4. Install the pubsub-emulator with `gcloud components install pubsub-emulator` &#40;This is to run/test scheduled functions&#41;)
[comment]: <> (   1. Run `firebase emulators:start` for functions that do not use Pub/Sub)
[comment]: <> (      or)
[comment]: <> (   2. Run `gcloud beta emulators pubsub start --project=ibc-wallet` for IBC-Wallet-Dev or `byui-ibc-wallet` for IBC-Wallet-Prod)
[comment]: <> (      1. Then run `gcloud beta emulators pubsub env-init > set_vars.cmd && set_vars.cmd`)
[comment]: <> (      2. To stop running do `ctrl+c` or `cmd+c` then run `set PUBSUB_EMULATOR_HOST=`)
