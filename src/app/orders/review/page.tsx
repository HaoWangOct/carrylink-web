import { FlowLoading } from "@/components/flows/loading";
import { Suspense } from "react";
import { OrderReview } from "@/components/flows/order";
export default function Page() { return <Suspense fallback={<FlowLoading/>}><OrderReview /></Suspense>; }
