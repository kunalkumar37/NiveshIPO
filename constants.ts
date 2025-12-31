
import { IPO } from './types';

// Helper to get relative dates for demo purposes
const now = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const dateMinus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

const datePlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const MOCK_IPOS: IPO[] = [
  {
    id: '1',
    companyName: 'TechVeda Solutions Ltd',
    symbol: 'TECHVEDA',
    status: 'Closed',
    ipoType: 'Mainboard', // Fix: Added required ipoType
    issueSize: '₹1,250 Cr',
    priceBand: '₹420 - ₹441',
    lotSize: 34,
    openDate: dateMinus(25),
    closeDate: dateMinus(22),
    listingDate: dateMinus(15),
    gmp: '+₹85 (19%)',
    description: 'Leading provider of enterprise digital transformation services with a focus on AI and Cloud infrastructure.',
    riskScore: 35,
    riskLevel: 'Low',
    sector: 'Technology',
    subscription: {
      qib: 12.5,
      nii: 4.2,
      retail: 2.1,
      total: 6.8,
      updatedAt: dateMinus(22)
    },
    financials: [
      { label: 'Revenue Growth', value: '28% YoY', trend: 'up' },
      { label: 'EBITDA Margin', value: '18.5%', trend: 'up' },
      { label: 'Debt/Equity', value: '0.12', trend: 'neutral' }
    ],
    valuation: [
      { label: 'P/E Ratio', value: '24.5' },
      { label: 'Market Cap', value: '₹5,400 Cr' }
    ],
    registrar: 'Link Intime India Pvt Ltd',
    leadManager: 'ICICI Securities'
  },
  {
    id: '2',
    companyName: 'NexGen FinTech',
    symbol: 'NXGN',
    status: 'Live',
    ipoType: 'SME', // Fix: Added required ipoType
    issueSize: '₹850 Cr',
    priceBand: '₹180 - ₹195',
    lotSize: 75,
    openDate: dateMinus(1),
    closeDate: datePlus(2),
    listingDate: datePlus(8),
    gmp: '+₹42 (22%)',
    description: 'Digital-first banking platform revolutionizing micro-lending for small businesses.',
    riskScore: 45,
    riskLevel: 'Moderate',
    sector: 'Finance',
    subscription: {
      qib: 5.2,
      nii: 2.1,
      retail: 8.5,
      total: 4.8,
      updatedAt: 'Today, 10:00 AM'
    },
    financials: [
      { label: 'CASA Ratio', value: '42%', trend: 'up' },
      { label: 'NPA', value: '1.2%', trend: 'down' }
    ],
    valuation: [
      { label: 'P/B Ratio', value: '3.2' }
    ],
    registrar: 'KFin Technologies Ltd',
    leadManager: 'HDFC Bank'
  },
  {
    id: '3',
    companyName: 'GreenGrid Renewables',
    symbol: 'GGRID',
    status: 'Upcoming',
    ipoType: 'Mainboard', // Fix: Added required ipoType
    issueSize: '₹2,100 Cr',
    priceBand: '₹550 - ₹575',
    lotSize: 26,
    openDate: datePlus(15),
    closeDate: datePlus(18),
    listingDate: datePlus(25),
    gmp: 'N/A',
    description: 'Sustainable energy infrastructure focusing on solar-wind hybrid projects.',
    riskScore: 25,
    riskLevel: 'Low',
    sector: 'Energy',
    financials: [
      { label: 'Capacity', value: '2.5 GW', trend: 'up' },
      { label: 'Debt', value: '₹400 Cr', trend: 'neutral' }
    ],
    valuation: [
      { label: 'EV/EBITDA', value: '12.4' }
    ],
    registrar: 'Link Intime India Pvt Ltd',
    leadManager: 'Kotak Mahindra Capital'
  }
];
