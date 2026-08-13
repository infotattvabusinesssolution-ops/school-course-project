import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const rawText = `
1. What is a cross trade?
A. A shipment that must pass through the seller’s country
B. A shipment moving between two points without entering the seller’s country or premises
C. A domestic shipment between two warehouses
D. A shipment involving only one company
Correct Option: B
Explanation: In a cross trade, goods move directly between the supplier/manufacturer and the destination without physically entering the seller's country or premises.

2. Which scenario best represents a cross trade?
A. A UAE seller buys goods from China and ships them to UAE
B. A Brazilian seller sends goods from Brazil to China
C. A UAE seller purchases goods from China that are shipped directly to Brazil
D. A Chinese manufacturer sells goods locally in China
Correct Option: C
Explanation: The PDF uses the example of cargo moving from China to Brazil while the seller is located in the UAE.

3. Which transport modes can be used for cross trades?
A. Sea only
B. Air and sea only
C. Road and rail only
D. Air, sea, rail and road
Correct Option: D
Explanation: Cross trades can be carried out using all four transport modes mentioned in the module.

4. Why is the selection of a competent transporter important in a cross trade?
A. To manufacture the goods
B. To handle the required documentation correctly
C. To determine the selling price
D. To provide financing to the seller
Correct Option: B
Explanation: Cross trades can require specific document-handling instructions, so the transporter must be capable of managing them correctly.

5. In the cross-trade process described in the module, documents may need to be switched from:
A. Customer → manufacturer → bank
B. Manufacturer → seller → end customer
C. Transporter → customs → manufacturer
D. Seller → government → bank
Correct Option: B
Explanation: The module highlights switching documents coming from the manufacturer to the seller and then from the seller to the final customer.

6. What can influence the structure of a cross-trade deal?
A. Only the product colour
B. Regional trade agreements and trade bodies
C. Only the transport vehicle
D. Advertising regulations
Correct Option: B
Explanation: Regional arrangements such as SADC and the EU can influence how cross-trade transactions are structured.

7. When three parties to a cross trade are within the same regional trade bloc, the PDF refers to it as:
A. Pure Triangular Operation
B. Domestic Cross Trade
C. Intra-Community Cross Trade
D. External Triangular Operation
Correct Option: C
Explanation: The module describes transactions involving three parties within the same trade bloc as intra-community cross trades.

8. In a “Triangular Mixed Operational” cross trade, which party is located outside the designated regional bloc?
A. End customer
B. Manufacturer or supplier
C. Seller and customer
D. Transport company
Correct Option: B
Explanation: According to the module, the manufacturer or supplier is outside the bloc while the other two parties are within the customs zone.

9. What does the module call a transaction where the seller/shipper is inside a regional bloc but both the manufacturer and end customer are outside it?
A. Internal Trade Operation
B. Pure Triangular Operation
C. Bilateral Trade
D. Regional Domestic Trade
Correct Option: B
Explanation: The module refers to this arrangement as a Pure Triangular Operation.

10. What is one major logistical advantage of cross trading?
A. Longer transit routes
B. Higher warehousing requirements
C. Shorter transit times
D. Additional customs stops
Correct Option: C
Explanation: Goods can move directly from supplier to end customer instead of making a three-point journey through the seller.

11. In a traditional three-point transaction, cargo might move from:
A. Supplier → seller → end customer
B. Customer → bank → seller
C. Seller → customs → supplier
D. Supplier → bank → customs
Correct Option: A
Explanation: Cross trading can eliminate the unnecessary physical movement of cargo through the seller's location.

12. How can cross trading potentially benefit the environment?
A. By increasing packaging
B. By increasing transport distances
C. Through more direct routing and potentially lower emissions
D. By requiring additional warehouses
Correct Option: C
Explanation: The module connects more direct routing with reduced carbon-footprint concerns and a positive impact on the green economy.

13. Which environmental issue is specifically mentioned in the module?
A. Water pollution
B. CO₂ emissions and carbon footprint
C. Noise pollution
D. Plastic recycling
Correct Option: B
Explanation: The course specifically mentions growing organisational concern about CO₂ emissions and carbon footprints.

14. How can cross trades lower supply-chain costs?
A. By adding intermediaries
B. By creating additional storage requirements
C. By eliminating unnecessary steps and waste
D. By requiring multiple shipments
Correct Option: C
Explanation: More direct movement helps utilise the supply chain efficiently by eliminating unnecessary activities.

15. Which principle of lean management is connected to cross-trade efficiency in the module?
A. Increasing inventory
B. Elimination of waste
C. Increasing transportation stages
D. Maximising paperwork
Correct Option: B
Explanation: The PDF specifically connects supply-chain efficiency with the lean principle of eliminating waste.

16. Under EU VAT rules, which situation describes a triangular transaction?
A. One company sells goods within its own country
B. A business in Country A sells to a customer in Country B while the goods are shipped directly from Country C
C. Goods travel from Country A to B and back to A
D. Three companies jointly manufacture one product
Correct Option: B
Explanation: The European Commission describes an EU triangular transaction as one where a business in one EU country supplies a customer in another while the goods are shipped directly from a third EU country.

17. Under the EU triangular-transaction simplification, who can generally become liable for VAT on the final supply when the required conditions are met?
A. Freight forwarder
B. Manufacturer
C. Ultimate customer
D. Insurance company
Correct Option: C
Explanation: Under the applicable EU simplification conditions, the ultimate customer can be responsible for the VAT due on the final supply.

18. A typical EU triangular transaction involves:
A. One supply only
B. Two supplies and an intra-EU acquisition
C. Three imports
D. Two exports without a sale
Correct Option: B
Explanation: The European Commission's triangular-transaction example involves two supplies of goods together with an intra-Community acquisition.

19. Which document is specifically important for meeting the EU triangular-transaction simplification conditions?
A. Employee attendance sheet
B. Valid VAT invoice
C. Marketing brochure
D. Product advertisement
Correct Option: B
Explanation: Among the conditions identified by the European Commission is that the relevant invoice complies with the applicable VAT invoicing rules.

20. What is the main purpose of SADC Rules of Origin?
A. Determine advertising standards
B. Determine whether goods qualify for preferential trade treatment
C. Determine transportation speed
D. Set exchange rates
Correct Option: B
Explanation: SADC Rules of Origin determine whether goods originate within qualifying Member States and are therefore eligible for preferential treatment within the Free Trade Area.

21. Which document helps qualifying goods obtain SADC Free Trade Area benefits?
A. Certificate of Origin
B. Employee certificate
C. Marketing certificate
D. Warehouse lease
Correct Option: A
Explanation: Goods meeting SADC Rules of Origin can receive a Certificate of Origin, supporting access to applicable preferential trade benefits.

22. Which of the following can help goods qualify as originating under SADC Rules of Origin?
A. Simply changing the packaging
B. Substantial processing within a Member State
C. Changing the company logo
D. Advertising the product locally
Correct Option: B
Explanation: SADC recognises qualifying criteria including goods wholly obtained in a Member State or goods sufficiently/substantially processed there according to its Rules of Origin.

23. The SADC Free Trade Area was achieved in:
A. 1990
B. 1998
C. 2008
D. 2020
Correct Option: C
Explanation: SADC states that its Free Trade Area was achieved in August 2008, following a phased tariff-reduction programme.

24. Incoterms® rules primarily help buyers and sellers clarify:
A. Employee salaries
B. Tasks, costs and risks relating to delivery of goods
C. Corporate ownership
D. Currency exchange rates
Correct Option: B
Explanation: ICC states that Incoterms® clarify the responsibilities, costs and risks associated with delivery between sellers and buyers.

25. How many Incoterms® 2020 rules are there?
A. 7
B. 9
C. 11
D. 15
Correct Option: C
Explanation: Incoterms® 2020 contains 11 trade terms, divided between rules usable for any transport mode and rules specifically designed for sea and inland-waterway transport.

26. Which Incoterms® rule can be used regardless of the mode of transport, including multimodal shipments?
A. FOB
B. FAS
C. FCA
D. CFR
Correct Option: C
Explanation: FCA (Free Carrier) can be used irrespective of the selected mode of transport and can also apply when multiple transport modes are involved.

27. Which Incoterms® rule is intended specifically for sea or inland-waterway transport?
A. FCA
B. DAP
C. CPT
D. FOB
Correct Option: D
Explanation: FOB (Free On Board) is specifically intended for sea and inland-waterway transport, with delivery occurring when the goods are placed on board the nominated vessel.

28. Under CPT (Carriage Paid To), when does risk generally transfer from the seller to the buyer?
A. When the buyer sells the goods
B. When the goods are handed over to the carrier
C. Only when the goods reach the destination
D. After customs duty is paid
Correct Option: B
Explanation: Under CPT, the seller contracts and pays for carriage to the agreed destination, but risk transfers when the goods are handed over to the carrier.

29. Which Incoterms® 2020 rule uniquely requires the seller to unload the goods at the destination?
A. DAP
B. DPU
C. FCA
D. CPT
Correct Option: B
Explanation: ICC specifies that DPU — Delivered at Place Unloaded is the only Incoterms® rule requiring the seller to unload the goods at the named destination.

30. Which Incoterms® rule places the maximum level of obligation on the seller?
A. EXW
B. FCA
C. FOB
D. DDP
Correct Option: D
Explanation: Under DDP (Delivered Duty Paid), the seller has extensive responsibility, including bringing the goods to the destination and handling applicable import clearance, duties and taxes. ICC describes DDP as imposing the maximum seller obligation among the 11 Incoterms® rules.
`;

