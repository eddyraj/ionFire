# ionFire
IonFireApp is Example application to get started with Ionic and Firebase.
The app was built to be a progressive web app (PWA) but it can also be built as a hybrid app for iOS or Android.

This is a cloned app I used for https://blooddonorsbank.org based on the tutorials by Jeff Delaney at https://angularfirebase.com/

Prerequistes:
Node 10, NPM 6.4.1, ionic-cli 4.1.2, firebase-tools 6.1.0


-- HOW TO --
1. Run npm install in app directory
2. Create project in Firebase https://console.firebase.google.com - Enable Authentication (Email/password), Firestore database, Hosting, Functions
3. Use credentials in environment.ts or environment.prod.ts and firebase-messaging-sw.js
4. Run ionic serve to run locally.

Notifications (messaging) requires functions to be deployed to firebase
1. Run ionic build --prod
2. Run firebase deploy



