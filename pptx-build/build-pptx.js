const pptxgen = require("pptxgenjs");
const { html2pptx } = require("@ant/html2pptx");
const path = require("path");

async function build() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Rede de Valor + TIME";
  pptx.title = "Rede de Valor — Apresentação Comercial 2025";
  pptx.subject = "Networking Premium";

  const slidesDir = path.join(__dirname, "slides");
  const total = 15;

  for (let i = 1; i <= total; i++) {
    const num = String(i).padStart(2, "0");
    const htmlFile = path.join(slidesDir, `slide${num}.html`);
    console.log(`Processing slide ${num}...`);
    await html2pptx(htmlFile, pptx);
  }

  const outFile = path.join(__dirname, "rede-de-valor-apresentacao.pptx");
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nPresentation saved: ${outFile}`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
