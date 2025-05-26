# Scan Dashboard Widgets

This document outlines the front-end widgets used to display KPIs from the emotion scan module.

- **FaceMoodCard** – shows facial valence and displays a happy emoji when joy exceeds 0.5.
- **VoiceToneCard** – visualises average voice valence with a gradient waveform.
- **VolatilitySparkline** – tiny line chart of facial arousal deviation.
- **TeamEmotionHeatmap** – small heatmap used on the admin dashboard.

All widgets rely on data returned by the `/me/scan/weekly` and `/org/{id}/scan/weekly` endpoints.
