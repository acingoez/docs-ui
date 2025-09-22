// src/types/document.ts
export interface ApiDocument {
    id: string;
    fingerprint: string;
    key: string;
    tenantId: string;
    title: string;
    mime: string;
    size: number;         // Bytes
    origin: string | null;
    createdAt: string;    // ISO
    updatedAt: string;    // ISO
    deletedAt: string | null;
  }
  