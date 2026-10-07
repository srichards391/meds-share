/* Meds push settings shared by the app (index.html loads this) and the reminder
 * sender (scripts/send-push.mjs reads it). Only public values belong here.
 *
 * Push reminders are OFF while vapidPublicKey is empty. The app then hides the push setup
 * and offers calendar reminders instead. To turn push on for your own copy, see README.md,
 * "Push reminders (optional, own copy only)".
 *
 * vapidPublicKey: the public half of your push key pair. The private half lives only in
 *   the repo secret VAPID_PRIVATE_KEY. If you ever make a new pair, update both, then
 *   re-enable push on every device and update the PUSH_SUBSCRIPTION secret.
 * pushSubject: who is sending. Apple requires a mailto: or https: address, usually the
 *   web address of your copy, like 'https://your-name.github.io/meds-share/'.
 */
var MedsConfig = {
  vapidPublicKey: '',
  pushSubject: '',
};
if (typeof module === 'object' && module.exports) module.exports = MedsConfig;
