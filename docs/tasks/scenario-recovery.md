# Scenario recovery

Keep every standard scenario export within the import limit. Warn before reaching
the limit, reject changes that exceed it and preserve the previous save. Preserve
support for older scenario files. Detect an intervening save from another tab
before replacing browser storage.
