document.getElementById("analyze-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const link = document.getElementById("video-link").value;

  try {
    const response = await fetch("output.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo de análisis");

    const data = await response.json();

    document.getElementById("sentiment").innerHTML = `<h3>Sentimiento: ${data.sentiment[0].label}</h3>`;
    document.getElementById("emotions").innerHTML = `<h3>Emociones detectadas:</h3><pre>${JSON.stringify(data.emotions, null, 2)}</pre>`;
    document.getElementById("colors").innerHTML = `<h3>Colores dominantes:</h3><pre>${JSON.stringify(data.colors, null, 2)}</pre>`;
    document.getElementById("recommendations").innerHTML = `<h3>Recomendaciones:</h3><ul>${data.recommendations.map(r => `<li>${r}</li>`).join("")}</ul>`;
    document.getElementById("results").style.display = "block";
  } catch (error) {
    alert("Error al analizar: " + error.message);
  }
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Reporte de Análisis Viral", 10, 10);

  const recText = document.getElementById("recommendations").innerText;
  const lines = doc.splitTextToSize(recText, 180);
  doc.text(lines, 10, 30);

  doc.save("viralizen_reporte.pdf");
}
