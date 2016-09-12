Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements. That way we don't get anybody misspelling "disseminate"...

Firefox
-------

Processors will need to install Greasemonkey for Mozilla as well as the Add BHL Acts script:
  1. Download latest addon from: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
  2. Restart Firefox.
  3. To write a new script, click on the Greasemonkey dropdown, select "New User Script...” and fill in the details as follows:
  4. Name: Add BHL Acts
  5. Description: Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements.
  6. Includes: http://sandbox.archivematica.org/transfer/*/rights/grants/*/
  7. Includes: http://sandbox.archivematica.org/ingest/*/rights/grants/*/
  8. Click "OK"
  9. Copy and paste **add_bhl_acts.js** into the editor.
  10. Click "Save"
  11. Get to processing!

Chrome
------

Processors will need to install Tampermonkey for Chrome as well as the Add BHL Acts script:
  1. Download latest addon from: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
  2. To write a new script, click on the Tampermonkey icon, select "Add a new script..."
  3. Copy and paste **add_bhl_acts.js** into the editor.
  4. Click "Save"
  5. Get to processing!
