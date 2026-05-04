"use client";

import RAGDemo from "@/components/rag-demo";
import CryptoDashboard from "@/components/CryptoDashboard";


export default function GooglePage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RAGDemo />
      <CryptoDashboard />
    </main>
  );
}


