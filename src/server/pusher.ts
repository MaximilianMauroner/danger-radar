import Pusher from "pusher";
import { env } from "../env/server.mjs";
import PushNotifications from "@pusher/push-notifications-server";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
});

const beamsClient = new PushNotifications({
  instanceId: env.NEXT_PUBLIC_PUSHER_BEAMS_CLIENT_KEY,
  secretKey: env.PUSHER_BEAMS_KEY,
});
// pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
// });
export default { pusher };
export { beamsClient, pusher };
