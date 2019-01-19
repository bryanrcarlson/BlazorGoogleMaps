﻿
window.googleMapEventJsFunctions = {
    addListener: function (guid, mapId, eventName) {
        console.log("Add listener for map : " + mapId + ", event : " + guid + ", " + eventName);

        if (window._blazorGoogleMaps === null || window._blazorGoogleMaps === 'undefined') {
            console.log("maps collection is not initialize.");
            return false;
        }

        window._blazorMapEvents = window._blazorMapEvents || [];

        window._blazorMapEvents[guid] = window._blazorGoogleMaps[mapId].addListener(eventName, async function (args) {
            console.log("Event " + eventName + " fired.");
            console.dir(args);

            let timestamp = + new Date();
            let eventArgsId = guid + "_" + timestamp;

            window._blazorMapEventArgs = window._blazorMapEventArgs || [];

            if (args !== null && typeof args !== 'undefined') {
                args["id"] = eventArgsId;
                window._blazorMapEventArgs[eventArgsId] = args;
            }

            await DotNet.invokeMethodAsync('SharedComponents', 'NotifyMapEvent', guid, args)
                .then(_ => {
                    console.log("Remove event args : " + eventArgsId);
                    delete window._blazorMapEventArgs[eventArgsId];
                });
        });

        return true;
    },

    removeListener: function (guid) {
        var eventRef = window._blazorMapEvents[guid];
        eventRef.remove();
    },

    addMarkerListener: function (eventGuid, markerGuid, eventName) {
        console.log("Add listener for marker : " + markerGuid + ", event : " + eventGuid + ", " + eventName);

        if (window._blazoeGoogleMapsMarkers === null || window._blazoeGoogleMapsMarkers === 'undefined') {
            console.log("markers collection is not initialize.");
            return false;
        }

        window._blazorMapEvents = window._blazorMapEvents || [];

        window._blazorMapEvents[eventGuid] = window._blazoeGoogleMapsMarkers[markerGuid].addListener(eventName, async function (args) {
            console.log("Event " + eventName + " fired.");

            let timestamp = + new Date();
            let eventArgId = eventGuid + "_" + timestamp;

            window._blazorMapEventArgs = window._blazorMapEventArgs || [];

            if (args !== null && typeof args !== 'undefined') {
                console.dir(args);

                args["id"] = eventArgId;
                window._blazorMapEventArgs[eventArgId] = args;
            }

            await DotNet.invokeMethodAsync('SharedComponents', 'NotifyMarkerEvent', eventGuid, args)
                .then(_ => {
                    console.log("Remove event args : " + eventArgId);
                    delete window._blazorMapEventArgs[eventArgId];
                });
        });

        return true;
    },

    invokeEventArgsFunction: function (id, functionName) {
        console.log("Invoke event function : " + functionName + "for event id : " + id);
        //console.dir(window._blazorMapEventArgs);
        //console.dir(window._blazorMapEventArgs[id]);

        window._blazorMapEventArgs[id][functionName]();

        return true;
    }
};