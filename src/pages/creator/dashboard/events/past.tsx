import React, { type ReactNode } from "react";
import { DashboardLayout } from "..";
import { EventsLayout } from ".";

export const metadata = {
  title: "Past Events | Dashboard",
};

const PastEvents = () => {
  return <>Events</>;
};

export default PastEvents;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

PastEvents.getLayout = EventsNestedLayout;