const parseQuestions = (text) => {
  const qs = [];
  const blocks = text.trim().split(/\n\n+/); // Split by blank lines
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // Use regex to parse block
    const match = block.match(/^\d+\.\s*(.+?)\nA\.\s*(.+?)\nB\.\s*(.+?)\nC\.\s*(.+?)\nD\.\s*(.+?)\nCorrect Option:\s*([A-D])\nExplanation:\s*(.+)$/is);
    
    if (match) {
      const qText = match[1].trim();
      const options = [match[2].trim(), match[3].trim(), match[4].trim(), match[5].trim()];
      const correctChar = match[6].trim().toUpperCase();
      const correctIndex = correctChar === 'A' ? 0 : correctChar === 'B' ? 1 : correctChar === 'C' ? 2 : 3;
      const explanation = match[7].trim();
      
      qs.push({
        questionText: qText,
        options,
        correctAnswerIndex: correctIndex,
        explanation
      });
    } else {
      console.log('Failed to parse block:', block);
    }
  }
  return qs;
};

// Mongoose connects
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected for seeding'));

import { Course } from './src/models/Course.model.js';
import Exam from './src/models/Exam.model.js';
import User from './src/models/User.model.js';

async function seed() {
  try {
    const questions = parseQuestions(rawText);
    console.log(`Parsed ${questions.length} questions successfully!`);
    
    if (questions.length !== 30) {
      console.error('Expected 30 questions. Aborting.');
      process.exit(1);
    }

    // Find the cross trades course
    const course = await Course.findOne({ title: { $regex: /Cross Trades/i } });
    if (!course) {
      console.error('Course "Cross Trades Module" not found in DB!');
      process.exit(1);
    }
    
    // Find an admin user
    const admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
      console.error('No ADMIN user found!');
      process.exit(1);
    }

    // Check if exam already exists
    let exam = await Exam.findOne({ course: course._id });
    
    if (exam) {
      console.log('Exam already exists. Updating questions...');
      exam.questions = questions;
      await exam.save();
    } else {
      console.log('Creating new Exam...');
      exam = new Exam({
        course: course._id,
        questions,
        passingPercentage: 60, // A standard passing percentage
        timeLimitMinutes: 45, // 1.5 mins per question
        shuffleQuestions: true,
        createdBy: admin._id,
      });
      await exam.save();
    }
    
    console.log('Successfully seeded the Exam for Course:', course.title);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
