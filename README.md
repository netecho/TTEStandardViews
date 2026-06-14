# TTE HTML5 Standard Views Offline Copy

This folder is a local offline copy of:

https://pie.med.utoronto.ca/TTE/TTE_content/assets/applications/TTE-HTML5-SV/index.html

Run it through a local static server because the app loads `xml/TTE_Standard_Text_02.xml` with AJAX. Opening `index.html` directly with `file://` may block that XML request in Chrome.

## Start

From PowerShell:

```powershell
.\start_server.ps1
```

Then open the URL printed by the script, usually:

```text
http://127.0.0.1:8010/index.html
```

## Contents

- `index.html`: rewritten to use local vendor files
- `scripts/`: original app JavaScript and CSS
- `xml/`: view metadata
- `images/`: 20 standard TTE view folders, 5 image assets per view
- `vendor/`: CDN JavaScript, CSS, and Font Awesome fonts downloaded locally
