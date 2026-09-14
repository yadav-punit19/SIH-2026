# Complete Netra ANPR and project cleanup

## What will change
- Add **Plate Recognition** to the authenticated dashboard navigation and render the completed upload/live-camera recognition interface.
- Keep the expanded 32-camera, 9-zone trajectory dataset and verify the larger network appears correctly.
- Replace project-owned placeholder branding, metadata, documentation, and error-reporting names with Netra branding.
- Remove obsolete duplicate project files where they are clearly unused, without changing generated authentication files.
- Verify signed-out login routing and the authenticated dashboard at desktop and mobile widths.

## Technical details
- Preserve framework packages and generated integration files that the hosted preview requires. The managed `.lovable` project metadata folder cannot be renamed safely inside this workspace; it is platform configuration, not visible in the app.
- The plate reader currently relies on the managed vision service. Removing that service reference would disable recognition unless another vision API and key are supplied.
- Git commit authorship is set by the account/process performing the commit, not by source files. This workspace's automated push may still show the platform bot; future commits pushed from your own Git account will show your configured name and email.
