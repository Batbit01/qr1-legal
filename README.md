# SommelierLab - QR1 Legal Web

Ficha digital legal generada automáticamente para vinos, conforme al Reglamento (UE) 2021/2117.

## Cómo funciona

La página index.html carga datos dinámicamente desde un endpoint `/api/vino-legal/:id`.

## Parámetros de URL

Usa la URL:

```
https://tu-web.vercel.app/?vino_id=V001
```

## Estructura esperada del endpoint

Debe devolver campos como:

- nombre
- ingredientes
- valor_energetico_kcal
- valor_energetico_kj
- alergenos
- url_qr2
