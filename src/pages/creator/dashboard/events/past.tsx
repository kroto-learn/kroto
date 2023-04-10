import React from "react";
import DashboardLayout from "../layout";
import EventsLayout from "./layout";

export const metadata = {
  title: "Past Events | Dashboard",
};

const PastEvents = () => {
  return <>Events</>;
};

export default PastEvents;

const nestLayout = (parent: any, child: any) => {
  return (page: any) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

PastEvents.getLayout = EventsNestedLayout;
