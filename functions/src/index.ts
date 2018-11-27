import * as functions from 'firebase-functions';

const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.aggregate = functions.firestore
    .document('eventAttendees/{eventId}')
    .onWrite(async (change, context) => {
        const attendee = change.after.data();
        const eventId = context.params.eventId;

        console.log(attendee);
        console.log(eventId);

        const aggRef = db.doc(`events/${eventId}`);

        const aggDoc = await aggRef.get();
        const aggData = aggDoc.data();

        let count = aggData.attendeeCount;
        if (!count) {
            count = 0;
        }


        const next = {
            attendeeCount: count + 1
        }

        return aggRef.set(next, { merge: true });
    });


// FCM section
exports.subscribeToTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().subscribeToTopic(data.token, data.topic);
        return `Subscribed to ${data.topic}`;
    }
);

exports.unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
        return `Unsubscribed from ${data.topic}`;
    }
);

exports.sendOnFirestoreCreate = functions.firestore
    .document('events/{eventId}')
    .onCreate(async snapshot => {
        const event = snapshot.data();

        var message = {
            webpush: {
                notification: {
                    title: 'New Blood Donation Event',
                    body: event.title,
                    icon: 'https://<YOUR-APP-URL>/assets/icon/favicon.png',
                    click_action: 'https://<YOUR-APP-URL>/event'
                }
            },
            topic: 'donations'
        };

        return admin.messaging().send(message);
    });