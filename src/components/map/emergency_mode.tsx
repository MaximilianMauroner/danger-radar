import {Browser, LatLng} from "leaflet";
import {trpc} from "../../utils/trpc";
import {useMap, useMapEvents} from "react-leaflet";
import {MapPinIcon} from "@heroicons/react/24/solid";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

const EmergencyMode = () => {
    const [emergencyMode, setEmergencyMode] = React.useState(window.location.search.includes("emergency=true"));
    const locationMutation = trpc.user.shareLocation.useMutation({
        onSuccess: (e) => {
            console.log(e)
        }
    });
    const [lastLocation, setLastLocation] = useState<LatLng | undefined>();
    const [currentLocation, setCurrentLocation] = useState<LatLng | undefined>();
    const disableEmergencyMutation = trpc.user.disableEmergencyMode.useMutation({
        onSuccess: () => {
            router.push("/")
        }
    })
    const router = useRouter();
    const map = useMap();
    const locate = () => {
        map.locate({});
    }
    useEffect(() => {
        if (currentLocation && currentLocation.lat !== lastLocation?.lat && currentLocation.lng !== lastLocation?.lng) {
            locationMutation.mutate({
                lat: currentLocation.lat,
                lng: currentLocation.lng
            });
            setLastLocation(currentLocation);
        }
    }, [currentLocation]);

    useEffect(() => {
        if (emergencyMode) {
            setInterval(locate, 5000);
        }
    }, []);


    useMapEvents({
        locationfound(e) {
            if (e.latlng != undefined && emergencyMode) {
                setCurrentLocation(e.latlng);
            }
        }
    });
    const disableEmergencyMode = () => {
        disableEmergencyMutation.mutate();
    }
    if (emergencyMode) {
        return (
            <button onClick={() => disableEmergencyMode()}
                    className={"dark:bg-red-900 dark:text-white rounded-xl left-0 right-0 top-1 mx-auto w-36 text-xl p-1 text-center absolute z-[1000]"}>
                Disable Emergency Mode
            </button>
        );
    }
    return <></>

}
export default EmergencyMode;