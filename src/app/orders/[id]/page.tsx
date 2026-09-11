import { OrderDetail } from "@/components/flows/order";
export default async function Page({params}: {params: Promise<{id:string}>}) {const {id}=await params;return <OrderDetail id={id}/>;}
