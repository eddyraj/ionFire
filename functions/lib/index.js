"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
exports.aggregate = functions.firestore
    .document('eventAttendees/{eventId}')
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    const attendee = change.after.data();
    const eventId = context.params.eventId;
    console.log(attendee);
    console.log(eventId);
    const aggRef = db.doc(`events/${eventId}`);
    const aggDoc = yield aggRef.get();
    const aggData = aggDoc.data();
    let count = aggData.attendeeCount;
    if (!count) {
        count = 0;
    }
    const next = {
        attendeeCount: count + 1
    };
    return aggRef.set(next, { merge: true });
}));
// FCM section
exports.subscribeToTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().subscribeToTopic(data.token, data.topic);
    return `Subscribed to ${data.topic}`;
}));
exports.unsubscribeFromTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().unsubscribeFromTopic(data.token, data.topic);
    return `Unsubscribed from ${data.topic}`;
}));
exports.sendOnFirestoreCreate = functions.firestore
    .document('events/{eventId}')
    .onCreate((snapshot) => __awaiter(this, void 0, void 0, function* () {
    const event = snapshot.data();
    var message = {
        webpush: {
            notification: {
                title: 'New Blood Donation Event',
                body: event.title,
                icon: 'https://blooddonorsbank.org/assets/icon/favicon.png',
                click_action: 'https://blooddonorsbank.org/event'
            }
        },
        topic: 'donations'
    };
    return admin.messaging().send(message);
}));
//# sourceMappingURL=index.js.map