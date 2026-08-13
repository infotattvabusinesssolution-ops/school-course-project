import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feed from './src/models/Feed.model.js';
import Glossary from './src/models/Glossary.model.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const feedsData = [
  { title: 'UNCTAD - Global Trade & Development', description: 'Why? Covers global economic trends, developing country trade issues, and supply chain analysis.', url: 'https://unctad.org/news-search?f[0]=sitemap%3A910' },
  { title: 'World Trade Organization (WTO) News', description: 'Why? Updates on trade agreements, tariffs, global trade policy, disputes, and international trade rules.', url: 'https://www.wto.org/index.htm' },
  { title: 'Export.gov (via Trade.gov) - U.S. Trade News & Tools', description: 'Why? Market intelligence, export tips, trade missions - useful for global context even outside the U.S.', url: 'https://www.trade.gov/news-and-highlights' },
  { title: 'Journal of Commerce (JOC.com)-Trade & Logistics', description: 'Why? Industry updates on container shipping, ports, trade lanes, and freight logistics.', url: 'https://www.joc.com/' },
  { title: 'Trade Finance Global (TFG)', description: 'Why? Focus on trade finance instruments, letters of credit, payments, and risk management.', url: 'https://www.tradefinanceglobal.com/' },
  { title: 'International Trade Centre (ITC) News', description: 'Why? Tools, trends, and SME export opportunities with a focus on developing countries.', url: 'https://www.intracen.org/' },
  { title: 'Shipping and Freight Resource-Education & Industry Updates', description: 'Why? Excellent for students-simplifies shipping, Incoterms, containers, and port logistics.', url: 'https://www.shippingandfreightresource.com/iqax-goes-live-with-dcsas-electronic-bill-of-lading-ebl-3-0-api-on-gsbn-network/' },
  { title: 'Global Trade Magazine-Import/Export Industry News', description: 'Why? Insightful articles on trade finance, export opportunities, customs, Incoterms, and business strategy.', url: 'https://www.globaltrademag.com/imports-exports/' },
  { title: 'FreightWaves-Supply Chain & Logistics News', description: 'Why? Real-time updates on shipping, logistics, freight rates, and supply chain disruptions.', url: 'https://www.freightwaves.com/' }
];

const glossaryData = [
  { term: 'Bill of Lading (BOL)', definition: 'Legal document between shipper and carrier detailing goods.' },
  { term: 'Commercial Invoice', definition: 'Payment demand from seller to buyer.' },
  { term: 'Incoterms', definition: 'Standardized trade terms (e.g., FOB, CIF) defining responsibilities.' },
  { term: 'Tariff', definition: 'Tax on imports/exports.' },
  { term: 'Duty', definition: 'Government tax on imported goods.' },
  { term: 'Packing List', definition: 'Itemizes contents, weights, and packaging of shipments' },
  { term: 'Certificate of Origin', definition: 'Confirms where goods were manufactured.' },
  { term: 'Letter of Credit (LC)', definition: 'Bank guarantee ensuring payment to exporters.' },
  { term: 'Freight Forwarder', definition: 'Agent organizing cargo transport.' },
  { term: 'Customs Broker', definition: 'Licensed professional clearing goods through customs.' },
  { term: 'TEU (Twenty-Foot Equivalent Unit)', definition: 'Standard container measurement.' },
  { term: 'Demurrage', definition: 'Fee for delayed container return.' },
  { term: 'Pro Forma Invoice', definition: 'Preliminary bill sent before shipment.' },
  { term: 'Exchange Rate Risk', definition: 'Currency value fluctuations affecting trade profits.' },
  { term: 'Trade Finance', definition: 'Financial tools (e.g., LC, export credit) facilitating global deals.' },
  { term: 'Bootstrapping', definition: 'Ability to grow without proportional cost increases' },
  { term: 'B2B (Business-to-Business)', definition: 'Companies selling to other businesses.' },
  { term: 'Supply Chain', definition: 'End-to-end production/delivery process.' },
  { term: 'Free Trade Agreement (FTA)', definition: 'Pact reducing trade barriers between countries.' },
  { term: 'Non-Tariff Barrier (NTB)', definition: 'Regulations (e.g., quotas, bans) limiting trade' },
  { term: 'Dumping', definition: 'Exporting goods below market price to dominate a market.' },
  { term: 'AfCFTA (African Continental Free Trade Area)', definition: 'Pan-African trade agreement' },
  { term: 'Informal Cross-Border Trade (ICBT)', definition: 'Unrecorded small-scale regional trade' },
  { term: 'Export Processing Zone (EPZ)', definition: 'Designated area for tax-free manufacturing/export' },
  { term: 'E-commerce Fulfilent', definition: 'Storing, packing, and shipping online orders.' },
  { term: 'Drop shipping', definition: 'Selling goods shipped directly from supplier to customer' },
  { term: 'Blockchain in Trade', definition: 'Secure digital ledger for supply chain transparency.' },
  { term: 'MVP (Minimum Viable Product)', definition: 'Simplest version of a product to test markets.' },
  { term: 'Pivot', definition: 'Strategic shift in business model.' },
  { term: 'Incubator', definition: 'Program supporting early-stage startups.' },
  { term: 'PDF Handbook', definition: 'For student onboarding.' }
];

const migrateData = async () => {
    await connectDB();

    try {
        await Feed.deleteMany();
        await Glossary.deleteMany();

        await Feed.insertMany(feedsData);
        await Glossary.insertMany(glossaryData);

        console.log('Data migration complete!');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
