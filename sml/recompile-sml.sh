#!/bin/bash

# Deletes all .cm folders
find . -type d -name "\.cm" -exec rm -rf {} +

# Recompiles the whole code
sml -m unify.cm
