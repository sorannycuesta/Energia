 CALCULADORA DE ENERGÍA 
   Lógica para estimar impacto ambiental y mix energético

/**
 * Inicializa los eventos de la calculadora
 */
function initCalculator() {
    const btnCalcular = document.getElementById('btnCalcular');
    const inputConsumo = document.getElementById('inputConsumo');
    
    if (!btnCalcular || !inputConsumo) return;

    btnCalcular.addEventListener('click', () => {
        const consumoKwh = parseFloat(inputConsumo.value);
        const anioSeleccionado = document.getElementById('selectAnio').value;
        
        // 1. Validaciones
        if (!validarEntrada(consumoKwh)) return;

        // 2. Obtener datos del mix energético (usando la constante RENEWABLES_BY_YEAR)
        const statsAnio = RENEWABLES_BY_YEAR[anioSeleccionado];

        // 3. Realizar cálculos
        const resultados = realizarCalculos(consumoKwh, statsAnio);

        // 4. Renderizar en pantalla
        mostrarResultados(resultados, anioSeleccionado);
    });
}

/**
 * Valida que el input sea un número positivo
 */
function validarEntrada(valor) {
    const errorDiv = document.getElementById('calcResult');
    if (isNaN(valor) || valor <= 0) {
        errorDiv.innerHTML = `
            <div class="alert-error">
                ⚠️ Por favor, ingresa un consumo mensual válido (mayor a 0).
            </div>`;
        return false;
    }
    return true;
}

/**
 * Lógica matemática pura
 * @returns {Object} Diccionario con los valores calculados
 */
function realizarCalculos(consumo, mix) {
    // Cálculo de energía limpia total
    const totalLimpia = (consumo * mix.total) / 100;
    
    // Desglose por fuente
    const desglose = {
        hidro: (consumo * mix.hydro) / 100,
        eolica: (consumo * mix.wind) / 100,
        solar: (consumo * mix.solar) / 100,
        otros: (consumo * (mix.bio + mix.geo)) / 100
    };

    // Impacto ambiental (Factor de emisión promedio: 0.4 kg CO2 por kWh ahorrado)
    const co2Ahorrado = totalLimpia * 0.4;

    return { totalLimpia, desglose, co2Ahorrado, consumoOriginal: consumo };
}

/**
 * Genera el HTML para los resultados
 */
function mostrarResultados(res, anio) {
    const container = document.getElementById('calcResult');
    
    container.innerHTML = `
        <div class="result-card fade-in">
            <h3>Resultados del Análisis (${anio})</h3>
            <p>De tu consumo de <strong>${res.consumoOriginal} kWh</strong>:</p>
            
            <div class="main-stat">
                <span class="number">${res.totalLimpia.toFixed(2)}</span>
                <span class="unit">kWh son Energía Verde</span>
            </div>

            <div class="breakdown">
                <h4>Desglose estimado:</h4>
                <ul>
                    <li>💧 <strong>Hidro:</strong> ${res.desglose.hidro.toFixed(2)} kWh</li>
                    <li>💨 <strong>Eólica:</strong> ${res.desglose.eolica.toFixed(2)} kWh</li>
                    <li>☀️ <strong>Solar:</strong> ${res.desglose.solar.toFixed(2)} kWh</li>
                    <li>🌿 <strong>Bio/Geo:</strong> ${res.desglose.otros.toFixed(2)} kWh</li>
                </ul>
            </div>

            <div class="environmental-impact">
                <p>🌱 Con este mix energético, dejas de emitir aprox. 
                   <strong>${res.co2Ahorrado.toFixed(2)} kg de CO₂</strong> al mes.</p>
            </div>
            
            <button class="btn-secondary" onclick="window.print()">
                📑 Descargar Reporte
            </button>
        </div>
    `;
}
