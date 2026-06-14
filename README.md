# TTE HTML5 Standard Views Offline Copy

This folder is a local offline copy of:

https://pie.med.utoronto.ca/TTE/TTE_content/assets/applications/TTE-HTML5-SV/index.html

It can be opened directly as a static page. The original XML metadata is also bundled as `scripts/js/tte-data.js`, so Chrome does not need to make a blocked `file://` AJAX request.

## Start

Option 1: double-click `index.html`.

Option 2: run a local static server from PowerShell:

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
- `scripts/js/tte-data.js`: view metadata bundled for direct `file://` opening
- `xml/`: original view metadata
- `images/`: 20 standard TTE view folders, 5 image assets per view
- `vendor/`: CDN JavaScript, CSS, and Font Awesome fonts downloaded locally
