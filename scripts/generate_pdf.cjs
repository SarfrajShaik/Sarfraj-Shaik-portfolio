const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'resume.pdf');

// We will construct a perfectly formatted, standard, minimalist single-page PDF document
// with accurate offsets and fully standard PDF structure.
// PDF Font F1 is Standard Helvetica. Font F2 is Helvetica-Bold.

const pdfData = [];

function add(str) {
  pdfData.push(Buffer.from(str + '\n', 'utf8'));
}

function addBinary(buf) {
  pdfData.push(buf);
  pdfData.push(Buffer.from('\n', 'utf8'));
}

// 1. PDF Header
add('%PDF-1.4');

// Keep track of our objects and their offsets for the cross-reference (xref) table
const objects = [];
const offsetMap = {};

function startObj(id) {
  offsetMap[id] = getCurrentOffset();
  add(`${id} 0 obj`);
}

function endObj() {
  add('endobj');
}

function getCurrentOffset() {
  let total = 0;
  for (const chunk of pdfData) {
    total += chunk.length;
  }
  return total;
}

// 2. Catalog (1) & Pages Tree (2)
startObj(1);
add('<< /Type /Catalog /Pages 2 0 R >>');
endObj();

startObj(2);
add('<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>');
endObj();

// 3. Page Object (3)
// Standard Letter size: 612 x 792 points (8.5 x 11 inches)
startObj(3);
add('<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>');
endObj();

// 4. Content Stream (4)
// Here, we define the graphics and text layout instructions
const streamParts = [];

// Helper to push text commands
streamParts.push('BT'); // Begin Text

// Title: SARFRAJ SHAIK (Centered, Bold, Size 20)
streamParts.push('/F2 20 Tf');
streamParts.push('1 0 0 1 206 740 Tm'); // Translate cursor to center-left
streamParts.push('(SARFRAJ SHAIK) Tj');

// Subheader: COMPUTER SCIENCE & DATA SCIENCE (Centered, Regular, Size 10)
streamParts.push('/F1 10 Tf');
streamParts.push('1 0 0 1 180 722 Tm');
streamParts.push('(sarfrajshaik03@gmail.com | Portfolio Website) Tj');

// Decorative horizontal divider line
streamParts.push('ET'); // End text stream temporarily
streamParts.push('0.5 w'); // line width
streamParts.push('40 706 m'); // move to (40, 706)
streamParts.push('572 706 l'); // line to (572, 706)
streamParts.push('S'); // Stroke line
streamParts.push('BT'); // Resume text stream

// --- SECTION: PROFESSIONAL SUMMARY ---
streamParts.push('/F2 12 Tf');
streamParts.push('1 0 0 1 40 682 Tm');
streamParts.push('(PROFESSIONAL SUMMARY) Tj');

streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 664 Tm');
streamParts.push('(Final-year Computer Science student & aspiring Data Scientist with hands-on experience in machine learning,) Tj');
streamParts.push('1 0 0 1 40 651 Tm');
streamParts.push('(statistics-driven predictive modeling, robust data engineering, and interactive analytics dashboards.) Tj');

// --- SECTION: TECHNICAL SPECIALIZATIONS ---
streamParts.push('/F2 12 Tf');
streamParts.push('1 0 0 1 40 626 Tm');
streamParts.push('(TECHNICAL SPECIALIZATIONS) Tj');

streamParts.push('/F2 10 Tf');
streamParts.push('1 0 0 1 40 608 Tm');
streamParts.push('(\\225 Machine Learning & Deep Learning:) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 220 608 Tm');
streamParts.push('(PyTorch, Scikit-Learn, Predictive Analysis, Computer Vision, CNNs) Tj');

streamParts.push('/F2 10 Tf');
streamParts.push('1 0 0 1 40 594 Tm');
streamParts.push('(\\225 Data Engineering & Analytics:) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 220 594 Tm');
streamParts.push('(Python, Pandas, NumPy, SQL, ETL pipelines, Interactive Visualizations) Tj');

streamParts.push('/F2 10 Tf');
streamParts.push('1 0 0 1 40 580 Tm');
streamParts.push('(\\225 Web & Database Systems:) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 220 580 Tm');
streamParts.push('(React/Vite, TypeScript, TailwindCSS, Express.js, PostgreSQL, FastAPI) Tj');

// --- SECTION: CAPSTONE RESEARCH PROJECTS ---
streamParts.push('/F2 12 Tf');
streamParts.push('1 0 0 1 40 554 Tm');
streamParts.push('(CAPSTONE RESEARCH PROJECTS) Tj');

// Project 1
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 536 Tm');
streamParts.push('(1. ClinicaVision: Explainable Radiographic AI Classifier) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 522 Tm');
streamParts.push('(Designed ensemble neural networks with vision transformers and convolutional layers to identify diagnostic) Tj');
streamParts.push('1 0 0 1 40 510 Tm');
streamParts.push('(patterns. Implemented layer activation maps (Grad-CAM) to explain local statistical decision weights.) Tj');

