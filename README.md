# Global AI Safety Notary

A decentralized AI safety incident registry built on Ethereum Attestation Service (EAS) on Sepolia testnet.

## Overview

This project enables transparent, immutable tracking of AI safety incidents. Users can:
- Submit incidents with IPFS-stored evidence
- Verify incidents on-chain
- Browse and filter all reported incidents
- Track mitigation status

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Blockchain**: Ethereum Attestation Service on Sepolia
- **Wallet Integration**: RainbowKit + Wagmi
- **Storage**: IPFS via Web3.Storage
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from https://cloud.walletconnect.com
- `NEXT_PUBLIC_SCHEMA_UID`: Will be generated in step 3

### 3. Register Schema on Sepolia

First, get Sepolia ETH from a faucet:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia

Then register the schema:

```bash
PRIVATE_KEY=0xyour_private_key_here pnpm register-schema
```

Copy the returned Schema UID to your `.env.local` file.

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                        # Next.js app router pages
│   ├── api/ipfs/upload/       # IPFS upload API route
│   ├── incidents/             # Incidents list and detail pages
│   ├── submit/                # Submit incident page
│   ├── verify/                # Verification dashboard
│   └── page.tsx               # Landing page
├── components/
│   ├── layout/
│   │   └── Header.tsx         # Navigation header
│   ├── providers/
│   │   └── Web3Provider.tsx   # Web3 context provider
│   └── ui/
│       ├── IncidentCard.tsx   # Incident summary card
│       ├── IncidentForm.tsx   # Multi-step submission form
│       └── SeverityBadge.tsx  # Severity indicator
├── lib/
│   ├── config/
│   │   ├── eas.ts            # EAS configuration
│   │   └── wagmi.ts          # Wagmi configuration
│   ├── eas/
│   │   ├── attest.ts         # Attestation creation
│   │   ├── hooks.ts          # React hooks for EAS
│   │   ├── query.ts          # GraphQL queries
│   │   └── schema.ts         # Schema encoding/decoding
│   ├── ipfs/
│   │   └── upload.ts         # IPFS upload utilities
│   └── types/
│       └── index.ts          # TypeScript type definitions
└── scripts/
    └── register-schema.ts     # Schema registration script
```

## Features

### Submit Incidents
- Multi-step form with validation
- IPFS evidence upload
- On-chain attestation creation
- Real-time transaction feedback

### Browse Incidents
- Filter by type, severity, verification status
- Search by model identifier
- Sort by date or severity
- Responsive grid layout

### Verify Incidents
- Review unverified incidents
- Community-driven verification
- On-chain verification attestations

### Incident Details
- Full incident information
- IPFS evidence display
- On-chain metadata
- Link to EASScan explorer

## Schema Definition

```
string incidentType,
string modelIdentifier,
uint8 severityLevel,
string description,
string evidenceHash,
uint64 timestamp,
string reporterRole,
bool verified,
string mitigationStatus
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

```bash
pnpm build
```

## Testing

### Manual Testing Checklist

- [ ] Connect wallet (MetaMask, WalletConnect)
- [ ] Submit incident with evidence
- [ ] View attestation on EASScan
- [ ] Browse incidents with filters
- [ ] View incident details
- [ ] Verify incident
- [ ] Check IPFS evidence loading

## Contract Addresses (Sepolia)

- **EAS Contract**: `0xC2679fBD37d54388Ce493F1DB75320D236e1815e`
- **Schema Registry**: `0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0`
- **Schema UID**: Set in `.env.local` after registration

## Resources

- [EAS Documentation](https://docs.attest.sh/)
- [EASScan (Sepolia)](https://sepolia.easscan.org)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)

## License

MIT
