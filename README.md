# SommelierLab — QR1 Legal (E-label UE)

E-label digital de vino conforme al Reglamento (UE) 2021/2117 (obligatorio desde 8-dic-2023).

## Qué cumple

- ✅ Lista completa de ingredientes con alérgenos resaltados en negrita
- ✅ Tabla nutricional por 100 ml (Reg. 1169/2011)
- ✅ Grado alcohólico, volumen, origen, embotellador, lote
- ✅ Pictogramas obligatorios (embarazadas) y opcionales (no conducir, reciclaje, vegan, bio)
- ✅ 27 idiomas: 24 UE + catalán, euskera, gallego
- ✅ Detección automática del idioma (URL → localStorage → navegador)
- ✅ Mobile-first, accesible (WCAG AA), sin cookies, sin tracking personal
- ❌ Sin enlaces comerciales (prohibido por el reglamento)
- ❌ Sin Google Analytics ni cookies de marketing

## Arquitectura

- `index.html` — página pública que se sirve en Vercel (dominio: `label.sommelierlab.com`)
- `qr1.labels.ue.json` — traducciones UI en 27 idiomas
- Datos del vino: se cargan desde Backblaze B2 en tiempo de ejecución
  - URL: `{CDN}/qr1/{vino_id}/{lang}.json`
  - Si falla el idioma pedido, intenta `en` y luego `es`

## URL del QR impreso

```
https://label.sommelierlab.com/?vino_id=V005&anyada=2021
```

Parámetros opcionales:
- `&lang=es` — fuerza idioma (si no, autodetecta)
- `&cdn=...` — override del CDN base (testing)
- `&file=...` — carga un JSON directo (testing)

## Schema del JSON por vino

Ver `schema.example.json`. Campos principales:

- `nombre`, `anyada`, `categoria`, `wine_type`
- `alcohol`, `volumen`, `origen`, `embotellador`, `lote`
- `ingredientes` (texto corrido), `alergenos` (array; se resaltan en negrita dentro de ingredientes)
- `nutricion` — objeto con `energy_kj`, `energy_kcal`, `fat_g`, `saturates_g`, `carbs_g`, `sugars_g`, `protein_g`, `salt_g`
- `pictogramas` — `pregnancy`, `no_drive`, `recycling` (glass/cap/cork), `vegan`, `vegetarian`, `organic`
- `bodega` — `nombre`, `logo_url`, `color_primario`

## Publicación del e-label

El dashboard (sommelierlab-dashboard) expone la pestaña "E-label (Ingredientes)" por vino/añada. Al guardar:
1. Genera el JSON por idioma
2. Lo sube a B2 en `qr1/{vino_id}/{lang}.json`
3. El QR impreso en la botella lo carga en el navegador del cliente

## Legal

Este e-label **no incluye ni debe incluir**:
- Enlaces a la web de la bodega, tienda online o redes sociales
- Cookies analíticas (Google Analytics, Meta Pixel, etc.)
- Datos identificativos del consumidor
- Marketing, publicidad o promoción

El analytics agregado (solo contador anónimo de escaneos por país) se recoge en servidor sin pasar por el navegador del cliente.

## Despliegue

El repo está conectado a Vercel como proyecto `qr1-legal`. Custom domain: `label.sommelierlab.com`.
