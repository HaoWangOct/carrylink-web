import { FlowLoading } from "@/components/flows/loading";
import { Suspense } from "react";
import { Dashboard } from "@/components/flows/dashboard";
export default function Page() { return <Suspense fallback={<FlowLoading/>}><Dashboard /></Suspense>; }
