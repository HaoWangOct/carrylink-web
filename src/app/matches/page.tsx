import { FlowLoading } from "@/components/flows/loading";
import { Suspense } from "react";
import { Matches } from "@/components/flows/matches";
export default function Page() { return <Suspense fallback={<FlowLoading/>}><Matches /></Suspense>; }
