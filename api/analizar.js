export default async function handler(req, res) {
    // 1. Aquí Vercel SÍ puede leer la clave de forma ultra segura y oculta
    const apiKey = process.env.GEMINI_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: "Falta configurar la GEMINI_KEY en las variables de Vercel." });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { noticias } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 2. El Prompt que procesará la IA en el servidor
    const promptMaestro = `
    Actúa como un Director de Inteligencia Política senior especialista en la política peruana y la gestión municipal de Lima.
    Evalúa el siguiente paquete de noticias de nuestro monitoreo y crúzalo con la coyuntura nacional de HOY en el Perú usando tu buscador de Google Search.

    Noticias de nuestro Semáforo MML:
    ${JSON.stringify(noticias)}

    Devuelve tu análisis estrictamente en este formato HTML (usa etiquetas <p>, <ul>, <li> y <strong>):
    
    <p><strong>🎯 1. La Agenda Oculta y Framing:</strong> Analiza qué encuadre están queriendo posicionar hoy contra o a favor de la gestión.</p>
    <p><strong>🔗 2. Hilos Conductores:</strong> Conecta estas notas con antecedentes de la gestión (Vía Expresa Sur, peajes, Campo de Marte, etc).</p>
    <p><strong>⚠️ 3. Alerta de Flanco Débil:</strong> ¿Cuál es el flanco institucional más vulnerable para las próximas 48 horas?</p>
    `;

    const payload = {
        contents: [{ parts: [{ text: promptMaestro }] }],
        tools: [{ googleSearch: {} }] // Activa Google Search en vivo
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
