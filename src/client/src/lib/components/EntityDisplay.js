import React from "react"
import { Input, Form } from "semantic-ui-react";
import { DateInput as SDateInput, DateTimeInput as SDateTimeInput } from 'semantic-ui-calendar-react';
import Geosuggest from 'react-geosuggest';
import { formatDate, formatDateOnly } from "../utility";
import { Map, Marker, Popup, TileLayer } from "react-leaflet"



const DateTimeDisplay = ({value, ...restProps}) => <div>{formatDate(value)}</div>
const DateDisplay = ({value, ...restProps}) => <div>{formatDateOnly(value)}</div>


const LocationDisplay = ({value, ...restProps}) => (
    <Map center={value.split(",").map(i => parseFloat(i))} zoom={13} style={{height: "150px"}}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={value.split(",").map(i => parseFloat(i))}>
        <Popup><a href={`https://www.google.com/maps/place/${value}`} target="_blank">View on Google Maps</a></Popup>
        </Marker>
    </Map>
)


export {
DateTimeDisplay,
DateDisplay,
LocationDisplay
}