// Project 2
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 486 Tm');
streamParts.push('(2. AeroSense: Spatiotemporal Environmental Forecaster) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 472 Tm');
streamParts.push('(Built telemetry pipelines ingesting atmospheric sensor readings. Coded multi-step LSTM & multivariate) Tj');
streamParts.push('1 0 0 1 40 460 Tm');
streamParts.push('(Prophet modules to forecast micro-ambient air quality changes across urban target zones.) Tj');

// Project 3
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 436 Tm');
streamParts.push('(3. DriftSentry: Automated ML Drift Pipeline) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 422 Tm');
streamParts.push('(Developed modular statistical container assessing pipeline drift and Population Stability Index (PSI) values.) Tj');
streamParts.push('1 0 0 1 40 410 Tm');
streamParts.push('(Configured auto-retraining alerts triggered upon real-time validation decay.) Tj');

// --- SECTION: ACADEMIC & RESEARCH EXPERIENCE ---
streamParts.push('/F2 12 Tf');
streamParts.push('1 0 0 1 40 384 Tm');
streamParts.push('(ACADEMIC & RESEARCH EXPERIENCE) Tj');

// Exp 1
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 366 Tm');
streamParts.push('(Undergraduate Researcher & Data Science Intern) Tj');
streamParts.push('/F1 10 Tf');
streamParts.push('1 0 0 1 400 366 Tm');
streamParts.push('(University CS Research Lab | 2023 - Present) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 351 Tm');
streamParts.push('(Formulates evaluation metrics, performs exploratory log cleaning, and compiles key ML models.) Tj');

// Exp 2
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 328 Tm');
streamParts.push('(Computer Science Candidate) Tj');
streamParts.push('/F1 10 Tf');
streamParts.push('1 0 0 1 400 328 Tm');
streamParts.push('(School of Info Tech & Engineering | 2020 - 2024) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 313 Tm');
streamParts.push('(Extensive academic curriculum in advanced algorithms, big data query schemas, and neural network design.) Tj');

// Exp 3
streamParts.push('/F2 10.5 Tf');
streamParts.push('1 0 0 1 40 290 Tm');
streamParts.push('(Data Systems Developer) Tj');
streamParts.push('/F1 10 Tf');
streamParts.push('1 0 0 1 400 290 Tm');
streamParts.push('(CS Engineering Lab Projects | 2021 - 2023) Tj');
streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 275 Tm');
streamParts.push('(Engineered modular relational databases, configured web API layers, and created responsive analytics displays.) Tj');

// --- SECTION: CORE COMPETENCIES & STACK ---
streamParts.push('/F2 12 Tf');
streamParts.push('1 0 0 1 40 248 Tm');
streamParts.push('(CORE COMPETENCIES & COMPUTING SKILLS) Tj');

streamParts.push('/F1 9.5 Tf');
streamParts.push('1 0 0 1 40 230 Tm');
streamParts.push('(Development Stack: JavaScript, TypeScript, React, Express, Python, FastAPI, SQL, PostgreSQL, Git, CSS/Tailwind) Tj');
streamParts.push('1 0 0 1 40 216 Tm');
streamParts.push('(Data Stack: NumPy, Pandas, Scikit-Learn, PyTorch, Matplotlib, Prophet, ETL Pipelines, Statistical Modeling) Tj');

// Footer/Signoff
streamParts.push('/F1 8.5 Tf');
streamParts.push('1 0 0 1 146 170 Tm');
streamParts.push('(Prepared on behalf of Sarfraj Shaik. Fully compliant high-fidelity digital reproduction.) Tj');

streamParts.push('ET'); // End Text

const streamContent = streamParts.join('\n');
const streamLength = Buffer.byteLength(streamContent, 'utf8');

startObj(4);
add(`<< /Length ${streamLength} >>`);
add('stream');
add(streamContent);
add('endstream');
endObj();

// 5. Standard Helvetica Font (F1)
startObj(5);
add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
endObj();

// 6. Helvetica Bold Font (F2)
startObj(6);
add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
endObj();

// 7. Cross-Reference (xref) Table
const xrefOffset = getCurrentOffset();
add('xref');
add(`0 ${6 + 1}`);
add('0000000000 65535 f ');

for (let i = 1; i <= 6; i++) {
  const offsetStr = String(offsetMap[i]).padStart(10, '0');
  add(`${offsetStr} 00000 n `);
}

// 8. Trailer
add('trailer');
add(`<< /Size ${6 + 1} /Root 1 0 R >>`);
add('startxref');
add(String(xrefOffset));
add('%%EOF');

// Write the compiled buffer to the output PDF path
const finalBuffer = Buffer.concat(pdfData);
fs.writeFileSync(outputPath, finalBuffer);

console.log('PDF Resume successfully generated at:', outputPath);
