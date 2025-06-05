# Tür-zu-Tür Wahlkampf Tracker

Dieses Projekt stellt eine kleine Webanwendung bereit, um den Tür-zu-Tür Wahlkampf in Köln zu koordinieren. Auf einer Karte lassen sich Straßenabschnitte markieren und Teams sowie das Datum des letzten Besuchs hinterlegen. Nicht oder lange nicht besuchte Segmente werden farblich hervorgehoben.

## Installation

1. Abhängigkeiten installieren (am besten in einer virtuellen Umgebung):
   ```bash
   pip install -r requirements.txt
   ```
2. Anwendung starten:
   ```bash
   python app.py
   ```
   Anschließend ist die Anwendung unter http://localhost:5000 erreichbar.

## Nutzung

* Mit dem Zeichnen-Werkzeug können neue Straßenabschnitte als Linien auf der Karte eingezeichnet werden.
* Über das Panel rechts oben lässt sich ein Team sowie das Datum des letzten Besuchs eintragen und speichern.
* Bereits gespeicherte Segmente lassen sich anklicken, bearbeiten und erneut speichern.
* Die Farbe eines Segments zeigt an, wie lange der letzte Besuch zurückliegt:
  * **Grün** – Besuch innerhalb der letzten 30 Tage
  * **Rot** – Besuch älter als 30 Tage
  * **Orange** – noch kein Besuch eingetragen

Alle Daten werden lokal in der Datei `segments.db` gespeichert.
