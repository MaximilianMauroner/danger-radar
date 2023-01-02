import {useSession} from "next-auth/react";
import React, {useMemo, useState} from "react";
import Pusher from "pusher-js";
import {env} from "../../env/client.mjs";
import LoadingComponent from "../loading_component";
import {z} from "zod";
import {defaultMarker} from "../icons/map_icons";
import {Marker, Popup} from "react-leaflet";
import {LatLng} from "leaflet";

const positionsObject = z.object({
    id: z.string(),
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    timestamp: z.string()
})
type positionsType = z.infer<typeof positionsObject>;


const DisplayLocationSharing = () => {
    const {data, status} = useSession({required: true});
    const [userPositions, setUserPositions] = useState<positionsType[]>([]);
    const pusherClient = useMemo(() => new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {cluster: 'eu'}), []);
    if (status === "loading" || !data?.user?.id) {
        return <LoadingComponent title={"Emergency Mode"}/>;
    }
    // Pusher.logToConsole = true;
    const channel = pusherClient.subscribe(data?.user?.id);
    channel.bind('emergency-mode', function (data: positionsType) {
        console.log(data);
        positionsObject.parse(data);
        if (userPositions.findIndex(e => e.id === data.id) == -1) {
            setUserPositions([...userPositions, data]);
        }
    });
    // TODO update position icon to indicate danger
    if (userPositions.length > 0) {
        return <>
            {userPositions.map((positionData) => (
                <Marker key={positionData.id} position={new LatLng(positionData.lat, positionData.lng)}
                        icon={defaultMarker}>
                    <Popup>{positionData.name + " was here at " + new Date(positionData.timestamp).toLocaleTimeString()}</Popup>
                </Marker>
            ))}
        </>
    }

    return <></>;
}
export default DisplayLocationSharing;