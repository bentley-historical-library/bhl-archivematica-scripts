Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements. That way we don't get anybody misspelling "disseminate"...

Processors will need to install Greasemonkey for Mozilla as well as the Add BHL Acts :
  1. Download latest addon from: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
  3. To write a new script, click on “New User Script” and fill in the details as follows:
  2. Name: Add BHL Acts
  3. Description: Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements.
  4. Includes: http://sandbox.archivematica.org/transfer/*/rights/grants/*/
  5. Includes: http://sandbox.archivematica.org/ingest/*/rights/grants/*/
  6. Click "OK"
  7. Copy and paste **add_bhl_acts.js** into the editor.
  8. Click "Save"
  9. Get to processing!
