"use client";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import React from "react";
import Home from "@/util/biconomy";
import AcToken from "@/util/mintbiconomy";
import Hoome from "@/util/BiconomySessionManager";

function page() {
  return (
    <div>
      <DynamicWidget />
      {/* <Home /> */}
      <Hoome />
      {/* <AcToken /> */}
    </div>
  );
}

export default page;
