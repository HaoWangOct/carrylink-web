'use client';
import { useLanguage } from '../language-provider';
import { flowCopy } from '@/content/flow-copy';
export function FlowLoading() { return <p role="status" className="container-page py-24">{flowCopy(useLanguage().lang).loading}</p>; }
