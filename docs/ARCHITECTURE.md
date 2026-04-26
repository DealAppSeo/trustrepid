# Architecture

SDK Integration Flow.

```mermaid
graph TD
    ClientApp --> SDK
    SDK --> RPC
    SDK --> IPFS
    SDK --> Supabase
```