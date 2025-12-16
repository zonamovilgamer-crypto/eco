# API Specifications - Huerta Orgánica Platform

## Base URL
`https://api.huertaorganica.ar/v1`

## Endpoints

### 1. Calculadora de Sustrato
Calcula las cantidades de componentes necesarios para un volumen total deseado.

*   **Endpoint:** `POST /calculators/substrate`
*   **Description:** Recibe el volumen total (en litros) y el tipo de mezcla, devuelve la receta exacta.
*   **Request Body (JSON):**
    ```json
    {
      "target_volume_liters": 50,
      "mix_type": "maceta_universal" // Options: "semillero", "maceta_universal", "suelo"
    }
    ```
*   **Response (JSON):**
    ```json
    {
      "mix_name": "Sustrato Universal para Macetas",
      "total_liters": 50,
      "ingredients": [
        {"item": "Tierra Negra", "liters": 25, "percentage": "50%"},
        {"item": "Compost", "liters": 12.5, "percentage": "25%"},
        {"item": "Perlita", "liters": 12.5, "percentage": "25%"}
      ],
      "estimated_cost_ars": 2500
    }
    ```

### 2. Estimador de Compost
Calcula tiempo estimado de maduración basado en la mezcla de materiales (Relación C:N aproximada).

*   **Endpoint:** `POST /calculators/compost`
*   **Request Body (JSON):**
    ```json
    {
      "inputs": [
        {"material": "cesped_fresco", "volume_liters": 10},
        {"material": "hojas_secas", "volume_liters": 5}
      ],
      "season": "spring"
    }
    ```
*   **Response (JSON):**
    ```json
    {
      "cn_ratio_status": "Low Carbon (Too Wet)", 
      "advice": "Add more dry brown material (leaves/cardboard) to balance.",
      "estimated_days_to_harvest": 120
    }
    ```

### 3. Calendario Dinámico
Obtiene las tareas de siembra para la fecha actual y la zona geográfica.

*   **Endpoint:** `GET /calendars/planting`
*   **Query Params:**
    *   `lat`: Latitude (float) OR `zone_id` (string, e.g., "pampeana")
    *   `month`: Integer (1-12) [Optional, defaults to current]
*   **Example:** `GET /calendars/planting?zone_id=pampeana&month=10`
*   **Response (JSON):**
    ```json
    {
      "zone": "Región Pampeana",
      "month": "Octubre",
      "tasks": {
        "sow_indoor": ["Tomate", "Pimiento", "Berenjena"],
        "sow_outdoor": ["Zapallo", "Maíz", "Poroto", "Acelga"],
        "harvest": ["Haba", "Arveja", "Lechuga de invierno"]
      }
    }
    ```
