document.getElementById("analyze-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const link = document.getElementById("video-link").value;

  // Simulación de carga de archivo generado por Google Colab
  const response = await fetch("output.json");
  const data = await response.json();

  document.getElementById("sentiment").innerHTML = `<h3>Sentimiento: ${data.sentiment[0].label}</h3>`;
  document.getElementById("emotions").innerHTML = `<h3>Emociones detectadas:</h3><pre>${JSON.stringify(data.emotions, null, 2)}</pre>`;
  document.getElementById("colors").innerHTML = `<h3>Colores dominantes:</h3><pre>${JSON.stringify(data.colors, null, 2)}</pre>`;
  document.getElementById("recommendations").innerHTML = `<h3>Recomendaciones:</h3><ul>${data.recommendations.map(r => `<li>${r}</li>`).join("")}</ul>`;
  document.getElementById("results").style.display = "block";
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Reporte de Análisis Viral", 10, 10);
  doc.text(document.getElementById("recommendations").innerText, 10, 30);
  doc.save("viralizen_reporte.pdf");
}
