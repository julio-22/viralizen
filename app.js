document.getElementById("analyze-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const url = document.getElementById("video-link").value.trim();

  // Extraer ID del video de Shorts (última parte del enlace)
  const videoIdMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (!videoIdMatch) {
    alert("Por favor, ingresa un enlace válido de YouTube Shorts.");
    return;
  }

  const videoId = videoIdMatch[1];
  const jsonPath = `${videoId}.json`;

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error("Archivo no encontrado.");

    const data = await response.json();

    document.getElementById("sentiment").innerHTML = `<h3>Sentimiento: ${data.sentiment[0].label}</h3>`;
    document.getElementById("emotions").innerHTML = `<h3>Emociones detectadas:</h3><pre>${JSON.stringify(data.emotions, null, 2)}</pre>`;

    const colorBoxes = data.colors.map(c => {
      const hex = rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]);
      return `<div style="background:${hex}; width:40px; height:40px; display:inline-block; margin-right:6px;" title="${hex}"></div>`;
    }).join("");

    document.getElementById("colors").innerHTML = `<h3>Colores dominantes:</h3>${colorBoxes}`;
    document.getElementById("recommendations").innerHTML = `<h3>Recomendaciones:</h3><ul>${data.recommendations.map(r => `<li>${r}</li>`).join("")}</ul>`;
    
    document.getElementById("results").style.display = "block";
  } catch (error) {
    alert("No se pudo cargar el análisis para ese video. Asegúrate de haber subido un archivo llamado:\n\n" + jsonPath);
  }
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Reporte de Análisis Viral", 10, 10);

  const recomendaciones = document.getElementById("recommendations").innerText;
  const lines = doc.splitTextToSize(recomendaciones, 180);
  doc.text(lines, 10, 30);

  doc.save("viralizen_reporte.pdf");
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join("");
}
