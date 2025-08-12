const API_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";
const API_TOKEN = "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";

const explicacionEmociones = {
  joy: "😚😌 Alegría, felicidad o entusiasmo.",
  sadness: "🙁😭 Tristeza, melancolía o desánimo.",
  anger: "😤😠 Enojo, frustración o irritación.",
  fear: "😨😩 Miedo, ansiedad o preocupación.",
  surprise: "🫨😱 Sorpresa o asombro.",
  neutral: "😐 Emoción neutral"
};

async function analizarEmocion(texto) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: texto })
  });
  return await res.json();
}

document.getElementById("btnAnalizar").onclick = async () => {
  const texto = document.getElementById("inputTexto").value.trim();
  const resultadoDiv = document.getElementById("resultado");
  const descripcionDiv = document.getElementById("descripcion");

  if (!texto) {
    alert("Por favor, ingresa una frase para analizar.");
    return;
  }

  resultadoDiv.textContent = "Analizando...";
  descripcionDiv.textContent = "";

  try {
    const resultado = await analizarEmocion(texto);

    if (resultado.error) {
      resultadoDiv.textContent = "Error: " + resultado.error;
      return;
    }

    const emociones = resultado[0];
    emociones.sort((a, b) => b.score - a.score);
    const mayorEmocion = emociones[0];

    resultadoDiv.textContent = `Emoción principal: ${mayorEmocion.label} (${(mayorEmocion.score * 100).toFixed(2)}%)`;
    descripcionDiv.textContent = explicacionEmociones[mayorEmocion.label] || "";

  } catch (e) {
    resultadoDiv.textContent = "Error al analizar la frase.";
    descripcionDiv.textContent = "";
  }
};

// Botón de traducir
document.getElementById("btnTraducir").addEventListener("click", function() {
    const texto = document.getElementById("inputTexto").value;
    if (!texto) {
        alert("Por favor, ingresa un texto para traducir.");
        return;
    }

    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=es|en`)
    .then(response => response.json())
    .then(data => {
        if (data.responseData.translatedText) {
            document.getElementById("inputTexto").value = data.responseData.translatedText;
        } else {
            alert("No se pudo traducir el texto.");
        }
    })
    .catch(err => console.error("Error en la traducción:", err));
});


const tooltip = document.getElementById('tooltip-image');

document.querySelectorAll('.student').forEach(el => {
  el.addEventListener('mouseenter', (e) => {
    const imgSrc = el.getAttribute('data-img');
    tooltip.style.backgroundImage = `url('${imgSrc}')`;
    tooltip.style.display = 'block';

    // Posicionar tooltip arriba y centrado respecto al texto
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    tooltip.style.top = (rect.top + scrollY - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
  });

  el.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});
