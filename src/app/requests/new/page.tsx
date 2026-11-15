import { FlowLoading } from "@/components/flows/loading";
import { Suspense } from "react";
import { ListingForm } from "@/components/flows/listing-form";
export default function Page() { return <Suspense fallback={<FlowLoading/>}><ListingForm kind="request"/></Suspense>; }
