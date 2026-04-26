
# Architecture: trustrepid

This repository provides the SDK integration flow.

```mermaid
graph TD
    ClientApp --> SDK
    SDK --> RPC
    SDK --> IPFS
    SDK --> Supabase
```
