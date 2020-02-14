#!/bin/bash

# -----------------------------------------------------------------------------
# User input
# -----------------------------------------------------------------------------
# Expected args:
#   $1  runId
# -----------------------------------------------------------------------------

runId=$1
echo "Staring $runId"

# -----------------------------------------------------------------------------
# directories temporarily swapped for testing
# -----------------------------------------------------------------------------

mkdir -p "/pvw/simulations/runs/$runId"
cd "/pvw/simulations/runs/$runId"

# -----------------------------------------------------------------------------

tclsh run.tcl $runId
echo "ParFlow Run Complete"

# -----------------------------------------------------------------------------
# Run EcoSLIM for particle tracking, this directory needs to be changed
# -----------------------------------------------------------------------------

export OMP_NUM_THREADS=2

FILE=./slimin.txt
if [[ -f "$FILE" ]]; then
  echo "Staring EcoSLIM"
  /opt/ecoslim/EcoSLIM.exe
  echo "EcoSLIM Run Complete"
fi

# -----------------------------------------------------------------------------
# Need to sleep in order to detect completion
# -----------------------------------------------------------------------------

echo "Complete All"
sleep 1
